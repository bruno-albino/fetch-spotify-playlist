import puppeteer from 'puppeteer-extra';
import adBlocker from 'puppeteer-extra-plugin-adblocker';
import { getDownloadMp3Link } from './utils/getDownloadMp3Link';
import { download } from './utils/download';
import { getSongsByPlaylist } from './spotify/getSongsByPlaylist';
import { YoutubeAPI } from './youtube';
import { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI } from './utils/constants';
import { hasSongBeenDownloaded, writeSongInJsonFile } from './utils/helpers';
import { getSongsByAlbum } from './spotify/getSongsByAlbum';
import { ISpotifyMusic } from './spotify/interfaces';
import { YOUTUBE_QUOTE_MESSAGE } from './youtube/config';
import { getSongsByTrack } from './spotify/getSongByTrack';

(async () => {
  const args = process.argv
  const value = args[2]
  const isAlbum = value.includes('album')
  const isTrack = value.includes('track')
  const isPlaylist = value.includes('playlist')
  const isYoutube = value.includes('youtube')

  let musics: ISpotifyMusic[] = [];
  let title = '';
  let artist = '';
  if (isPlaylist) {
    musics = await getSongsByPlaylist(value)
  } else if (isAlbum) {
    musics = await getSongsByAlbum(value)
  } else if (isTrack) {
    musics = await getSongsByTrack(value)
  } else if(isYoutube) {
    title = args[3];
    artist = args[4];
  }

  const youtubeApi = new YoutubeAPI({
    clientId: YOUTUBE_CLIENT_ID,
    clientSecret: YOUTUBE_CLIENT_SECRET,
    redirectUri: YOUTUBE_REDIRECT_URI
  })
  puppeteer.use(adBlocker())
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 920
  });

  if (isYoutube) {
    console.log('Youtube link, generating mp3...')
    const downloadableLink = await getDownloadMp3Link({
      page,
      url: value,
    });
    console.log(`downloadable URL: ${downloadableLink}`);
    await download({ url: downloadableLink, fileName: `${artist} - ${title}.mp3` });
    writeSongInJsonFile({
      artist,
      title,
    })
    process.exit(0)
  }
  const filteredMusics = musics.filter(song => !hasSongBeenDownloaded(song))

  for (let i = 0; i < filteredMusics.length; i++) {
    const music = filteredMusics[i];
    console.log(`fetching ${music.title} (${i + 1}/${filteredMusics.length})`);

    let url = '';
    try {
      url = await youtubeApi.getYoutubeHrefLink(music);
      console.log(`youtube video URL: ${url}`);
    } catch (err) {
      console.log(err.message)
      if (err.message.includes(YOUTUBE_QUOTE_MESSAGE)) {
        console.log('youtube quota exceeded, try again later');
        process.exit(1)
      }
      console.log(`Skipping ${music.title}`);
      continue
    }

    const downloadableLink = await getDownloadMp3Link({
      page,
      url
    });
    console.log(`downloadable URL: ${downloadableLink}`);
    await download({ url: downloadableLink, fileName: `${music.artist} - ${music.title}.mp3` });
    writeSongInJsonFile(music)
  }

  await browser.close();
  console.log('done')
  process.exit(0);
})()

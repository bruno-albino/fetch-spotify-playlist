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

const playlistkey = '-playlist';
const albumkey = '-album';

(async () => {
  const args = process.argv
  if (args.length < 3) {
    console.log(`Usage: yarn dev ${playlistkey} <playlistId> or ${albumkey} <albumId>`)
    process.exit(1)
  }

  const key = args[2]
  if ([playlistkey, albumkey].indexOf(key) === -1) {
    console.log(`Usage: yarn dev ${playlistkey} <playlistId> or ${albumkey} <albumId>`)
    process.exit(1)
  }
  const value = args[3]
  let musics: ISpotifyMusic[] = [];
  if (key === playlistkey) {
    musics = await getSongsByPlaylist(value)
  } else {
    musics = await getSongsByAlbum(value)
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

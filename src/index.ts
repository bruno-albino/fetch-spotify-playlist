import puppeteer from 'puppeteer';
import { getDownloadMp3Link } from './utils/getDownloadMp3Link';
import { download } from './utils/download';
import { getSongsByPlaylist } from 'spotify/getSongsByPlaylist';
import { YoutubeAPI } from './youtube';
import { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI } from 'utils/constants';
import { hasSongBeenDownloaded, writeSongInJsonFile } from 'utils/helpers';

// 'https://open.spotify.com/playlist/5TA1QRUel3bMLgP5veRIMt'

(async () => {
  const args = process.argv
  if (args.length < 3) {
    console.log('Usage: yarn dev <playlistId>')
    process.exit(1)
  }
  const playlistId = args[2]

  const youtubeApi = new YoutubeAPI({
    clientId: YOUTUBE_CLIENT_ID,
    clientSecret: YOUTUBE_CLIENT_SECRET,
    redirectUri: YOUTUBE_REDIRECT_URI
  })
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({
    width: 1280,
    height: 920
  });

  const musics = await getSongsByPlaylist(playlistId)
  const filteredMusics = musics.filter(song => !hasSongBeenDownloaded(song))

  const downloadableLinks: Promise<void>[] = []

  for (let i = 0; i < filteredMusics.length; i++) {
    const music = filteredMusics[i];
    console.log(`fetching ${music.title} (${i + 1}/${filteredMusics.length})`);

    const url = await youtubeApi.getYoutubeHrefLink(music);
    console.log(`youtube video URL: ${url}`);

    const downloadableLink = await getDownloadMp3Link({
      page,
      url
    });
    console.log(`downloadable URL: ${downloadableLink}`);
    await download({ url: downloadableLink, fileName: `${i + 1} - ${music.artist} - ${music.title}.mp3` });
    writeSongInJsonFile(music)
  }

  await Promise.all(downloadableLinks);
  await browser.close();
  console.log('done')
  process.exit(0);
})()

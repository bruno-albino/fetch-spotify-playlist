import puppeteer from 'puppeteer';
import { getDownloadMp3Link } from './getDownloadMp3Link';
import { getYoutubeHrefLink } from './getYoutubeHrefLink';
import { download, IDownloadParams } from './download';
import { getSongsByPlaylist } from 'spotify/getSongsByPlaylist';

(async () => {
  const musics = await getSongsByPlaylist('5TA1QRUel3bMLgP5veRIMt')

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
  // await page.setViewport({
  //   width: 1280,
  //   height: 920
  // });

  // const downloadableLinks: Promise<void>[] = []

  // for (let i = 0; i < musics.length; i++) {
  //   const music = musics[i];
  //   console.log(`fetching ${music.title} (${i + 1}/${musics.length})`);

  //   const url = await getYoutubeHrefLink({
  //     page,
  //     music
  //   });
  //   console.log(`youtube video URL: ${url}`);

  //   const downloadableLink = await getDownloadMp3Link({
  //     page,
  //     url
  //   });
  //   console.log(`downloadable URL: ${downloadableLink}`);
  //   downloadableLinks.push(download({
  //     url: downloadableLink,
  //     fileName: `${i + 1} - ${music.artist} - ${music.title}.mp3`
  //   }))
  // }

  // await Promise.all(downloadableLinks);
  // await browser.close();
  // console.log('done')
  // process.exit(0);
})()

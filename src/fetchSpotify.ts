import { Page } from "puppeteer";
import { delay } from "./utils";

const DELAY = 3000;

interface IFetchSpotifyParams {
  page: Page;
  url: string;
}

export interface IMusic {
  artist: string;
  title: string;
}

export const fetchSpotifySongs = async ({ page, url }: IFetchSpotifyParams) => {
  console.log('fetching spotify');
  await page.goto(url, {
    waitUntil: "networkidle0"
  });
  await page.setViewport({
    width: 1200,
    height: 1000000
  });
  await delay(DELAY);

  console.log('collecting musics artist and title');
  const musics = await page.evaluate(() => {
    const data: IMusic[] = [];
    const elements = document.getElementsByClassName('standalone-ellipsis-one-line');
    for (let i = 5; i < elements.length; i++) {
    // for (let i = 5; i < 8; i++) {
      // ARTIST IS SPAN TAG
      if (elements[i].tagName === 'SPAN') {
        const artist = elements[i].textContent;
        const title = elements[i - 1].textContent;
        data.push({
          artist,
          title
        });
      }
    }
    return data;
  });

  return musics;
}

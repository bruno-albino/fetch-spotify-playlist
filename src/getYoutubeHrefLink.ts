import { Page } from "puppeteer";
import { delay } from "./utils";
import { ISpotifyMusic } from "spotify/config";

interface IGetYoutubeHrefLinkParams {
  page: Page;
  music: ISpotifyMusic;
}

const DELAY = 1000;

export const getYoutubeHrefLink = async ({ page, music }: IGetYoutubeHrefLinkParams): Promise<string> => {
  const musicQuery = `${music.artist.split(' ').join('+')}+${music.title.split(' ').join('+')}`;
  const youtubeLink = `https://www.youtube.com/results?search_query=${musicQuery}`;
  await page.goto(youtubeLink);
  await delay(DELAY);
  
  const elementHandles = await page.$$('a');
  const propertyJsHandles = await Promise.all(
    elementHandles.map(handle => handle.getProperty('href'))
  );
  const hrefs = await Promise.all(
    propertyJsHandles.map(handle => handle.jsonValue() as unknown as string)
  );
  const hrefIndex = hrefs.findIndex(href => href.includes('watch'));
  return hrefs[hrefIndex];
}

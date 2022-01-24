import { Page } from "puppeteer";
import { DOWNLOAD_PATH } from "utils/constants";
import { delay } from "utils/helpers";

const DELAY = 1000;
const MP3_TAB_FULL_X_PATH = '/html/body/div[1]/div/div/div/div[1]/div/div[1]/div/div[4]/div/div[2]/ul/li[2]/a'
const MP3_256_KBPS_X_PATH = '/html/body/div[1]/div/div/div/div[1]/div/div[1]/div/div[4]/div/div[2]/div/div[2]/table/tbody/tr[2]/td[3]/button'
const MP3_352_KBPS_X_PATH = '/html/body/div[1]/div/div/div/div[1]/div/div[1]/div/div[4]/div/div[2]/div/div[2]/table/tbody/tr[1]/td[3]/button'
const DOWNLOAD_BUTTON_MODAL = '/html/body/div[3]/div[2]/div/div[2]/div[2]/div/a[1]'

export interface IGetDownloadMp3LinkParams {
  page: Page;
  url: string;
}

export const getDownloadMp3Link = async ({ url, page }: IGetDownloadMp3LinkParams): Promise<string> => {
  await page.goto(url.replace('youtube', 'youtubezz'));
  await delay(DELAY);

  // @ts-ignore
  await page._client.send('Page.setDownloadBehavior', {
    behavior: 'allow',
    downloadPath: DOWNLOAD_PATH
  });

  await delay(DELAY);
  await click(page, MP3_TAB_FULL_X_PATH)
  await click(page, MP3_256_KBPS_X_PATH)

  await page.bringToFront()
  await delay(DELAY);
  
  const downloadButtonModalElement = (await page.$x(DOWNLOAD_BUTTON_MODAL))[0];
  const hrefJson = await downloadButtonModalElement.getProperty('href')
  const downloadLink: string = await hrefJson.jsonValue();
  return downloadLink;
}

const click = async (page: Page, xPath: string) => {
  const element = (await page.$x(xPath))[0];
  await element.click();
  await delay(DELAY);
}

import axios from "axios";
import path from "path";
import fs from "fs";
import { DOWNLOAD_PATH } from "utils/constants";

export interface IDownloadParams {
  url: string;
  fileName: string;
}


export const download = async ({ fileName, url }: IDownloadParams): Promise<void> => {
  console.log(`Downloading ${fileName}`)
  const res = await axios.get(url, {
    responseType: 'stream'
  })

  const writer = fs.createWriteStream(path.join(DOWNLOAD_PATH, fileName));

  return new Promise((resolve, reject) => {
    res.data.pipe(writer);
    let error = null;
    writer.on('error', err => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve(null);
      }
    });
  });
}

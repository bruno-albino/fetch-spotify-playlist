import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { YOUTUBE_ACCESS_SCOPES, YOUTUBE_TOKEN_DIR, YOUTUBE_TOKEN_PATH } from './config';
import { OAuth2Client } from 'google-auth-library';
import { ISpotifyMusic } from 'spotify/interfaces';
// import promisify from ''
const { OAuth2 } = google.auth;

const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=';
interface YoutubeAPIParams {
  clientSecret: string;
  redirectUri: string;
  clientId: string;
}
export class YoutubeAPI {
  private oauth2Client: OAuth2Client;

  constructor({ clientId, clientSecret, redirectUri }: YoutubeAPIParams) {
    this.oauth2Client = new OAuth2(clientId, clientSecret, redirectUri);
  }

  private async authorize() {
    try {
      const token = fs.readFileSync(YOUTUBE_TOKEN_PATH);
      this.oauth2Client.credentials = JSON.parse(Buffer.from(token).toString());
    } catch(err) {
      await this.getToken();
    }
  }

  private async getToken() {
    const authUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: YOUTUBE_ACCESS_SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    return new Promise((resolve, reject) => {
      rl.question('Enter the code from that page here: ', code => {
        rl.close();
        this.oauth2Client.getToken(code, (err, token) => {
          if (err) {
            console.log('Error while trying to retrieve access token', err);
            reject();
          }
          this.oauth2Client.credentials = token;
          this.storeToken(token);
          resolve(null);
        });
      });
    })
  }

  private async storeToken(token: any) {
    try {
      fs.mkdirSync(YOUTUBE_TOKEN_DIR);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(YOUTUBE_TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) throw err;
      console.log('Token stored to ' + YOUTUBE_TOKEN_PATH);
    });
  }

  public async getYoutubeHrefLink(music: ISpotifyMusic): Promise<string> {
    await this.authorize();
    const query = music.artist + ' - ' + music.title;
    const service = google.youtube('v3');

    return new Promise((resolve, reject) => {
      service.search.list({ auth: this.oauth2Client, part: [], q: query }, function(err, response) {
        if (err) {
          reject('The API returned an error: ' + err);
        }
        const result = `${YOUTUBE_VIDEO_URL}${response.data.items[0].id.videoId}`;
        resolve(result);
      });
    })
  }
}

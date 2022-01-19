import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';
import { YOUTUBE_ACCESS_SCOPES } from './config';
import { OAuth2Client } from 'google-auth-library';

const { OAuth2 } = google.auth;


const TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', async function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  const auth = await authorize(JSON.parse(Buffer.from(content).toString()));
  getChannel(auth);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = async (credentials: any): Promise<OAuth2Client> => {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  let oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  return new Promise((resolve, reject) => {
    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, async function(err, token) {
      if (err) {
        oauth2Client = await getNewToken(oauth2Client);
      } else {
        oauth2Client.credentials = JSON.parse(Buffer.from(token).toString());
        resolve(oauth2Client);
      }
    });
  })
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
const getNewToken = async (oauth2Client: OAuth2Client): Promise<OAuth2Client> => {
  const authUrl = oauth2Client.generateAuthUrl({
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
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          console.log('Error while trying to retrieve access token', err);
          reject();
        }
        oauth2Client.credentials = token;
        storeToken(token);
        resolve(oauth2Client);
      });
    });
  })
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
const storeToken = (token: any) => {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth: OAuth2Client) {
  const service = google.youtube('v3');
  service.channels.list({
    auth: auth,
    part: ['snippet,contentDetails,statistics'],
    forUsername: 'GoogleDevelopers'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var channels = response.data.items;
    if (channels.length === 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);
    }
  });
}

import fs from 'fs'
import { ISpotifyMusic } from '../spotify/interfaces';
import { SONGS_JSON_PATH } from './constants';

/**
 * Delay execution of a function
 * @param ms delay in milliseconds
 * @returns promise that resolves after ms milliseconds
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
* Generates a random string containing numbers and letters
* @param  {number} length The length of the string
* @return {string} The generated string
*/
export const generateRandomString = (length: number): string => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
 
export const hasSongBeenDownloaded = (song: ISpotifyMusic): boolean => {
  const file = fs.readFileSync(SONGS_JSON_PATH, 'utf8');
  const musics = JSON.parse(file) as ISpotifyMusic[];
  return musics.some(music => music.title.toLowerCase() === song.title.toLowerCase() && music.artist.toLowerCase() === song.artist.toLowerCase());
}

export const writeSongInJsonFile = (song: ISpotifyMusic) => {
  const file = fs.readFileSync(SONGS_JSON_PATH, 'utf8');
  const musics = JSON.parse(file) as ISpotifyMusic[];
  musics.push(song);
  fs.writeFileSync(SONGS_JSON_PATH, JSON.stringify(musics));
}

import axios from "axios";
import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "../constants";

export const SPOTIFY_STATE_KEY = 'spotify_auth_state';
export const SPOTIFY_ACCESS_SCOPE = 'user-read-private user-read-email';
export const SPOTIFY_API_END_POINT = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNT_END_POINT = 'https://accounts.spotify.com';

export const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_END_POINT,
})

export const spotifyAccountsApi = axios.create({
  baseURL: SPOTIFY_ACCOUNT_END_POINT + '/api',
  headers: {
    'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

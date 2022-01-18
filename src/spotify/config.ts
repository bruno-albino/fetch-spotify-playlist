import axios from "axios";

export interface ISpotifyMusic {
  artist: string;
  title: string;
}

export const SPOTIFY_STATE_KEY = 'spotify_auth_state';
export const SPOTIFY_CLIENT_ID = '236d9869deb44d02864bd5b03ac7fdbc';
export const SPOTIFY_CLIENT_SECRET = '142c6277ffea44dcb425a7c87b083397';
export const SPOTIFY_REDIRECT_URI = 'http://localhost:8888/callback';
export const SPOTIFY_ACCESS_SCOPE = 'user-read-private user-read-email';
export const SPOTIFY_API_END_POINT = 'https://api.spotify.com/v1';
export const SPOTIFY_ACCOUNT_END_POINT = 'https://accounts.spotify.com/api';

export const spotifyApi = axios.create({
  baseURL: SPOTIFY_API_END_POINT,
})

export const spotifyAccountsApi = axios.create({
  baseURL: SPOTIFY_ACCOUNT_END_POINT,
  headers: {
    'Authorization': 'Basic ' + (Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString('base64')),
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})

import express from 'express'
import { generateRandomString } from '../utils';
import { SPOTIFY_ACCESS_SCOPE, SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_STATE_KEY } from './config';

export const setupRoutes = (app: express.Application) => {
  app.get('/', function(req, res) {
    const state = generateRandomString(16);
    res.cookie(SPOTIFY_STATE_KEY, state);
    const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?' + new URLSearchParams({
      response_type: 'code',
      client_id: SPOTIFY_CLIENT_ID,
      scope: SPOTIFY_ACCESS_SCOPE,
      redirect_uri: SPOTIFY_REDIRECT_URI,
      state
    })
    res.redirect(spotifyAuthUrl);
  });
  app.get('/finish', (req, res) => {
    res.send('Spotify account verified. You can close this window.')
  })
}

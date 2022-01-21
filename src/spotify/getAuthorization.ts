import { AxiosResponse } from 'axios';
import { SPOTIFY_REDIRECT_URI, PORT } from '../utils/constants';
import express from 'express'
import { Server } from 'http'
import { spotifyAccountsApi, SPOTIFY_STATE_KEY } from './config';
import { ISpotifyTokenResponse } from './interfaces';

export const getAuthorization = (app: express.Application, callback: (server: Server) => void): Promise<ISpotifyTokenResponse> => {
  return new Promise((resolve, reject) => {
    app.get('/callback', async (req, res) => {
      const code = req.query.code || null;
      const state = req.query.state || null;
      const storedState = req.cookies ? req.cookies[SPOTIFY_STATE_KEY] : null;
     
      if (state === null || state !== storedState) {
        res.redirect('/#' + new URLSearchParams({ error: 'state_mismatch' }));
        return;
      }
    
      res.clearCookie(SPOTIFY_STATE_KEY);

      const params = new URLSearchParams({
        code: String(code),
        redirect_uri: SPOTIFY_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
      const response = await spotifyAccountsApi.post<any, AxiosResponse<ISpotifyTokenResponse>>('/token', params)

      resolve(response.data)
      res.redirect('finish')
    });
    const server = app.listen(PORT)
    callback(server)
  })
}

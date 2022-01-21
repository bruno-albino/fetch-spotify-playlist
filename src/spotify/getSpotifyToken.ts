import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Server } from 'http'
import open from 'open'
import { setupRoutes } from './setupRoutes'
import { getAuthorization } from './getAuthorization'
import { API_ENDPOINT } from '../utils/constants'

const app = express();
app.use(cors());
app.use(cookieParser());
let server: Server | null = null;
setupRoutes(app)

export const getSpotifyToken = async (): Promise<string> => {
  console.log('Log in your Spotify account in the opened browser')
  open(API_ENDPOINT) 
  const result = await getAuthorization(app, result => {
    server = result
  })
  // close server after gets access token
  server.close()
  const token = result.access_token
  console.log('Successfully logged in')
  return token
}

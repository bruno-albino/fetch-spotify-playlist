import { config } from 'dotenv-safe'
config()

const getEnvVar = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} is not defined`)
  }
  return value
}

export const SPOTIFY_CLIENT_ID = getEnvVar('SPOTIFY_CLIENT_ID')
export const SPOTIFY_CLIENT_SECRET = getEnvVar('SPOTIFY_CLIENT_SECRET')
export const SPOTIFY_REDIRECT_URI = getEnvVar('SPOTIFY_REDIRECT_URI')
export const PORT = getEnvVar('PORT')
export const API_ENDPOINT = getEnvVar('API_ENDPOINT')
export const YOUTUBE_API_KEY = getEnvVar('YOUTUBE_API_KEY')

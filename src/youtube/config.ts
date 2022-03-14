export const YOUTUBE_ACCESS_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

export const YOUTUBE_TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.credentials/';
export const YOUTUBE_TOKEN_PATH = YOUTUBE_TOKEN_DIR + 'youtube-fetch-spotify-playlist-token.json';
export const YOUTUBE_VIDEO_URL = 'https://www.youtube.com/watch?v=';
export const YOUTUBE_QUOTE_MESSAGE = 'The request cannot be completed because you have exceeded your';

export interface IPlaylistResponse {
  href: string;
  items: {
    track: {
      name: string;
      artists: {
        name: string;
      }[]
    }
  }[],
  limit: number;
  next: string;
  offset: number;
  previous: string;
  total: number;
}

export interface ISpotifyMusic {
  artist: string;
  title: string;
}

export interface ISpotifyTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}


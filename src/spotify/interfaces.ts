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

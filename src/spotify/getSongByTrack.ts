import { spotifyApi } from "./config"
import { getSpotifyToken } from "./getSpotifyToken"
import { ISpotifyMusic, ITrackResponse } from "./interfaces";

export const getSongsByTrack = async (fullTrackId: string): Promise<ISpotifyMusic[]> => {
  const trackId = fullTrackId.includes('open.spotify.com') ? fullTrackId.split('/').pop() : fullTrackId;
  const token = await getSpotifyToken()

  console.log('Getting track...')
  const response = await spotifyApi.get<ITrackResponse>(`tracks/${trackId}`, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  console.log('Getting song track... done.')
  return [
    {
      artist: response.data.artists[0].name,
      title: response.data.name,
    }
  ]
}

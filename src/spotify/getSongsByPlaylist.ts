import { spotifyApi } from "./config"
import { getSpotifyToken } from "./getSpotifyToken"
import { IPlaylistResponse, ISpotifyMusic } from "./interfaces";

const LIMIT = 100;
let offset = 0;

export const getSongsByPlaylist = async (fullPlaylistId: string): Promise<ISpotifyMusic[]> => {
  const playlistId = fullPlaylistId.includes('open.spotify.com') ? fullPlaylistId.split('/').pop() : fullPlaylistId;
  const token = await getSpotifyToken()

  console.log('Getting songs from playlist...')
  const musics: ISpotifyMusic[] = []
  let nextPage = ''

  const getPlaylistTracks = async (offset: number): Promise<IPlaylistResponse> => {
    const response = await spotifyApi.get<IPlaylistResponse>(`playlists/${playlistId}/tracks?limit${LIMIT}&offset=${offset}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    return response.data
  }

  do {
    const response = await getPlaylistTracks(offset)
    for (const item of response.items) {
      const track = item.track
      const artists = track.artists.map((artist: any) => artist.name).join(', ')
      musics.push({
        title: track.name,
        artist: artists
      })
    }
    nextPage = response.next
    offset += LIMIT
  } while(nextPage)

  console.log(`Getting songs from playlist... done. ${musics.length} musics found`)
  return musics;
}

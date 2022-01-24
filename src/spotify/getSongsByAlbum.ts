import { spotifyApi } from "./config"
import { getSpotifyToken } from "./getSpotifyToken"
import { IAlbumResponse, ISpotifyMusic } from "./interfaces";

const LIMIT = 100;
let offset = 0;

export const getSongsByAlbum = async (fullAlbumId: string): Promise<ISpotifyMusic[]> => {
  const albumId = fullAlbumId.includes('open.spotify.com') ? fullAlbumId.split('/').pop() : fullAlbumId;
  const token = await getSpotifyToken()

  console.log('Getting songs from album...')
  const musics: ISpotifyMusic[] = []
  let nextPage = ''

  const getAlbumTracks = async (offset: number): Promise<IAlbumResponse> => {
    const response = await spotifyApi.get<IAlbumResponse>(`albums/${albumId}/tracks?limit${LIMIT}&offset=${offset}`, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    return response.data
  }

  do {
    const response = await getAlbumTracks(offset)
    for (const item of response.items) {
      const artists = item.artists.map((artist: any) => artist.name).join(', ')
      musics.push({
        title: item.name,
        artist: artists
      })
    }
    nextPage = response.next
    offset += LIMIT
  } while(nextPage)

  console.log(`Getting songs from album... done. ${musics.length} musics found`)
  return musics;
}

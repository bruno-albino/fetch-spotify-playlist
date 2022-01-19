import axios from "axios"
import { YOUTUBE_API_KEY } from "../constants"

const init = async () => {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      headers: {
        'Authorization': 'Bearer ' + YOUTUBE_API_KEY
      }
    })
    console.log(response.data)
  } catch(err) {
    console.log(err)
    console.log(YOUTUBE_API_KEY)
  }
}

init()

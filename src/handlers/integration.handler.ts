import { GOOGLE_ALBUM_LIST_PATH, GOOGLE_AUTH_PATH, GOOGLE_MEDIA_LIST_PATH } from "@/config/routes"
import API from "@/lib/api"

export const checkGoogleAuth = () => {
  return API.get(GOOGLE_AUTH_PATH)
}
export const listGoogleAlbums = () => {
  return API.get(GOOGLE_ALBUM_LIST_PATH)
}

export const listGoogleMedia = (albumId: string) => {
  return API.get(GOOGLE_MEDIA_LIST_PATH, { albumId })
}
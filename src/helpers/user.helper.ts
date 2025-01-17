import { ENV } from "@/config/environment"
import { IUser } from "@/types/user"

export const getUserHeaders = (user: {
  isUsingAPIKey?: boolean,
  isUsingShareKey?: boolean,
  accessToken?: string
}, otherHeaders?: {
  'Content-Type': string
}) => {
  let headers: {
    'Content-Type': string;
    'x-api-key'?: string;
    'Authorization'?: string
  } = {
    'Content-Type': 'application/json',
  }
  if (user.isUsingShareKey) {
    headers['x-api-key'] = ENV.IMMICH_SHARE_LINK_KEY
  } else if (user.isUsingAPIKey) {
    headers['x-api-key'] = ENV.IMMICH_API_KEY
  } else {
    headers['Authorization'] = `Bearer ${user.accessToken}`
  }
  
  return {...headers, ...otherHeaders}
}
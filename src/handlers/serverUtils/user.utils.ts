import { appConfig } from "@/config/app.config"
import { ENV } from "@/config/environment"
import { getCookie } from "@/lib/cookie"
import { decodeJWT } from "@/lib/jwt"
import { NextApiRequest } from "next"


export const getCurrentUserFromAPIKey = () => {
  if (!ENV.IMMICH_URL || !ENV.IMMICH_API_KEY) return null;

  return fetch(ENV.IMMICH_URL + "/api/users/me", {
    headers: {
      'x-api-key': ENV.IMMICH_API_KEY,
      Accept: "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    return null
  })
}

export const getCurrentUserFromAccessToken = (token: string) => {
  return fetch(ENV.IMMICH_URL + "/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    return null
  })
}

export const getCurrentUser = async (req: NextApiRequest) => {
  const session = getCookie(req, appConfig.sessionCookieName)
  
  if (session) {
    const user = await getCurrentUserFromAccessToken(session)
    return {
      ...user,
      accessToken: session,
    }
  }

  return getCurrentUserFromAPIKey()
}

export const loginUser = async (email: string, password: string) => {
  const res = await fetch(ENV.IMMICH_URL + "/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (res.ok) {
    return res.json()
  }

  return null
}
import { appConfig } from "@/config/app.config"
import { connectDB, db } from "@/config/db"
import { ENV } from "@/config/environment"
import { APIError } from "@/lib/api"
import { getCookie } from "@/lib/cookie"
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
      return res.json().then((user) => {
        return {
          ...user,
          isUsingAPIKey: true,
        }
      })
    }
    throw new APIError({
      message: "Invalid API key. Please check your API key variable `IMMICH_API_KEY` in the .env file",
      status: 403,
    });
  })
  .catch((error) => {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError({
      message: "Failed to connect to Immich API: " + ENV.IMMICH_URL,
      status: 500,
    });
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
  }).catch((error) => {
    throw new APIError({
      message: "Failed to connect to Immich API: " + ENV.IMMICH_URL,
      status: 500,
    });
  })
}

export const getCurrentUser = async (req: NextApiRequest) => {
  await connectDB(db);
  const session = getCookie(req, appConfig.sessionCookieName)
  
  if (session) {
    const user = await getCurrentUserFromAccessToken(session)
    if (!user) return null
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

export const logoutUser = async (Authorization: string) => {
  const res = await fetch(ENV.IMMICH_URL + "/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization" : "Bearer " + Authorization
    },
    
  })

  if (res.ok) {
    return res.json()
  }

  return null
}
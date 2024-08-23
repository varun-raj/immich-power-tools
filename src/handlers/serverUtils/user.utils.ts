import { ENV } from "@/config/environment"

export const getCurrentUser = () => {
  return fetch(ENV.IMMICH_URL + "/api/users/me", {
    headers: {
      'x-api-key': ENV.IMMICH_API_KEY,
      Accept: "application/json",
    },
  }).then((res) => {
    if (res.ok) {
      return res.json()
    }
    throw new Error("Failed to fetch user")
  })
}
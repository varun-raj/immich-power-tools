// src/pages/api/googleAuthCallback.ts
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

const GOOGLE_ALBUMS_URL = "https://photoslibrary.googleapis.com/v1/albums";

export default async function googleListAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = await cookie.parse(req.headers.cookie || "");
  const googleAuthToken = cookies.googleAccessToken;

  if (!googleAuthToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return fetch(GOOGLE_ALBUMS_URL, {
    headers: {
      Authorization: `Bearer ${googleAuthToken}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch albums");
      }
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error fetching Google albums:", error);
      res.status(500).json({ error: "Failed to fetch albums" });
    });
}

// src/pages/api/googleAuthCallback.ts
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

const GOOGLE_ALBUM_MEDIA_URL = "https://photoslibrary.googleapis.com/v1/mediaItems:search";

export default async function googleListAlbums(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { albumId } = req.query;
  if (!albumId) {
    return res.status(400).json({ error: "Missing albumId" });
  }
  const cookies = await cookie.parse(req.headers.cookie || "");
  const googleAuthToken = cookies.googleAccessToken;

  if (!googleAuthToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  return fetch(GOOGLE_ALBUM_MEDIA_URL, {
    headers: {
      Authorization: `Bearer ${googleAuthToken}`,
    },
    method: "POST",
    body: JSON.stringify({
      albumId: albumId,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch media items");
      }
      return response.json();
    })
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error("Error fetching Google media items:", error);
      res.status(500).json({ error: "Failed to fetch media items" });
    });
}

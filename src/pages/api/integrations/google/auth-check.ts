// src/pages/api/googleAuthCallback.ts
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie";

export default async function googleAuthCallback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const cookies = await cookie.parse(req.headers.cookie || "");
  const googleAuthToken = cookies.googleAccessToken;

  if (!googleAuthToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized", cookie: req.headers.cookie });
  }

  return res
    .status(200)
    .json({ message: "Authorized", success: true, cookie: googleAuthToken });
}

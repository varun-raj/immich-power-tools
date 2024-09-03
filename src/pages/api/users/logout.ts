// pages/api/proxy.js

import { appConfig } from "@/config/app.config";
import { getCurrentUser, logoutUser } from "@/handlers/serverUtils/user.utils";
import { serializeCookie } from "@/lib/cookie";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }


  try {
    const user = await getCurrentUser(req);
    const result = await logoutUser(user.accessToken as string);
    if (result.successful) {
      res.setHeader("Set-Cookie", serializeCookie(appConfig.sessionCookieName, ""));
      return res.status(200).json({ message: "Logged out successfully" });
    } else {
      return res.status(403).json({ message: "Invalid User Credentials" });
    }
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

import { appConfig } from "@/config/app.config";
import { loginUser } from "@/handlers/serverUtils/user.utils";
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

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await loginUser(email, password);
  if (user) {
    res.setHeader("Set-Cookie", serializeCookie(appConfig.sessionCookieName, user.accessToken));
    return res.status(200).json(user);
  }
  else {
    return res.status(403).json({ message: "Invalid User Credentials" });
  }

}

// pages/api/proxy.js

import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET")
  
  return res.status(405).json({ message: "Method Not Allowed" });

  const user = await getCurrentUser(req);
  console.log("currentUser.accessToken:", user);

  if (user) return res.status(200).json(user);

  return res.status(403).json({ message: "Forbidden" });
}

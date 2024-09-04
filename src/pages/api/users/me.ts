// pages/api/proxy.js

import { ENV } from "@/config/environment";
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
  if (req.method !== "GET")  {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const user = await getCurrentUser(req);

    if (user) return res.status(200).json(user);

    return res.status(403).json({ message: "Forbidden" });
    
  } catch (error) {
    return res.status(500).json(error);
  }
}

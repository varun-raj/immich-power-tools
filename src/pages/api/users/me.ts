import { db } from "@/config/db";
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
    if (!db) {
      return res.status(500).json({ message: "Database connection failed" });
    }

    const user = await getCurrentUser(req);
    
    if (user) return res.status(200).json(user);

    return res.status(403).json({ message: "Forbidden" });
    
  } catch (error: any) {
    return res.status(500).json({
      message: error.message ||"Internal Server Error",
      error: error.error || "Internal Server Error",
    });
  }
}

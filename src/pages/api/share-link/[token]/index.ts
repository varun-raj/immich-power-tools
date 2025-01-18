import { NextApiResponse } from "next";

import { ENV } from "@/config/environment";
import { ShareLinkFilters } from "@/types/shareLink";
import { verify } from "jsonwebtoken";
import { NextApiRequest } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  const decoded = verify(token as string, ENV.JWT_SECRET);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json(decoded);
}

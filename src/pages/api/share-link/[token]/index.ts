import { NextApiResponse } from "next";

import { ENV } from "@/config/environment";
import { ShareLinkFilters } from "@/types/shareLink";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { NextApiRequest } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  try {

  if (!token) {
    return res.status(404).json({ message: "Token not found" });
  }

  if (!ENV.IMMICH_SHARE_LINK_KEY) {
    return res.status(401).json({ message: "Please check your link and try again. If you're the admin, check if you've enabled all the configurations in the Immich Power Tools in your environment variables" });
  }

  const decoded = verify(token as string, ENV.JWT_SECRET);


  if (!decoded) {
    return res.status(401).json({ message: "Link is invalid. Please check your link and try again" });
  }


  return res.status(200).json(decoded);
} catch (error) {
  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ message: "Please check your link and try again. Looks like it's expired." });
  }
  return res.status(500).json({ message: (error as Error).message });
}
}

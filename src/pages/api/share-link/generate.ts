
import { ENV } from "@/config/environment";
import { SHARE_LINK_ASSETS_PATH } from "@/config/routes";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getCurrentUser(req);
  const filters = req.body;

  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!ENV.IMMICH_SHARE_LINK_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(filters);
  const token = sign(filters, ENV.JWT_SECRET);
  return res.status(200).json({ link: `${ENV.POWER_TOOLS_ENDPOINT_URL}/s/${token}` });
}
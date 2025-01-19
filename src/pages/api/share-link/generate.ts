
import { ENV } from "@/config/environment";
import { getCurrentUser } from "@/handlers/serverUtils/user.utils";
import { sign } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getCurrentUser(req);
  const allFilters = req.body;
  const { expiresIn, ...filters } = allFilters;

  try {
  if (!currentUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!ENV.IMMICH_SHARE_LINK_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log(expiresIn);

  const token = sign(filters, ENV.JWT_SECRET, expiresIn !== "never" ? {
    expiresIn: expiresIn
  } : {});

    return res.status(200).json({ link: `${ENV.POWER_TOOLS_ENDPOINT_URL}/s/${token}` });
  } catch (error) {
    return res.status(500).json({ message: (error as Error).message });
  }
}

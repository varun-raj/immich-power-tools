import { db } from "@/config/db";
import { ENV } from "@/config/environment";
import { count, desc, gte, isNotNull, lte, ne } from "drizzle-orm";
import { eq, inArray } from "drizzle-orm";
import { assetFaces, assets, exif, person } from "@/schema";
import { and } from "drizzle-orm";
import { JsonWebTokenError, sign, verify } from "jsonwebtoken";
import { NextApiResponse } from "next";

import { NextApiRequest } from "next";
import { albums } from "@/schema/albums.schema";
import { albumsAssetsAssets } from "@/schema/albumAssetsAssets.schema";
import { ASSET_SHARE_THUMBNAIL_PATH, DOWNLOAD_ASSETS_PATH, SHARE_LINK_DOWNLOAD_PATH } from "@/config/routes";
import { getUserHeaders } from "@/helpers/user.helper";

interface ShareLinkFilters {
  personIds: string[];
  albumIds: string[];
  startDate: string;
  endDate: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { token } = req.query;
  const { assetIds } = req.body;
  try {
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const decoded = verify(token as string, ENV.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const targetUrl = `${ENV.IMMICH_URL}/api/download/archive`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      body: JSON.stringify({ assetIds }),
      headers: getUserHeaders({ isUsingShareKey: true }, {
        'Content-Type': 'application/json',
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Get the image data from the response
    const imageBuffer = await response.arrayBuffer()

    // Set the appropriate headers for the image response
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/png')
    res.setHeader('Content-Length', imageBuffer.byteLength)

    // Send the image data
    res.send(Buffer.from(imageBuffer))

  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({ message: "Please check your link and try again. Looks like it's expired." });
    }
    return res.status(500).json({ message: (error as Error).message });
  }
}
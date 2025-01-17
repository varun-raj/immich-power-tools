// pages/api/proxy.js

import { ENV } from '@/config/environment';
import { getUserHeaders } from '@/helpers/user.helper';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
  api: {
    bodyParser: false,
  },
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }
  
  const { id, size, token } = req.query;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    verify(token as string, ENV.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: 'Token is invalid' })
  }

  let targetUrl = `${ENV.IMMICH_URL}/api/assets/${id}/thumbnail?size=${size || 'thumbnail'}`;
  if (size === "original") {
    targetUrl = `${ENV.IMMICH_URL}/api/assets/${id}/original`;
  }

  try {
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: getUserHeaders({ isUsingShareKey: true }, {
        'Content-Type': 'application/octet-stream',
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error("Error fetching thumbnail " + error.message)
    }

    // Get the image data from the response
    const imageBuffer = await response.arrayBuffer()

    // Set the appropriate headers for the image response
    res.setHeader('Content-Type', response.headers.get('Content-Type') || 'image/png')
    res.setHeader('Content-Length', imageBuffer.byteLength)

    // Send the image data
    res.send(Buffer.from(imageBuffer))
  } catch (error: any) {
    res.redirect("https://placehold.co/400")
    console.error('Error:', error)
  }
}
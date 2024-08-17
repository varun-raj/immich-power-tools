// pages/api/proxy.js

import { ENV } from '@/config/environment';
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
  
  const { id } = req.query;
  const targetUrl = `${ENV.IMMICH_URL}/api/people/${id}/thumbnail`;

  try {
    // Forward the request to the target API
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
        'x-api-key': ENV.IMMICH_API_KEY,
      },
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
    console.error('Error:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}
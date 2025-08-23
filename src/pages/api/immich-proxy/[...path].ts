import { ENV } from '@/config/environment';
import { getCurrentUser } from '@/handlers/serverUtils/user.utils';
import { getUserHeaders } from '@/helpers/user.helper';
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proxyPath = req.url?.replace('/api/immich-proxy', '');

  const targetUrl = `${ENV.IMMICH_URL}/api${proxyPath}`;

  const currentUser = await getCurrentUser(req);
  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        ...getUserHeaders(currentUser),
        'Accept-Encoding': 'gzip, deflate, br',
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : null,
    })

    // Forward the status code
    res.status(response.status)

    // Forward the headers, but filter out problematic ones
    const responseHeaders = response.headers
    responseHeaders.forEach((value, key) => {
      // Skip headers that can cause decoding issues
      const skipHeaders = [
        'content-encoding',
        'content-length',
        'transfer-encoding',
        'connection',
        'keep-alive'
      ]
      
      if (!skipHeaders.includes(key.toLowerCase())) {
        res.setHeader(key, value)
      }
    })

    // Handle the response body properly
    if (response.body) {
      // For binary content or when we need to preserve encoding
      if (response.headers.get('content-type')?.includes('image/') || 
          response.headers.get('content-type')?.includes('video/') ||
          response.headers.get('content-type')?.includes('audio/') ||
          response.headers.get('content-type')?.includes('application/octet-stream')) {
        
        const arrayBuffer = await response.arrayBuffer()
        res.send(Buffer.from(arrayBuffer))
      } else {
        // For text/JSON content, let Next.js handle the encoding
        const text = await response.text()
        res.send(text)
      }
    } else {
      res.end()
    }
  } catch (error: any) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: error?.message })
  }
}

export const config = {
  api: {
    responseLimit: false,
  },
}
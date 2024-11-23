// pages/api/proxy/[...path].ts

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

    // Log response headers for debugging
    console.log('Response Headers:', response.headers);

    // Forward the status code
    res.status(response.status)

    // Forward the headers
    const responseHeaders = response.headers
    responseHeaders.forEach((value, key) => {
      res.setHeader(key, value)
    })

  // Stream the response body
    const reader = response.body?.getReader()
    if (reader) {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        res.write(value)
      }
    }
    res.end()
  } catch (error: any) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: error?.message })
  }
}
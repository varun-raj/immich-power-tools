// src/pages/api/googleAuthCallback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import cookie from 'cookie';
import { ENV } from '@/config/environment';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export default async function googleAuthCallback(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  try {
    const { data } = await axios.post(GOOGLE_TOKEN_URL, null, {
      params: {
        code,
        client_id: ENV.GOOGLE_CLIENT_ID,
        client_secret: ENV.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${ENV.BASE_URL}/api/auth/callback/google`,
        grant_type: 'authorization_code',
        
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token } = data;

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('googleAccessToken', access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600,
        path: '/',
      })
    );

    res.redirect('/integrations/google');
  } catch (error) {
    console.error('Error fetching Google access token:', error);
    res.status(500).json({ error: 'Failed to fetch access token' });
  }
}
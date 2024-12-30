import { db } from '@/config/db';
import { ENV } from '@/config/environment';
import { getCurrentUser } from '@/handlers/serverUtils/user.utils';
import { parseFindQuery } from '@/helpers/gemini.helper';
import { assetFaces, assets, person } from '@/schema';
import { and, eq, inArray } from 'drizzle-orm';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.body;
  const currentUser = await getCurrentUser(req);  
  const parsedQuery = await parseFindQuery(query as string);
  const url = ENV.IMMICH_URL + "/api/search/smart";

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(parsedQuery),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentUser?.accessToken}`
    }
  }).then(response => {
    if (response.status !== 200) {
      return res.json({
        assets: [],
        filters: parsedQuery,
        error: "Failed to fetch assets",
        errorData: response.json()
      });
    }
    return response.json();
  })
  .then(data => {
    res.status(200).json({
      assets: data.assets.items,
      filters: parsedQuery
    });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });

}
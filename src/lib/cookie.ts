import type { CookieSerializeOptions } from 'cookie'
import cookie from 'cookie'
import type { IncomingMessage } from 'http'
import type { NextApiRequest } from 'next'

export const getCookie = (
  req: NextApiRequest | IncomingMessage,
  name: string
) => {
  const cookieData = cookie.parse(req.headers.cookie || '')
  if (cookieData && cookieData[name]) {
    return cookieData[name]
  }
  return null
}

export const serializeCookie = (
  name: string,
  value: string,
  options: CookieSerializeOptions = {}
) => {
  return cookie.serialize(name, String(value), {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    ...options,
  })
}
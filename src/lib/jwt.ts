import jwt from 'jsonwebtoken'

export const decodeJWT = (token: string, key: string): any => {
  try {
    const payload = jwt.verify(token, key, {
      ignoreExpiration: true
    })
    return payload
  } catch (error) {
    return null
  }
}

export const encodeJWT = (payload: any, key: string): string => {
  return jwt.sign(payload, key)
}

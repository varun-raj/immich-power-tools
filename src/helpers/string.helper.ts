import { removeNullOrUndefinedKeys } from "./data.helper"

export const buildURL = (baseURL: string, params: any) => {
  const cleanedParam = removeNullOrUndefinedKeys(params)
  const keys = Object.keys(cleanedParam)
  if (keys.length === 0) {
    return baseURL
  }
  const paramsString = keys.map((key) => {
    if (Array.isArray(cleanedParam[key])) {
      return cleanedParam[key].map((item: any) => `${key}=${item}`).join('&')
    }
    return `${key}=${cleanedParam[key]}`
  })
  let baseURLWithPrefix = baseURL
  if (baseURL.includes('?')) {
    baseURLWithPrefix = `${baseURL}&`
  } else {
    baseURLWithPrefix = `${baseURL}?`
  }

  return `${baseURLWithPrefix}${paramsString.join('&')}`
}
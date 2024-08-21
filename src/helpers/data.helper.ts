export const stringToBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return value === 'true';
}

export const removeNullOrUndefinedKeys = (obj: any) => {
  const newObj = { ...obj }
  Object.keys(newObj).forEach((key) => {
    if (
      newObj[key] === null ||
      newObj[key] === undefined ||
      newObj[key] === '' ||
      newObj[key] === 'null' ||
      newObj[key] === 'undefined'
    ) {
      delete newObj[key]
    }
  })
  return newObj
}

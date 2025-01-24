export const stringToBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return value === 'true';
}

export const removeNullOrUndefinedProperties = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => {
    if (Array.isArray(v)) {
      return v.length > 0;
    }

    if (typeof v === 'number') {
      return v !== null && v !== undefined && v !== 0;
    }

    return v !== null && v !== undefined && v !== '' && v !== 'null' && v !== 'undefined' && v !== 'null' && v !== 'undefined'
  }));
}

export const findMissingKeys = (obj: any, keys: string[]) => {

  return keys.filter((key) => !(key in obj) || obj[key] === '' || obj[key] === null || obj[key] === undefined);
}
export const stringToBoolean = (value: string | boolean): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return value === 'true';
}
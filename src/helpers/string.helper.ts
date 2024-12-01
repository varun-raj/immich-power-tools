export const humanizeNumber = (number: number) => {
  return number.toLocaleString();
}

export const pluralize = (number: number, word: string, pluralWord: string) => {
  return number === 1 ? word : pluralWord
}

export const humanizeBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} bytes`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

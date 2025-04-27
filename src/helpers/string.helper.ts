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

export const humanizeDuration = (duration: string) => {
  if (!duration) {
    return null;
  }
  // Example input : 00:00:04.350
  const [hours, minutes, seconds] = duration.split(':').map(Number);
  const totalSeconds = Math.round(hours * 3600 + minutes * 60 + seconds);

  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  if (totalSeconds < 3600) {
    // Show only minutes
    return `${Math.round(minutes)}m`;
  }

  
  return `${Math.round(hours)}h ${Math.round(minutes)}m`;
}

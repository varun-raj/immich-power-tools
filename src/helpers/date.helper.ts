import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import duration from "dayjs/plugin/duration";
import utc from "dayjs/plugin/utc";

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(utc);

export const formatDate = (date: string | Date, outputFormat?: string): string => {
  return dayjs(date).format(outputFormat || "MMMM d, YYYY");
}

export const parseDate = (date: string, inputFormat: string): Date => {
  return dayjs(date, inputFormat).toDate();
}

export const addDays = (date: Date, days: number): Date => {  
  return dayjs(date).add(days, 'day').toDate();
}

export const offsetDate = (date: string, offset: { 
  years: number, 
  days: number, 
  hours: number, 
  minutes: number, 
  seconds: number 
}): string => {
  return dayjs(date)
    .add(offset.years || 0, 'year')
    .add(offset.days || 0, 'day')
    .add(offset.hours || 0, 'hour')
    .add(offset.minutes || 0, 'minute')
    .add(offset.seconds || 0, 'second')
    .toISOString();
}
import { format, parse } from "date-fns"

export const formatDate = (date: string, outputFormat?: string): string => {
  return format(date, outputFormat || "PPP")
}

export const parseDate = (date: string, inputFormat: string): Date => {
  return parse(date, inputFormat, new Date());
}

export const addDays = (date: Date, days: number): Date => {  
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

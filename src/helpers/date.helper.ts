import { format, parse } from "date-fns"

export const formatDate = (date: string, outputFormat?: string): string => {
  return format(date, outputFormat || "PPP")
}

export const parseDate = (date: string, inputFormat: string): Date => {
  return parse(date, inputFormat, new Date());
}
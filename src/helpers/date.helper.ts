import { addSeconds, addHours, addMinutes, format, parse, addYears } from "date-fns"

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


export const offsetDate = (date: string, offset: { 
  years: number, 
  days: number, 
  hours: number, 
  minutes: number, 
  seconds: number 
}): string => {
  const parsedDate = new Date(date);
  const result = addYears(parsedDate, offset.years || 0)
  const result2 = addDays(result, offset.days || 0)
  const result3 = addHours(result2, offset.hours || 0)  
  const result4 = addMinutes(result3, offset.minutes || 0)
  const result5 = addSeconds(result4, offset.seconds || 0)
  return result5.toISOString()
}
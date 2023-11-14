import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function decodeURI(data: string | null | undefined) {
  return decodeURIComponent(data as string);
}

export function changeStringToArray(arrayOfString: string[]) {
  return arrayOfString.join();
}

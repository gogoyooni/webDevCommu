import { type ClassValue, clsx } from "clsx";
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

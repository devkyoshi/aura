import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toAbsoluteUrl = (pathname: string): string => {
  const baseUrl = process.env.BASE_URL;

  if (baseUrl && baseUrl !== '/') {
    return process.env.BASE_URL + pathname;
  } else {
    return pathname;
  }
};

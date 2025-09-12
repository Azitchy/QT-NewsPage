import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  } catch {
    return ""
  }
}

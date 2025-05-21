import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCount(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1_000_000) return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (value < 1_000_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
}


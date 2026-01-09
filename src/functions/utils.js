import { clsx } from "clsx";

export function cn(...inputs) {
  return clsx(inputs);
}

// Utility for class name composition
export const tw = cn;

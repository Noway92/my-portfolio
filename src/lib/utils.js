import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine des classes Tailwind avec clsx et twMerge
 * @param {*} inputs - Classes à combiner
 * @returns {string} - Chaîne de classes combinées
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

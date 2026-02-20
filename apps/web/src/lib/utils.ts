import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging tailwind classes safely
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export interface NavItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export interface Feature {
    title: string;
    description: string;
    icon: LucideIcon;
}

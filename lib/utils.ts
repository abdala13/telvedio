import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date(); const d = new Date(date); const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000); const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60); const days = Math.floor(hours / 24);
  if (days > 30) return formatDate(date); if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`; if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}

export function generateMetaTitle(title: string): string {
  return `${title} | Telegram News Platform`;
}

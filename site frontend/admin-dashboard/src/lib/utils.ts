import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date) {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function getStatusColor(status?: string) {
  if (!status) return "text-gray-600 bg-gray-100"
  
  switch (status.toLowerCase()) {
    case "completed":
      return "text-green-600 bg-green-100"
    case "pending":
      return "text-yellow-600 bg-yellow-100"
    case "processing":
      return "text-blue-600 bg-blue-100"
    case "cancelled":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length) + "..."
}

export function generateOrderId() {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function calculatePercentageChange(current: number, previous: number) {
  if (previous === 0) return 0
  return ((current - previous) / previous) * 100
}

export function formatFileSize(bytes: number) {
  const sizes = ["Bytes", "KB", "MB", "GB"]
  if (bytes === 0) return "0 Bytes"
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i]
} 
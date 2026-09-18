import { useState, useEffect } from "react";
import type { DonationPriority, DeliveryStatus, DonationStatus } from "../types";

export function formatTimeRemaining(expiryIso: string): {
  text: string;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  priority: DonationPriority;
} {
  const diffMs = new Date(expiryIso).getTime() - Date.now();

  if (diffMs <= 0) {
    return {
      text: "EXPIRED / UNSAFE",
      hours: 0,
      minutes: 0,
      seconds: 0,
      isExpired: true,
      priority: "EXPIRED",
    };
  }

  const totalSecs = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);
  const seconds = totalSecs % 60;

  let priority: DonationPriority = "LOW";
  if (hours < 2.5) {
    priority = "HIGH";
  } else if (hours < 6) {
    priority = "MEDIUM";
  }

  let text = "";
  if (hours > 0) {
    text = `${hours}h ${minutes}m`;
  } else {
    text = `${minutes}m ${seconds}s`;
  }

  return {
    text: `Expires in ${text}`,
    hours,
    minutes,
    seconds,
    isExpired: false,
    priority,
  };
}

export function useCountdown(expiryIso: string) {
  const [state, setState] = useState(() => formatTimeRemaining(expiryIso));

  useEffect(() => {
    const timer = setInterval(() => {
      setState(formatTimeRemaining(expiryIso));
    }, 1000);
    return () => clearInterval(timer);
  }, [expiryIso]);

  return state;
}

export function getPriorityBadgeColor(priority: DonationPriority): string {
  switch (priority) {
    case "HIGH":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "MEDIUM":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "LOW":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "EXPIRED":
      return "bg-slate-100 text-slate-500 border-slate-300";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export function getStatusBadge(status: DonationStatus | DeliveryStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "AVAILABLE":
      return { label: "Available for Match", className: "bg-emerald-100 text-emerald-800 border-emerald-200" };
    case "MATCHED":
      return { label: "AI Matched", className: "bg-blue-100 text-blue-800 border-blue-200" };
    case "ACCEPTED":
      return { label: "Accepted by NGO", className: "bg-teal-100 text-teal-800 border-teal-200" };
    case "ASSIGNED":
      return { label: "Delivery Assigned", className: "bg-indigo-100 text-indigo-800 border-indigo-200" };
    case "GOING_TO_PICKUP":
      return { label: "Going to Pickup", className: "bg-amber-100 text-amber-800 border-amber-200" };
    case "FOOD_COLLECTED":
      return { label: "Food Collected", className: "bg-orange-100 text-orange-800 border-orange-200" };
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
      return { label: "Out for Delivery", className: "bg-purple-100 text-purple-800 border-purple-200" };
    case "DELIVERED":
    case "DELIVERED_SUCCESSFULLY":
      return { label: "Delivered Successfully", className: "bg-emerald-600 text-white border-emerald-600" };
    case "EXPIRED":
      return { label: "Expired / Unsafe", className: "bg-rose-100 text-rose-800 border-rose-200" };
    case "CANCELLED":
    case "UNABLE_TO_DELIVER":
      return { label: "Delivery Failed", className: "bg-rose-100 text-rose-800 border-rose-200" };
    default:
      return { label: status, className: "bg-slate-100 text-slate-800 border-slate-200" };
  }
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatTimeAgo(dateIso: string): string {
  if (!dateIso) return "Just now";
  const diffSecs = Math.floor((Date.now() - new Date(dateIso).getTime()) / 1000);
  if (diffSecs < 60) return "Just now";
  const mins = Math.floor(diffSecs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(dateIso).toLocaleDateString();
}

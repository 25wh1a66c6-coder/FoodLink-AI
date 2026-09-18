import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  HeartHandshake,
  ListOrdered,
  CheckCircle,
  Truck,
  MapPin,
  History,
  ShieldCheck,
  Activity,
  Trash2,
  Users,
  Bell,
  HelpCircle,
  Info,
} from "lucide-react";
import type { UserRole } from "../types";

export type NavView =
  // Donor
  | "donor-dashboard"
  | "donate-food"
  | "my-donations"
  | "donation-success"
  // NGO
  | "ngo-dashboard"
  | "available-food"
  | "ngo-requirements"
  | "accepted-donations"
  // Delivery
  | "delivery-dashboard"
  | "assigned-deliveries"
  | "delivery-tracking"
  | "delivery-history"
  // Admin
  | "admin-dashboard"
  | "donation-monitoring"
  | "delivery-monitoring"
  | "food-waste-log"
  | "user-management"
  // General
  | "notifications"
  | "help-about";

interface SidebarProps {
  currentRole: UserRole;
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  unreadCount?: number;
  urgentFoodCount?: number;
  activeDeliveryCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  currentView,
  onSelectView,
  unreadCount = 0,
  urgentFoodCount = 0,
  activeDeliveryCount = 0,
}) => {
  const getNavLinks = () => {
    switch (currentRole) {
      case "donor":
        return [
          {
            id: "donor-dashboard" as NavView,
            label: "Donor Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
          },
          {
            id: "donate-food" as NavView,
            label: "Donate Food",
            icon: <PlusCircle className="w-4 h-4" />,
            badge: "New",
            badgeColor: "bg-emerald-100 text-emerald-800",
          },
          {
            id: "my-donations" as NavView,
            label: "My Donations",
            icon: <Package className="w-4 h-4" />,
          },
        ];

      case "ngo":
        return [
          {
            id: "ngo-dashboard" as NavView,
            label: "NGO Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
          },
          {
            id: "available-food" as NavView,
            label: "Available Food & AI",
            icon: <Package className="w-4 h-4" />,
            badge: urgentFoodCount > 0 ? `${urgentFoodCount} Urgent` : undefined,
            badgeColor: "bg-rose-100 text-rose-800",
          },
          {
            id: "ngo-requirements" as NavView,
            label: "Our Requirements",
            icon: <ListOrdered className="w-4 h-4" />,
          },
          {
            id: "accepted-donations" as NavView,
            label: "Accepted Donations",
            icon: <CheckCircle className="w-4 h-4" />,
          },
        ];

      case "delivery":
        return [
          {
            id: "delivery-dashboard" as NavView,
            label: "Delivery Dashboard",
            icon: <LayoutDashboard className="w-4 h-4" />,
          },
          {
            id: "assigned-deliveries" as NavView,
            label: "Assigned Deliveries",
            icon: <Truck className="w-4 h-4" />,
            badge: activeDeliveryCount > 0 ? `${activeDeliveryCount} Active` : undefined,
            badgeColor: "bg-amber-100 text-amber-800",
          },
          {
            id: "delivery-tracking" as NavView,
            label: "Route Map & Tracking",
            icon: <MapPin className="w-4 h-4" />,
          },
          {
            id: "delivery-history" as NavView,
            label: "Delivery History",
            icon: <History className="w-4 h-4" />,
          },
        ];

      case "admin":
        return [
          {
            id: "admin-dashboard" as NavView,
            label: "Admin Overview",
            icon: <LayoutDashboard className="w-4 h-4" />,
          },
          {
            id: "donation-monitoring" as NavView,
            label: "Donation Monitoring",
            icon: <Activity className="w-4 h-4" />,
          },
          {
            id: "delivery-monitoring" as NavView,
            label: "Delivery Monitoring",
            icon: <Truck className="w-4 h-4" />,
          },
          {
            id: "food-waste-log" as NavView,
            label: "Food Waste Log",
            icon: <Trash2 className="w-4 h-4" />,
          },
          {
            id: "user-management" as NavView,
            label: "User Management",
            icon: <Users className="w-4 h-4" />,
          },
        ];
    }
  };

  const mainLinks = getNavLinks();

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-6">
        {/* Role Section Title */}
        <div>
          <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {currentRole === "donor" && "Donor Portal"}
            {currentRole === "ngo" && "NGO / Charity Hub"}
            {currentRole === "delivery" && "Logistics & Fleet"}
            {currentRole === "admin" && "Platform Administration"}
          </div>

          <nav className="space-y-1">
            {mainLinks.map((item) => {
              const active = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active ? "bg-white/20 text-white" : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* General Links */}
        <div>
          <div className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            System
          </div>
          <nav className="space-y-1">
            <button
              onClick={() => onSelectView("notifications")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === "notifications"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className="w-4 h-4" />
                <span>Notifications</span>
              </div>
              {unreadCount > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    currentView === "notifications"
                      ? "bg-white/20 text-white"
                      : "bg-rose-100 text-rose-800"
                  }`}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectView("help-about")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentView === "help-about"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>AI Engine & Guide</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 text-[11px] text-slate-500">
        <div className="flex items-center gap-2 text-slate-700 font-semibold mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>FoodLink AI Engine</span>
        </div>
        <p className="leading-snug">
          Real-time distance, dietary & expiry urgency matrix actively routing surplus food.
        </p>
      </div>
    </aside>
  );
};

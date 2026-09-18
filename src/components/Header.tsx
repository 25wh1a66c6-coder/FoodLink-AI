import React, { useState } from "react";
import {
  Sparkles,
  Bell,
  PlayCircle,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Shield,
  Utensils,
  HeartHandshake,
  Bike,
} from "lucide-react";
import type { User, UserRole, NotificationItem } from "../types";

interface HeaderProps {
  currentUser: User;
  onRoleChange: (role: UserRole) => void;
  onOpenDemoGuide: () => void;
  onResetDemo: () => void;
  notifications: NotificationItem[];
  onNotificationClick: (notif: NotificationItem) => void;
  onMarkAllNotificationsRead: () => void;
  resetLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleChange,
  onOpenDemoGuide,
  onResetDemo,
  notifications,
  onNotificationClick,
  onMarkAllNotificationsRead,
  resetLoading = false,
}) => {
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read_status).length;

  const roleConfigs: Record<
    UserRole,
    { label: string; icon: React.ReactNode; org: string; color: string }
  > = {
    donor: {
      label: "Donor",
      icon: <Utensils className="w-3.5 h-3.5" />,
      org: "FreshBite Restaurant",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    ngo: {
      label: "NGO / Charity",
      icon: <HeartHandshake className="w-3.5 h-3.5" />,
      org: "Hope Community Center",
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    delivery: {
      label: "Delivery Person",
      icon: <Bike className="w-3.5 h-3.5" />,
      org: "Rajesh Kumar (Active Fleet)",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    admin: {
      label: "System Admin",
      icon: <Shield className="w-3.5 h-3.5" />,
      org: "FoodLink Governance Center",
      color: "bg-slate-100 text-slate-800 border-slate-300",
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-700/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">FoodLink AI</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                Live Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">AI-Assisted Food-Waste Redistribution</p>
          </div>
        </div>

        {/* Center / Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Demo Scenario Walkthrough Button (Section 25) */}
          <button
            onClick={onOpenDemoGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-all shadow-xs cursor-pointer"
            title="Open step-by-step interactive demo scenario guide"
          >
            <PlayCircle className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Demo Scenario</span>
            <span className="md:hidden">Demo</span>
          </button>

          {/* Reset Demo Button */}
          <button
            onClick={onResetDemo}
            disabled={resetLoading}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer disabled:opacity-50"
            title="Reset platform data to clean initial demonstration state"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${resetLoading ? "animate-spin" : ""}`} />
            <span className="hidden lg:inline">Reset Demo</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs cursor-pointer ${
                roleConfigs[currentUser.role].color
              }`}
            >
              <span className="shrink-0">{roleConfigs[currentUser.role].icon}</span>
              <div className="text-left hidden sm:block">
                <span className="block text-[10px] uppercase font-bold tracking-wider opacity-70">
                  Active Role
                </span>
                <span className="leading-tight">{roleConfigs[currentUser.role].label}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" />
            </button>

            {/* Role Dropdown */}
            {showRoleMenu && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setShowRoleMenu(false)}
              >
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Switch Active Role for Testing
                </div>
                {(["donor", "ngo", "delivery", "admin"] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left hover:bg-slate-50 transition-colors cursor-pointer ${
                      currentUser.role === r ? "bg-emerald-50/70 font-bold text-emerald-900" : "text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                        {roleConfigs[r].icon}
                      </div>
                      <div>
                        <div className="font-semibold">{roleConfigs[r].label}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{roleConfigs[r].org}</div>
                      </div>
                    </div>
                    {currentUser.role === r && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifMenu && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in duration-100"
                onMouseLeave={() => setShowNotifMenu(false)}
              >
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllNotificationsRead}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.notification_id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notif.read_status ? "bg-emerald-50/40" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900 block">{notif.title}</span>
                          {!notif.read_status && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <img
              src={currentUser.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
              alt={currentUser.name}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200"
            />
            <div className="hidden xl:block text-left text-xs">
              <span className="font-bold text-slate-900 block leading-tight">{currentUser.name}</span>
              <span className="text-[11px] text-slate-500 font-medium">
                {currentUser.organization_name || currentUser.address.split(",")[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

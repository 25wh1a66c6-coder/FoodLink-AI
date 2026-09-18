import React from "react";
import { Bell, CheckCircle2, AlertTriangle, Clock, Trash2, ArrowRight } from "lucide-react";
import type { AppNotification } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";

interface NotificationsViewProps {
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearNotifications: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllAsRead,
  onClearNotifications,
}) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">System Alerts & Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time multi-channel alerts (SMS, Push, & In-App)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllAsRead}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">All Caught Up</h3>
          <p className="text-xs text-slate-500 mt-1">No unread notifications at this time.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-xs">
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              className={`p-4 flex items-start gap-3 transition-colors ${
                !n.read_status ? "bg-emerald-50/30" : "bg-white"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  n.type === "AI_MATCH"
                    ? "bg-emerald-100 text-emerald-700"
                    : n.type === "EXPIRY_WARNING" || n.type === "EXPIRY"
                    ? "bg-rose-100 text-rose-700"
                    : n.type === "DELIVERY_UPDATE" || n.type === "DELIVERY"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {n.type === "EXPIRY_WARNING" || n.type === "EXPIRY" ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : n.type === "DELIVERY_UPDATE" || n.type === "DELIVERY" ? (
                  <Clock className="w-4 h-4" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 shrink-0">
                    {formatTimeAgo(n.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">
                    Channel: {n.channel || "In-App"}
                  </span>
                  {!n.read_status && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

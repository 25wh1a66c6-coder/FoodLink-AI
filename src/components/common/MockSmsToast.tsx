import React from "react";
import { MessageSquare, X, Smartphone, BellRing } from "lucide-react";
import type { NotificationItem } from "../../types";

interface MockSmsToastProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onAction?: (notif: NotificationItem) => void;
}

export const MockSmsToast: React.FC<MockSmsToastProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce-short">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700 backdrop-blur-md">
        {/* SMS Header */}
        <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-300">FoodLink SMS Gateway (Mock Live 10s)</span>
          </div>
          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message body */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
            <BellRing className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <h5 className="text-xs font-bold text-emerald-300 mb-0.5">{notification.title}</h5>
            <p className="text-xs text-slate-200 leading-relaxed">{notification.message}</p>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-mono">Delivered via FastSMS API</span>
              {onAction && notification.link_view && (
                <button
                  onClick={() => onAction(notification)}
                  className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer"
                >
                  View Details →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import {
  HeartHandshake,
  Sparkles,
  Users,
  Package,
  Clock,
  AlertCircle,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Plus,
  ShieldCheck,
  Bell,
} from "lucide-react";
import type {
  NgoRequirement,
  Donation,
  AiMatch,
  DeliveryTask,
  NotificationItem,
} from "../../types";
import { AiRecommendationCard } from "../common/AiRecommendationCard";
import { CountdownBadge } from "../common/CountdownBadge";

interface NgoDashboardProps {
  ngoName: string;
  requirement: NgoRequirement | undefined;
  aiMatches: { match: AiMatch; donation: Donation }[];
  urgentDonations: Donation[];
  onAcceptMatch: (match: AiMatch, donation: Donation) => void;
  onOpenRequirementsModal: () => void;
  onViewAvailableFood: () => void;
  onViewDelivery: (deliveryId: string) => void;
  acceptingId?: string | null;
  notifications?: NotificationItem[];
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({
  ngoName,
  requirement,
  aiMatches,
  urgentDonations,
  onAcceptMatch,
  onOpenRequirementsModal,
  onViewAvailableFood,
  onViewDelivery,
  acceptingId,
  notifications = [],
}) => {
  // Section 5 calculations:
  // Required: X packets | Available: Y packets | Additional required: Z packets
  const reqTotal = requirement?.quantity_required || 50;
  const fulfilled = requirement?.fulfilled_quantity || 0;
  const additionalNeeded = Math.max(0, reqTotal - fulfilled);
  const percentFulfilled = Math.min(100, Math.round((fulfilled / reqTotal) * 100));

  // Section 8: NGO Notifications (Query notifications for NGO role or user)
  const ngoNotifications = notifications.filter(
    (n) =>
      n.user_id === "usr_ngo_1" ||
      n.user_id === "user_ngo_1" ||
      n.recipientUserId === "usr_ngo_1" ||
      n.recipientUserId === "user_ngo_1" ||
      n.recipientRole === "NGO" ||
      n.user_id === "ALL" ||
      n.type === "DONATION" ||
      n.type === "NEW_DONATION"
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-teal-100 px-2.5 py-1 rounded-full">
            NGO Distribution Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            {ngoName}
          </h2>
          <p className="text-sm text-teal-100/90 mt-2 leading-relaxed">
            AI coordinates surplus food donations within reachable transit time so our community kitchen never turns anyone away.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenRequirementsModal}
              className="px-4 py-2.5 rounded-2xl bg-white text-teal-900 font-extrabold text-xs shadow-md hover:bg-teal-50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Update Our Requirements</span>
            </button>
            <button
              onClick={onViewAvailableFood}
              className="px-4 py-2.5 rounded-2xl bg-teal-900/40 hover:bg-teal-900/60 text-white font-semibold text-xs border border-teal-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Browse All Available Surplus</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Section 8: NGO Live Donation Alerts */}
      {ngoNotifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-teal-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  New Food Donation Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Direct AI notifications delivered to {ngoName}
                </p>
              </div>
            </div>
            <button
              onClick={onViewAvailableFood}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Available Food</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {ngoNotifications.slice(0, 4).map((notif) => (
              <div
                key={notif.notification_id || notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  !notif.read_status && !notif.read
                    ? "bg-teal-50/40 border-teal-200 shadow-xs"
                    : "bg-slate-50/60 border-slate-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {notif.title}
                  </span>
                  {notif.priority && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase shrink-0 ${
                        notif.priority === "HIGH"
                          ? "bg-rose-100 text-rose-700 border border-rose-200"
                          : notif.priority === "MEDIUM"
                          ? "bg-amber-100 text-amber-700 border border-amber-200"
                          : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {notif.priority}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 font-medium leading-relaxed mb-3">
                  {notif.message}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-200/60">
                  <span className="font-mono text-[10px]">
                    {new Date(notif.timestamp || notif.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <button
                    onClick={onViewAvailableFood}
                    className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Donation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 5: Requirement Fulfillment Progress Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              Current Requirement Status (Section 5)
            </span>
            <h3 className="text-lg font-bold text-slate-900 mt-0.5">
              Daily Community Food Target
            </h3>
            <p className="text-xs text-slate-500">
              Preference: {requirement?.dietary_requirement.join(", ") || "Vegetarian"} • Required before{" "}
              {requirement?.required_before || "18:00"} • Capacity: {requirement?.capacity || 60} people
            </p>
          </div>
          <button
            onClick={onOpenRequirementsModal}
            className="px-3 py-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            Edit Requirement
          </button>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-500 block">Required</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">
              {reqTotal} <span className="text-xs font-medium text-slate-400">packets</span>
            </span>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
            <span className="text-xs font-semibold text-emerald-700 block">Available / Fulfilled</span>
            <span className="text-3xl font-black text-emerald-800 mt-1 block">
              {fulfilled} <span className="text-xs font-medium text-emerald-600">packets</span>
            </span>
          </div>

          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <span className="text-xs font-semibold text-amber-700 block">Additional Required</span>
            <span className="text-3xl font-black text-amber-800 mt-1 block">
              {additionalNeeded} <span className="text-xs font-medium text-amber-600">packets</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600">Fulfillment Progress</span>
            <span className="text-teal-700">{percentFulfilled}% Completed</span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${percentFulfilled}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {additionalNeeded === 0
              ? "All required meal packets secured for today!"
              : `${additionalNeeded} more packets needed before distribution service.`}
          </p>
        </div>
      </div>

      {/* Section 6 & 10: AI Match Recommendations */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">
                AI Match Recommendations for Your Center
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Matched based on expiry urgency, delivery distance, capacity and dietary suitability
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
            {aiMatches.length} AI Matches Available
          </span>
        </div>

        {aiMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Pending AI Matches</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              All currently available surplus donations have either been assigned or do not meet your active criteria. Check back shortly as donors log fresh meals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiMatches.map(({ match, donation }) => (
              <AiRecommendationCard
                key={match.match_id}
                match={match}
                donation={donation}
                onAccept={(m) => onAcceptMatch(m, donation)}
                loading={acceptingId === donation.donation_id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Urgent Surplus Approaching Expiry (Section 7) */}
      {urgentDonations.length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-xs">
          <div className="flex items-center gap-2 text-rose-700 font-bold mb-3">
            <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" />
            <h4 className="text-base">High-Priority Expiry Alert</h4>
          </div>
          <p className="text-xs text-slate-600 mb-4">
            The following food listings are approaching their safety cut-off window. Accepting them quickly prevents food from going to waste.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {urgentDonations.map((d) => (
              <div
                key={d.donation_id}
                className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900">{d.food_name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {d.packets} packets from {d.donor_name}
                  </div>
                </div>
                <CountdownBadge expiryIso={d.expiry_time} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

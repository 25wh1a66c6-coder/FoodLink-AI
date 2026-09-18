import React from "react";
import { Sparkles, MapPin, CheckCircle2, Clock, Truck, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import type { AiMatch, Donation } from "../../types";
import { CountdownBadge } from "./CountdownBadge";

interface AiRecommendationCardProps {
  match: AiMatch;
  donation: Donation;
  onAccept: (match: AiMatch) => void;
  onReject?: (match: AiMatch) => void;
  loading?: boolean;
}

export const AiRecommendationCard: React.FC<AiRecommendationCardProps> = ({
  match,
  donation,
  onAccept,
  onReject,
  loading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden">
      {/* AI Header Ribbon */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                AI Match Recommendation
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {match.match_id}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mt-0.5">{match.ngo_name}</h4>
          </div>
        </div>

        {/* Match Score Badge */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{match.match_score}% Match</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">High Confidence</p>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3 px-4 bg-slate-50 rounded-xl text-xs">
        <div>
          <span className="text-slate-500 block">Distance</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            {match.distance_km} km
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Transit ETA</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            ~{match.estimated_travel_minutes} mins
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Dietary Compatibility</span>
          <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {match.compatibility_status}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">Delivery Feasibility</span>
          <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            {match.delivery_feasibility}
          </span>
        </div>
      </div>

      {/* Quantity & Expiry Comparison (Section 5 & 6) */}
      <div className="mb-4 bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="font-semibold text-emerald-950 block">Quantity Compatibility:</span>
            <span className="text-emerald-800 font-medium">{match.quantity_comparison}</span>
          </div>
          <div className="shrink-0">
            <CountdownBadge expiryIso={donation.expiry_time} />
          </div>
        </div>
      </div>

      {/* AI Explainability Checklist (Section 26) */}
      <div className="mb-5">
        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>AI Matching Reasoning & Transparency</span>
        </h5>
        <div className="space-y-1.5 bg-slate-50/80 rounded-xl p-3 border border-slate-100">
          {match.reasons.map((reason, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>{reason.replace(/^✓\s*/, "")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <div className="text-xs text-slate-500">
          Accepting this donation creates a direct delivery task and notifies logistics.
        </div>
        <div className="flex items-center gap-2">
          {onReject && (
            <button
              onClick={() => onReject(match)}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Decline
            </button>
          )}
          <button
            onClick={() => onAccept(match)}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {loading ? "Processing..." : "Accept Donation"}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

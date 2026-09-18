import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, Sparkles, Package, Users, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import type { DeliveryTask } from "../../types";

interface DonationSuccessViewProps {
  delivery?: DeliveryTask | null;
  onReturnToDashboard: () => void;
}

export const DonationSuccessView: React.FC<DonationSuccessViewProps> = ({
  delivery,
  onReturnToDashboard,
}) => {
  useEffect(() => {
    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#059669", "#10b981", "#34d399", "#3b82f6", "#f59e0b"],
      });
    } catch (e) {
      // safe fallback if window/canvas restricted
    }
  }, []);

  const packetsCount = delivery ? parseInt(delivery.quantity_display) || 12 : 12;
  const peopleCount = packetsCount;
  const distanceCovered = delivery ? `${delivery.distance_km} km` : "5.8 km";

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-center">
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 sm:p-10 relative overflow-hidden">
        {/* Celebration icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-inner ring-8 ring-emerald-50">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          Mission Accomplished
        </span>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-3 tracking-tight">
          Donation Successfully Completed 🎉
        </h2>

        <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
          {delivery
            ? `Surplus food from ${delivery.donor_name} has been safely transported and received by ${delivery.ngo_name}.`
            : "Surplus food from FreshBite Restaurant has been safely transported and received by Hope Community Center."}
        </p>

        {/* Section 19 Exact Stated Metrics */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 my-8 p-4 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1.5">
              <Package className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Food Packets</span>
            <span className="text-2xl font-black text-slate-900">{packetsCount}</span>
          </div>

          <div>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-1.5">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">People Served</span>
            <span className="text-2xl font-black text-slate-900">{peopleCount}</span>
          </div>

          <div>
            <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-1.5">
              <MapPin className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-500 block">Distance Covered</span>
            <span className="text-2xl font-black text-slate-900">{distanceCovered}</span>
          </div>
        </div>

        {/* Delivery Status Confirmation */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>Status: Successfully Delivered</span>
        </div>

        {/* Section 19 required quote */}
        <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-4 text-xs font-semibold text-emerald-900 max-w-lg mx-auto">
          “This donation helped redistribute surplus food before expiry.”
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onReturnToDashboard}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Back to Donor Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

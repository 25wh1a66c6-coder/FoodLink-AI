import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Scale,
  Clock,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ArrowRight,
} from "lucide-react";

export const HelpAboutView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>System Architecture & Algorithmic Transparency</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
          FoodLink AI Matching Engine & Safety Charter
        </h2>
        <p className="text-sm text-emerald-100/90 mt-2 max-w-2xl leading-relaxed">
          Surplus food redistribution requires explainable, deterministic, and rapid decision-making. FoodLink AI prioritizes food safety, dietary suitability, and transit deadlines over opaque black-box systems.
        </p>
      </div>

      {/* AI Scoring Breakdown Formula */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">
            Explainable AI Matching Formula
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-6">
          Every candidate NGO receives an auditable match score out of 100 calculated across 4 strict criteria:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">1. Expiry Urgency Score</span>
              <span className="text-xs font-mono font-bold text-emerald-600">35% Weight</span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates hours remaining until food becomes unsafe. Food with &lt; 2 hours remaining triggers maximum urgency to accelerate matching.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">2. Proximity & Distance</span>
              <span className="text-xs font-mono font-bold text-teal-600">30% Weight</span>
            </div>
            <p className="text-xs text-slate-500">
              Measures road distance between donor kitchen and charity center. Scaled so deliveries within 5 km receive top priority to minimize transit time.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">3. Dietary Compatibility</span>
              <span className="text-xs font-mono font-bold text-blue-600">25% Weight</span>
            </div>
            <p className="text-xs text-slate-500">
              Validates dietary parameters (Vegetarian, Vegan, Jain, Allergen-free). Non-compatible meals are strictly filtered out to prevent food rejection.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-800">4. Quantity & Capacity Fit</span>
              <span className="text-xs font-mono font-bold text-purple-600">10% Weight</span>
            </div>
            <p className="text-xs text-slate-500">
              Compares donation packet volume against the charity's outstanding deficit and physical dining/chilled storage capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Section 10: Critical Acceptance Workflow Notice */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-amber-600" />
          <h3 className="text-base font-bold text-slate-900">
            Section 10: Critical Acceptance Security Architecture
          </h3>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          To prevent unauthorized pickups, courier congestion, and fraudulent food collections, the platform enforces cryptographic and workflow gating:
        </p>

        <div className="space-y-3 text-xs text-slate-700">
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Location Privacy:</strong> The donor's exact pickup bay and the charity's recipient coordinates are strictly masked until the NGO actively confirms acceptance.
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Dispatch Trigger:</strong> Only upon NGO acceptance is a verified delivery task created and dispatched to an authorized fleet courier.
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Automated Waste Sweep:</strong> If a surplus listing reaches its shelf-life without acceptance, it is instantly revoked, prevented from assignment, and permanently archived to the Food Waste Log.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

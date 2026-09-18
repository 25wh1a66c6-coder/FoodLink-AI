import React, { useState } from "react";
import {
  Package,
  Clock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react";
import type { Donation, AiMatch } from "../../types";
import { CountdownBadge } from "../common/CountdownBadge";

interface AvailableFoodViewProps {
  donations: Donation[];
  ngoLat?: number;
  ngoLng?: number;
  onAcceptDonation: (donation: Donation) => void;
  acceptingId?: string | null;
}

export const AvailableFoodView: React.FC<AvailableFoodViewProps> = ({
  donations,
  ngoLat = 17.4045,
  ngoLng = 78.3986,
  onAcceptDonation,
  acceptingId,
}) => {
  const [dietaryFilter, setDietaryFilter] = useState("ALL");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const availableList = donations.filter((d) => d.status === "AVAILABLE");

  const filtered = availableList.filter((d) => {
    if (dietaryFilter === "ALL") return true;
    return d.dietary_information.includes(dietaryFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Available Food Surplus</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified food listed by licensed restaurants and catering kitchens
          </p>
        </div>

        {/* Dietary Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold border border-slate-200 rounded-xl bg-white text-slate-700"
          >
            <option value="ALL">All Diets</option>
            <option value="Vegetarian">Vegetarian Only</option>
            <option value="Vegan">Vegan Only</option>
            <option value="Jain-friendly">Jain-friendly</option>
            <option value="Gluten-free">Gluten-free</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Food Listings Match Filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your dietary filter to view other available surplus meals.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((d) => {
            // Simulated distance for display
            const estDist = 4.5;
            return (
              <div
                key={d.donation_id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-teal-300 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {d.donation_id}
                    </span>
                    <CountdownBadge expiryIso={d.expiry_time} />
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {d.food_name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Offered by <span className="font-semibold text-slate-700">{d.donor_name}</span>
                  </p>

                  <div className="grid grid-cols-2 gap-2 my-3 p-3 bg-slate-50 rounded-xl text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Quantity</span>
                      <span className="font-bold text-slate-900">{d.packets} Packets</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Servings</span>
                      <span className="font-bold text-slate-900">{d.servings} People</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Food Type</span>
                      <span className="font-bold text-slate-800">{d.food_type}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">Est. Distance</span>
                      <span className="font-bold text-teal-700">~{estDist} km</span>
                    </div>
                  </div>

                  {/* Dietary chips */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {d.dietary_information.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-100"
                      >
                        {tag}
                      </span>
                    ))}
                    {d.allergens && d.allergens[0] !== "None" && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {d.allergens.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Accept Button (Section 10 Trigger) */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 font-medium">
                    Pre-cleared for dispatch
                  </div>
                  <button
                    onClick={() => onAcceptDonation(d)}
                    disabled={acceptingId === d.donation_id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {acceptingId === d.donation_id ? "Accepting..." : "Accept Donation"}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

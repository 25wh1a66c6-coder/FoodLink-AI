import React from "react";
import {
  Package,
  CheckCircle2,
  Users,
  Clock,
  Trash2,
  Plus,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
} from "lucide-react";
import type { Donation, DashboardStats } from "../../types";
import { CountdownBadge } from "../common/CountdownBadge";
import { getStatusBadge } from "../../utils/formatters";

interface DonorDashboardProps {
  donations: Donation[];
  stats: DashboardStats;
  onOpenDonateModal: () => void;
  onViewDonations: () => void;
  onSelectDonation: (donation: Donation) => void;
}

export const DonorDashboard: React.FC<DonorDashboardProps> = ({
  donations,
  stats,
  onOpenDonateModal,
  onViewDonations,
  onSelectDonation,
}) => {
  const activeDonations = donations.filter(
    (d) => d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "FOOD_COLLECTED" || d.status === "IN_TRANSIT"
  );

  const completedDonations = donations.filter((d) => d.status === "DELIVERED");

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-emerald-100 px-2.5 py-1 rounded-full">
            Donor Operations Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Redistribute Surplus Food. Zero Waste.
          </h2>
          <p className="text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Every cooked meal and food packet listed is instantly evaluated by FoodLink AI, matching nearby NGOs within transit safety limits before expiry.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDonateModal}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-800 font-extrabold text-sm shadow-md hover:bg-emerald-50 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Donate Food Now</span>
            </button>
            <button
              onClick={onViewDonations}
              className="px-4 py-3 rounded-2xl bg-emerald-900/40 hover:bg-emerald-900/60 text-white font-semibold text-sm border border-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Donations ({donations.length})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-0 top-0 bottom-0 w-96 opacity-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
      </div>

      {/* Metric Cards (Section 8) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Package className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Total Donations</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total_donations}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Active Donations</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{activeDonations.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Completed</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.completed_donations}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Packets Donated</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.food_packets_donated}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">People Served</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{stats.people_served}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Trash2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Wasted / Expired</span>
          <p className="text-2xl font-black text-slate-400 mt-1">{stats.expired_donations}</p>
        </div>
      </div>

      {/* Active Donations Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Current Active Donations</h3>
            <p className="text-xs text-slate-500">
              Live expiry countdowns & AI priority routing
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {activeDonations.length} Active
          </span>
        </div>

        {activeDonations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-700">No Active Food Listings</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You currently have no food awaiting pickup. Log surplus food now to connect with nearby charities before expiry.
            </p>
            <button
              onClick={onOpenDonateModal}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Log New Food Donation
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeDonations.map((donation) => {
              const statusBadge = getStatusBadge(donation.status);
              return (
                <div
                  key={donation.donation_id}
                  onClick={() => onSelectDonation(donation)}
                  className="border border-slate-200 hover:border-emerald-300 rounded-2xl p-5 hover:shadow-md transition-all cursor-pointer bg-slate-50/40 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {donation.donation_id}
                      </span>
                      <CountdownBadge expiryIso={donation.expiry_time} />
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900">{donation.food_name}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {donation.additional_notes || `${donation.food_type} • ${donation.prep_time}`}
                    </p>

                    <div className="grid grid-cols-3 gap-2 my-3 py-2 px-3 bg-white rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Packets</span>
                        <span className="font-bold text-slate-800">{donation.packets} units</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Servings</span>
                        <span className="font-bold text-slate-800">{donation.servings} people</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Dietary</span>
                        <span className="font-bold text-emerald-700 truncate block">
                          {donation.dietary_information.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/80 text-xs">
                    <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${statusBadge.className}`}>
                      {statusBadge.label}
                    </span>
                    <span className="text-emerald-700 font-bold hover:underline flex items-center gap-1">
                      View Matching & Route →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Food Safety & Guidelines Warning Notice (Section 4) */}
      <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm">Food Safety & Expiry Compliance Notice</span>
          <p className="mt-0.5 leading-relaxed text-amber-800">
            All surplus food must be sealed in sanitary food-grade packaging with clean handling. Once food reaches its estimated expiry time, the FoodLink AI engine automatically marks the listing as <strong>UNSAFE FOR REDISTRIBUTION</strong> to protect recipient health.
          </p>
        </div>
      </div>
    </div>
  );
};

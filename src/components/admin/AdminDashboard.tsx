import React from "react";
import {
  Shield,
  Activity,
  Package,
  Truck,
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Trash2,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { DashboardStats, Donation, DeliveryTask, WasteLog } from "../../types";
import { formatINR } from "../../utils/formatters";
import { CountdownBadge } from "../common/CountdownBadge";

interface AdminDashboardProps {
  stats: DashboardStats;
  donations: Donation[];
  deliveries: DeliveryTask[];
  wasteLogs: WasteLog[];
  onViewWasteLog: () => void;
  onViewDonations: () => void;
  onViewDeliveries: () => void;
  onViewUsers: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  donations,
  deliveries,
  wasteLogs,
  onViewWasteLog,
  onViewDonations,
  onViewDeliveries,
  onViewUsers,
}) => {
  const highPriority = donations.filter((d) => d.priority === "HIGH" && d.status === "AVAILABLE");
  const activeDeliveries = deliveries.filter(
    (d) => d.status !== "DELIVERED_SUCCESSFULLY" && d.status !== "UNABLE_TO_DELIVER"
  );

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Platform Master Console
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            FoodLink AI — Regional Command Center
          </h2>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            Live telemetric monitoring across surplus food donors, NGO recipient networks, active logistics couriers, and waste avoidance metrics.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onViewWasteLog}
              className="px-4 py-2.5 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Inspect Food Waste Log ({wasteLogs.length})</span>
            </button>
            <button
              onClick={onViewUsers}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage User Directory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Platform Key Statistics Grid (Section 17) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Donations</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.total_donations}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Logged on platform</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Packets Donated</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stats.food_packets_donated}</p>
          <span className="text-[10px] text-slate-400 mt-1 block">Total meals entered</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block">Packets Delivered</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.food_packets_delivered}</p>
          <span className="text-[10px] text-emerald-600 mt-1 block">Zero spoilage transit</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 block">People Served</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{stats.people_served}</p>
          <span className="text-[10px] text-blue-500 mt-1 block">Community impact</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 block">Active Deliveries</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{activeDeliveries.length}</p>
          <span className="text-[10px] text-amber-500 mt-1 block">Couriers on the road</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-rose-700 block">Expired / Waste</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{stats.expired_donations}</p>
          <span className="text-[10px] text-rose-500 mt-1 block">{stats.wasted_food_kg} kg tracked</span>
        </div>
      </div>

      {/* Analytical Visual Charts Section (Section 17) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Trend Bar Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Donations & Successful Deliveries (Weekly)</h3>
              <p className="text-xs text-slate-500">Comparing food listed vs redistributed</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                <span>Delivered</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-slate-300" />
                <span>Donated</span>
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-200">
            {stats.donations_over_time.map((item, idx) => {
              const maxVal = 50;
              const donH = Math.round((item.donations / maxVal) * 100);
              const delH = Math.round((item.delivered / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-1.5 h-44">
                    {/* Donated bar */}
                    <div
                      style={{ height: `${donH}%` }}
                      className="w-4 bg-slate-200 rounded-t-md hover:bg-slate-300 transition-all relative group"
                    >
                      <div className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                        {item.donations} listed
                      </div>
                    </div>
                    {/* Delivered bar */}
                    <div
                      style={{ height: `${delH}%` }}
                      className="w-4 bg-emerald-600 rounded-t-md hover:bg-emerald-700 transition-all relative group shadow-xs"
                    >
                      <div className="hidden group-hover:block absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-900 text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap z-20">
                        {item.delivered} delivered
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{item.date}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex justify-between">
            <span>Overall redistribution success rate: <strong>96.4%</strong></span>
            <span>Food value saved: <strong>{formatINR(stats.impact_saved_rupees)}</strong></span>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Surplus Food Composition</h3>
            <p className="text-xs text-slate-500">Distribution by meal category</p>

            <div className="mt-5 space-y-3">
              {stats.category_breakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat.name}</span>
                    <span className="text-slate-900 font-bold">{cat.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${cat.value}%` }}
                      className={`h-full rounded-full ${
                        idx === 0
                          ? "bg-emerald-600"
                          : idx === 1
                          ? "bg-teal-500"
                          : idx === 2
                          ? "bg-blue-500"
                          : "bg-amber-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900">
            <span className="font-bold block">Redistribution Efficiency</span>
            <span className="text-[11px] text-emerald-800">
              Cooked meals account for the highest volume and are prioritized with the strictest transit deadlines.
            </span>
          </div>
        </div>
      </div>

      {/* Live Monitoring Feeds Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent High-Priority Donations Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <h4 className="text-sm font-bold text-slate-900">Urgent High-Priority Donations</h4>
            </div>
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              {highPriority.length} Action Needed
            </span>
          </div>

          {highPriority.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No urgent donations currently pending acceptance.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {highPriority.map((d) => (
                <div key={d.donation_id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{d.food_name}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {d.packets} packets from {d.donor_name}
                    </span>
                  </div>
                  <CountdownBadge expiryIso={d.expiry_time} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active In-Transit Deliveries Feed */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <h4 className="text-sm font-bold text-slate-900">Live Delivery Runs</h4>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {activeDeliveries.length} Active
            </span>
          </div>

          {activeDeliveries.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No active deliveries in transit.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeDeliveries.map((del) => (
                <div key={del.delivery_id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{del.food_name}</span>
                    <span className="text-[11px] text-slate-500 block">
                      {del.donor_name} → {del.ngo_name} ({del.delivery_person_name})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      {del.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

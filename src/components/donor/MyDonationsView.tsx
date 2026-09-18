import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import type { Donation, DonationPriority } from "../../types";
import { CountdownBadge } from "../common/CountdownBadge";
import { getStatusBadge } from "../../utils/formatters";

interface MyDonationsViewProps {
  donations: Donation[];
  onSelectDonation: (donation: Donation) => void;
  onOpenDonateModal: () => void;
}

export const MyDonationsView: React.FC<MyDonationsViewProps> = ({
  donations,
  onSelectDonation,
  onOpenDonateModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filtered = donations.filter((d) => {
    const matchesSearch =
      d.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donation_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "ALL" || d.priority === priorityFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" &&
        ["AVAILABLE", "ACCEPTED", "FOOD_COLLECTED", "IN_TRANSIT"].includes(d.status)) ||
      (statusFilter === "DELIVERED" && d.status === "DELIVERED") ||
      (statusFilter === "EXPIRED" && d.status === "EXPIRED");
    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">My Donations Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track surplus listings, live expiry thresholds & distribution status
          </p>
        </div>
        <button
          onClick={onOpenDonateModal}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Package className="w-4 h-4" />
          <span>Donate Food</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by food name or ID..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority Only</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
            <option value="EXPIRED">Expired</option>
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active in Pipeline</option>
            <option value="DELIVERED">Delivered</option>
            <option value="EXPIRED">Expired / Waste</option>
          </select>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Donation ID</th>
                <th className="px-4 py-3">Food Details</th>
                <th className="px-4 py-3">Units & Servings</th>
                <th className="px-4 py-3">Expiry Countdown</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                    No matching food donations found.
                  </td>
                </tr>
              ) : (
                filtered.map((d) => {
                  const statusBadge = getStatusBadge(d.status);
                  return (
                    <tr
                      key={d.donation_id}
                      onClick={() => onSelectDonation(d)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-slate-800">
                        {d.donation_id}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{d.food_name}</div>
                        <div className="text-[11px] text-slate-500">
                          {d.food_type} • {d.dietary_information.join(", ")}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-900">{d.packets} packets</span>
                        <span className="text-[11px] text-slate-500 block">
                          Serves {d.servings} people
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <CountdownBadge expiryIso={d.expiry_time} />
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDonation(d);
                          }}
                          className="px-3 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

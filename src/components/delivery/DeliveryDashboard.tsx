import React from "react";
import {
  Bike,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from "lucide-react";
import type { DeliveryTask, DeliveryStatus } from "../../types";
import { CountdownBadge } from "../common/CountdownBadge";
import { getStatusBadge } from "../../utils/formatters";

interface DeliveryDashboardProps {
  deliveries: DeliveryTask[];
  onUpdateStatus: (deliveryId: string, status: DeliveryStatus, reason?: string) => Promise<void>;
  onOpenTracking: (deliveryId: string) => void;
  loadingId?: string | null;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  deliveries,
  onUpdateStatus,
  onOpenTracking,
  loadingId,
}) => {
  const activeDeliveries = deliveries.filter(
    (d) => d.status !== "DELIVERED_SUCCESSFULLY" && d.status !== "UNABLE_TO_DELIVER"
  );
  const completedDeliveries = deliveries.filter((d) => d.status === "DELIVERED_SUCCESSFULLY");

  const totalDistance = deliveries.reduce((acc, d) => acc + d.distance_km, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-emerald-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-amber-100 px-2.5 py-1 rounded-full">
            Logistics & Active Courier Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-2 tracking-tight">
            Surplus Food Redistribution Fleet
          </h2>
          <p className="text-sm text-amber-100/90 mt-2 leading-relaxed">
            Fast, hygienic transit ensuring fresh surplus meals reach community kitchens safely before expiry.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Bike className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Active Deliveries</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{activeDeliveries.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Completed Runs</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{completedDeliveries.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Distance Logged</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {Math.round(totalDistance * 10) / 10} <span className="text-xs font-semibold text-slate-400">km</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-500">Fleet Safety Rating</span>
          <p className="text-2xl font-black text-teal-700 mt-1">100%</p>
        </div>
      </div>

      {/* Assigned Delivery Tasks List (Section 11) */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Assigned Delivery Tasks</h3>
            <p className="text-xs text-slate-500">
              Only authorized delivery personnel can view verified donor and recipient locations
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {activeDeliveries.length} Pending
          </span>
        </div>

        {activeDeliveries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
            <Bike className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No Active Runs Assigned</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              You are on active standby. As soon as an NGO accepts a donation, your route will be dispatched here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeliveries.map((delivery) => {
              const statusBadge = getStatusBadge(delivery.status);
              const isLoading = loadingId === delivery.delivery_id;

              return (
                <div
                  key={delivery.delivery_id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-300 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                          {delivery.delivery_id}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Ref: {delivery.donation_id}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">
                        {delivery.food_name} • {delivery.quantity_display}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      <CountdownBadge expiryIso={delivery.expiry_time} />
                      <button
                        onClick={() => onOpenTracking(delivery.delivery_id)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Interactive Map & Route</span>
                      </button>
                    </div>
                  </div>

                  {/* Section 11 Details Grid: Pickup, NGO, Distance, Travel Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 p-4 bg-slate-50 rounded-xl text-xs">
                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                        Pickup Location (Donor)
                      </span>
                      <p className="font-bold text-slate-900 text-sm">{delivery.donor_name}</p>
                      <p className="text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{delivery.pickup_location}</span>
                      </p>
                      <p className="text-slate-500 text-[11px]">Contact: {delivery.donor_contact}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                        Delivery Destination (NGO / Receiver)
                      </span>
                      <p className="font-bold text-teal-800 text-sm">{delivery.ngo_name}</p>
                      <p className="text-slate-600 flex items-start gap-1">
                        <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                        <span>{delivery.destination}</span>
                      </p>
                      <p className="text-slate-500 text-[11px]">Contact: {delivery.ngo_contact}</p>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-5">
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <strong>Transit Distance:</strong> {delivery.distance_km} km
                    </span>
                    <span className="opacity-30">•</span>
                    <span className="flex items-center gap-1 font-semibold text-slate-800">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <strong>Est. Travel Time:</strong> ~{delivery.estimated_time_minutes} minutes
                    </span>
                  </div>

                  {/* Section 11 Workflow Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[11px] text-slate-500">
                      Step:{" "}
                      {delivery.status === "ASSIGNED"
                        ? "1 of 4 (Awaiting pickup departure)"
                        : delivery.status === "GOING_TO_PICKUP"
                        ? "2 of 4 (In transit to donor kitchen)"
                        : delivery.status === "FOOD_COLLECTED"
                        ? "3 of 4 (Food collected, ready to deliver)"
                        : "4 of 4 (Out for delivery to NGO)"}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {delivery.status === "ASSIGNED" && (
                        <button
                          onClick={() => onUpdateStatus(delivery.delivery_id, "GOING_TO_PICKUP")}
                          disabled={isLoading}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? "Updating..." : "Navigate to Pickup"}
                        </button>
                      )}

                      {delivery.status === "GOING_TO_PICKUP" && (
                        <button
                          onClick={() => onUpdateStatus(delivery.delivery_id, "FOOD_COLLECTED")}
                          disabled={isLoading}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? "Updating..." : "Food Collected"}
                        </button>
                      )}

                      {delivery.status === "FOOD_COLLECTED" && (
                        <button
                          onClick={() => onUpdateStatus(delivery.delivery_id, "OUT_FOR_DELIVERY")}
                          disabled={isLoading}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isLoading ? "Updating..." : "Start Delivery"}
                        </button>
                      )}

                      {delivery.status === "OUT_FOR_DELIVERY" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(delivery.delivery_id, "DELIVERED_SUCCESSFULLY")
                          }
                          disabled={isLoading}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{isLoading ? "Verifying..." : "Delivered Successfully"}</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          onUpdateStatus(
                            delivery.delivery_id,
                            "UNABLE_TO_DELIVER",
                            "Traffic gridlock / recipient facility closed"
                          )
                        }
                        disabled={isLoading}
                        className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      >
                        Unable to Deliver
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Runs History */}
      {completedDeliveries.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3">Recently Completed Deliveries</h3>
          <div className="divide-y divide-slate-100">
            {completedDeliveries.map((del) => (
              <div key={del.delivery_id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{del.food_name}</span>
                  <span className="text-slate-500 block text-[11px]">
                    {del.donor_name} → {del.ngo_name} ({del.distance_km} km)
                  </span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px]">
                    Delivered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

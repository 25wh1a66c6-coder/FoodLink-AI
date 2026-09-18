import React, { useState, useEffect } from "react";
import {
  MapPin,
  Bike,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building,
  Phone,
  Navigation2,
  RefreshCw,
} from "lucide-react";
import type { DeliveryTask, DeliveryStatus } from "../../types";
import { CountdownBadge } from "../common/CountdownBadge";

interface DeliveryTrackingViewProps {
  delivery: DeliveryTask | undefined;
  onUpdateStatus: (deliveryId: string, status: DeliveryStatus) => Promise<void>;
  onBack: () => void;
  loading?: boolean;
}

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  delivery,
  onUpdateStatus,
  onBack,
  loading = false,
}) => {
  // If no delivery selected, pick first active or sample
  const [animProgress, setAnimProgress] = useState(35);

  useEffect(() => {
    if (!delivery) return;
    if (delivery.status === "ASSIGNED") setAnimProgress(10);
    else if (delivery.status === "GOING_TO_PICKUP") setAnimProgress(35);
    else if (delivery.status === "FOOD_COLLECTED") setAnimProgress(55);
    else if (delivery.status === "OUT_FOR_DELIVERY") setAnimProgress(80);
    else if (delivery.status === "DELIVERED_SUCCESSFULLY") setAnimProgress(100);
  }, [delivery?.status]);

  if (!delivery) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto">
        <Bike className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-800">No Active Delivery Run Selected</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">
          Select an active delivery task from the dashboard to track its real-time route.
        </p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer"
        >
          Return to Deliveries
        </button>
      </div>
    );
  }

  const steps = [
    { key: "ASSIGNED", label: "Assigned", icon: "🟢", desc: "Task dispatched to courier" },
    { key: "GOING_TO_PICKUP", label: "Going to Pickup", icon: "🟡", desc: "Navigating to donor kitchen" },
    { key: "FOOD_COLLECTED", label: "Food Collected", icon: "🟠", desc: "Thermal check & packaged verified" },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", icon: "🔵", desc: "En route to community center" },
    { key: "DELIVERED_SUCCESSFULLY", label: "Delivered", icon: "🟢", desc: "Received by charity staff" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === delivery.status);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
        >
          ← Back to Deliveries
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-500">
            Tracking ID: {delivery.delivery_id}
          </span>
          <CountdownBadge expiryIso={delivery.expiry_time} />
        </div>
      </div>

      {/* Main Map & Tracking Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Route Header Banner (Section 12: Donor -> Pickup -> NGO/Receiver) */}
        <div className="bg-slate-900 text-white p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                Active Transit Route (Section 12)
              </span>
              <div className="flex items-center gap-2 text-lg sm:text-xl font-black">
                <span>{delivery.donor_name}</span>
                <span className="text-emerald-400">→</span>
                <span>Pickup Bay</span>
                <span className="text-emerald-400">→</span>
                <span className="text-teal-300">{delivery.ngo_name}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Carrying {delivery.food_name} • {delivery.quantity_display}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 bg-slate-800/80 px-4 py-2.5 rounded-2xl border border-slate-700 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Distance</span>
                <span className="font-extrabold text-white text-base">{delivery.distance_km} km</span>
              </div>
              <div className="w-px h-7 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">ETA</span>
                <span className="font-extrabold text-emerald-400 text-base">
                  ~{delivery.estimated_time_minutes} mins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Realistic Interactive Map View (SVG Canvas Simulation) */}
        <div className="relative bg-slate-100 h-80 sm:h-96 w-full overflow-hidden flex items-center justify-center border-b border-slate-200">
          {/* Map Grid Texture */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#94a3b8 1px, #f8fafc 1px)",
              backgroundSize: "24px 24px",
              backgroundPosition: "0 0, 12px 12px",
            }}
          />

          {/* Road Network Overlays */}
          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>

            {/* Background City Arterials */}
            <path
              d="M 50 220 Q 250 80 450 180 T 850 120"
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M 120 40 Q 280 260 520 200 T 900 300"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />

            {/* Active Delivery Route Polyline */}
            <path
              d="M 160 200 C 260 140, 360 240, 520 170 S 720 130, 800 180"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="6"
              strokeDasharray="6 4"
              className="animate-pulse"
            />

            {/* Waypoint 1: Donor Location */}
            <circle cx="160" cy="200" r="12" fill="#059669" fillOpacity="0.2" />
            <circle cx="160" cy="200" r="6" fill="#059669" />

            {/* Waypoint 2: Receiver Location */}
            <circle cx="800" cy="180" r="14" fill="#2563eb" fillOpacity="0.2" />
            <circle cx="800" cy="180" r="7" fill="#2563eb" />
          </svg>

          {/* Donor Marker Pin */}
          <div className="absolute left-[12%] sm:left-[16%] top-[45%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
            <div className="bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md whitespace-nowrap mb-1">
              Pickup: {delivery.donor_name}
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
              <Building className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Animated Courier Bike Pin */}
          <div
            className="absolute top-[40%] transition-all duration-700 -translate-x-1/2 -translate-y-full flex flex-col items-center z-20"
            style={{ left: `${Math.min(78, Math.max(18, animProgress))}%` }}
          >
            <div className="bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-lg whitespace-nowrap mb-1 flex items-center gap-1.5 ring-1 ring-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Courier: {delivery.delivery_person_name}</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xl ring-4 ring-white animate-bounce">
              <Bike className="w-4 h-4" />
            </div>
          </div>

          {/* Receiver NGO Marker Pin */}
          <div className="absolute right-[8%] sm:right-[16%] top-[38%] -translate-x-1/2 -translate-y-full flex flex-col items-center">
            <div className="bg-blue-700 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-md whitespace-nowrap mb-1">
              Destination: {delivery.ngo_name}
            </div>
            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-4 ring-white">
              <MapPin className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Map Compass & Speed Pill */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-xl shadow-xs border border-slate-200 text-[11px] font-mono flex items-center gap-2">
            <Navigation2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>GPS Tracking Active • Hyderabad Urban Route (Jubilee Hills → Shaikpet)</span>
          </div>
        </div>

        {/* Section 12 Step Progression Chain */}
        <div className="p-6 bg-slate-50">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`p-3 rounded-2xl border text-xs transition-all ${
                    isCurrent
                      ? "bg-white border-emerald-500 shadow-md ring-1 ring-emerald-500"
                      : isCompleted
                      ? "bg-white border-emerald-200 opacity-90"
                      : "bg-slate-100 border-slate-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{step.icon}</span>
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="font-bold text-slate-900">{step.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{step.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Courier Action Toolbar */}
          <div className="mt-6 pt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Update status as food is verified and transported.
            </div>

            <div className="flex items-center gap-2">
              {delivery.status === "ASSIGNED" && (
                <button
                  onClick={() => onUpdateStatus(delivery.delivery_id, "GOING_TO_PICKUP")}
                  disabled={loading}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Mark: Going to Pickup
                </button>
              )}

              {delivery.status === "GOING_TO_PICKUP" && (
                <button
                  onClick={() => onUpdateStatus(delivery.delivery_id, "FOOD_COLLECTED")}
                  disabled={loading}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Mark: Food Collected
                </button>
              )}

              {delivery.status === "FOOD_COLLECTED" && (
                <button
                  onClick={() => onUpdateStatus(delivery.delivery_id, "OUT_FOR_DELIVERY")}
                  disabled={loading}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Mark: Out for Delivery
                </button>
              )}

              {delivery.status === "OUT_FOR_DELIVERY" && (
                <button
                  onClick={() => onUpdateStatus(delivery.delivery_id, "DELIVERED_SUCCESSFULLY")}
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Delivered Successfully</span>
                </button>
              )}

              {delivery.status === "DELIVERED_SUCCESSFULLY" && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Completed & Confirmed</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { X, MapPin, Phone, Clock, Package, Users, ShieldCheck, Sparkles } from "lucide-react";
import type { Donation, DeliveryTask } from "../../types";
import { CountdownBadge } from "../common/CountdownBadge";
import { getStatusBadge } from "../../utils/formatters";

interface DonationDetailModalProps {
  donation: Donation | null;
  onClose: () => void;
  delivery?: DeliveryTask;
  onTrackRoute?: (deliveryId: string) => void;
}

export const DonationDetailModal: React.FC<DonationDetailModalProps> = ({
  donation,
  onClose,
  delivery,
  onTrackRoute,
}) => {
  if (!donation) return null;

  const statusBadge = getStatusBadge(donation.status);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-mono font-bold text-emerald-300">
              {donation.donation_id}
            </span>
            <h3 className="text-lg font-bold">{donation.food_name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
            <CountdownBadge expiryIso={donation.expiry_time} />
          </div>

          <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Units</span>
              <span className="font-bold text-slate-900">{donation.packets} Packets</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Servings</span>
              <span className="font-bold text-slate-900">{donation.servings} People</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Food Type</span>
              <span className="font-bold text-slate-800">{donation.food_type}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Prepared</span>
              <span className="font-bold text-slate-800">{donation.prep_time}</span>
            </div>
          </div>

          {/* Dietary tags */}
          <div>
            <span className="text-xs font-bold text-slate-700 block mb-1">
              Dietary Suitability & Allergens
            </span>
            <div className="flex flex-wrap gap-1.5">
              {donation.dietary_information.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100"
                >
                  {d}
                </span>
              ))}
              {donation.allergens && (
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                  Allergens: {donation.allergens.join(", ")}
                </span>
              )}
            </div>
          </div>

          {/* Pickup and Contact */}
          <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{donation.pickup_location}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{donation.contact_info}</span>
            </div>
          </div>

          {donation.additional_notes && (
            <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-slate-600">
              <strong className="text-emerald-800 block mb-0.5">Packaging Notes:</strong>
              {donation.additional_notes}
            </div>
          )}

          {/* Delivery link if active */}
          {delivery && onTrackRoute && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-indigo-950 block">Courier Assigned</span>
                <span className="text-indigo-700 text-[11px]">
                  {delivery.delivery_person_name} is transporting this food
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onTrackRoute(delivery.delivery_id);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold"
              >
                Track Map →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

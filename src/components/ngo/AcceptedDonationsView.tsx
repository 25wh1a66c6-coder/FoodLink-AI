import React from "react";
import { CheckCircle2, Truck, Clock, MapPin, ExternalLink, ArrowRight } from "lucide-react";
import type { Donation, DeliveryTask } from "../../types";
import { getStatusBadge } from "../../utils/formatters";
import { CountdownBadge } from "../common/CountdownBadge";

interface AcceptedDonationsViewProps {
  donations: Donation[];
  deliveries: DeliveryTask[];
  onTrackDelivery: (deliveryId: string) => void;
}

export const AcceptedDonationsView: React.FC<AcceptedDonationsViewProps> = ({
  donations,
  deliveries,
  onTrackDelivery,
}) => {
  const acceptedList = donations.filter(
    (d) =>
      d.status === "ACCEPTED" ||
      d.status === "ASSIGNED" ||
      d.status === "FOOD_COLLECTED" ||
      d.status === "IN_TRANSIT" ||
      d.status === "DELIVERED"
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Accepted Food Donations</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Track incoming shipments, assigned couriers, and verified arrivals
        </p>
      </div>

      {acceptedList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-800">No Accepted Donations Yet</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Browse the Available Food feed or review AI Match Recommendations to accept surplus meals for your community.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {acceptedList.map((d) => {
            const delivery = deliveries.find((del) => del.donation_id === d.donation_id);
            const statusBadge = getStatusBadge(d.status);

            return (
              <div
                key={d.donation_id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {d.donation_id}
                    </span>
                    <CountdownBadge expiryIso={d.expiry_time} />
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900">{d.food_name}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Donor: <span className="font-semibold text-slate-800">{d.donor_name}</span>
                  </p>

                  <div className="my-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Packets Accepted:</span>
                      <span className="font-bold text-slate-900">{d.packets} units ({d.servings} servings)</span>
                    </div>
                    {delivery && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Assigned Courier:</span>
                          <span className="font-bold text-indigo-700">{delivery.delivery_person_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Distance / ETA:</span>
                          <span className="font-semibold text-slate-800">
                            {delivery.distance_km} km (~{delivery.estimated_time_minutes} mins)
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 rounded-md font-bold text-[11px] border ${statusBadge.className}`}>
                    {statusBadge.label}
                  </span>

                  {delivery ? (
                    <button
                      onClick={() => onTrackDelivery(delivery.delivery_id)}
                      className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-bold border border-teal-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Track Route →</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400">Dispatching courier...</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

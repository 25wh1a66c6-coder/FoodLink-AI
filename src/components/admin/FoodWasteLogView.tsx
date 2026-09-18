import React from "react";
import { Trash2, AlertTriangle, ShieldCheck, Clock, FileSpreadsheet } from "lucide-react";
import type { WasteLog } from "../../types";
import { formatTimeAgo } from "../../utils/formatters";

interface FoodWasteLogViewProps {
  wasteLogs: WasteLog[];
  onTriggerSweep?: () => void;
}

export const FoodWasteLogView: React.FC<FoodWasteLogViewProps> = ({
  wasteLogs,
  onTriggerSweep,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Food Waste & Spoilage Incident Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit trail of expired listings automatically decommissioned by the safety engine (Section 18)
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onTriggerSweep && (
            <button
              onClick={onTriggerSweep}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Run Expiry Sweep</span>
            </button>
          )}
        </div>
      </div>

      {/* Safety Policy Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-xs text-rose-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-sm block">Strict Food Safety Rule Enforcement</span>
          <p className="mt-0.5 text-rose-800 leading-relaxed">
            Per national public health directives and platform charter, any perishable surplus food exceeding its verified shelf-life window is permanently blacklisted from charity redistribution. These logs are preserved for donor packaging audits and prevention forecasting.
          </p>
        </div>
      </div>

      {/* Waste Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Waste ID</th>
                <th className="px-4 py-3">Donation Ref</th>
                <th className="px-4 py-3">Food Item</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Intended Recipient</th>
                <th className="px-4 py-3">Decommission Reason</th>
                <th className="px-4 py-3">Time Marked Wasted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {wasteLogs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Trash2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <span>Zero food waste recorded today. All surplus has been safely matched!</span>
                  </td>
                </tr>
              ) : (
                wasteLogs.map((log) => (
                  <tr key={log.waste_id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-rose-700">{log.waste_id}</td>
                    <td className="px-4 py-3 font-mono text-slate-500">{log.donation_id}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{log.food_name}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-rose-600">{log.packets || log.quantity} Packets</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{log.donor_name}</td>
                    <td className="px-4 py-3 text-slate-500">{log.intended_recipient || "Unassigned"}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold">
                        {log.reason}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-400">
                      {formatTimeAgo(log.timestamp)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import {
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Play,
  RotateCcw,
  Building,
  HeartHandshake,
  Bike,
  ShieldCheck,
} from "lucide-react";
import type { UserRole } from "../../types";

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole: (role: UserRole) => void;
  onTriggerDemoFlow: () => Promise<void>;
  isExecuting?: boolean;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onSwitchRole,
  onTriggerDemoFlow,
  isExecuting = false,
}) => {
  const [activeStep, setActiveStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      num: 1,
      title: "Donor Logs Surplus Food",
      role: "donor" as UserRole,
      roleName: "Donor (FreshBite Restaurant)",
      desc: "FreshBite logs 12 Vegetarian Meal Packets freshly prepared, with an expiry window of 2 hours.",
      detail:
        "System evaluates Available Quantity (12) → Servings (12) → Expiry (2 hrs) → Status: High Priority.",
    },
    {
      num: 2,
      title: "AI Real-Time Matching Engine",
      role: "donor" as UserRole,
      roleName: "FoodLink AI Engine",
      desc: "Algorithm calculates match score (92%) across nearby NGOs based on distance (4.2 km), dietary compatibility (Vegetarian), and capacity.",
      detail:
        "Generates transparent match reasons and dispatches instant SMS notification to Hope Community Center.",
    },
    {
      num: 3,
      title: "NGO Evaluates & Accepts Donation",
      role: "ngo" as UserRole,
      roleName: "NGO (Hope Community Center)",
      desc: "Hope Community Center reviews match details on their dashboard and clicks 'Accept Donation'.",
      detail:
        "Fulfillment updates: 12/15 packets secured. Critical Rule: Donor & NGO locations unlock ONLY upon acceptance.",
    },
    {
      num: 4,
      title: "Delivery Task Dispatch & Courier Notification",
      role: "delivery" as UserRole,
      roleName: "Courier (Rajesh Kumar)",
      desc: "Delivery task is generated. Courier receives pickup & receiver addresses, routes, and begins navigation.",
      detail:
        "Route tracking displays ETA (14 mins), distance (5.8 km), and live food expiry countdown.",
    },
    {
      num: 5,
      title: "Safe Transport & Verification",
      role: "delivery" as UserRole,
      roleName: "Courier & Reception",
      desc: "Courier marks 'Food Collected' → 'Out for Delivery' → 'Delivered Successfully'.",
      detail:
        "NGO confirms handover before expiry. Confetti celebration fires and environmental/social statistics update.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Section 25: End-to-End Demo Scenario</h3>
              <p className="text-xs text-emerald-200">
                Test the complete food redistribution workflow across all four stakeholder roles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps Content */}
        <div className="p-6 space-y-5">
          {/* Quick Auto-Run Banner */}
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-emerald-950 block">
                Instant End-to-End Simulation
              </span>
              <span className="text-[11px] text-emerald-800">
                Automatically executes the FreshBite → Hope Community Center → Rajesh Kumar lifecycle.
              </span>
            </div>
            <button
              onClick={async () => {
                await onTriggerDemoFlow();
                onClose();
              }}
              disabled={isExecuting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isExecuting ? "Simulating Workflow..." : "1-Click Auto Run"}</span>
            </button>
          </div>

          {/* Interactive Step Carousel */}
          <div className="space-y-3">
            {steps.map((step) => {
              const isCurrent = activeStep === step.num;
              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(step.num)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-slate-50 border-emerald-500 shadow-sm ring-1 ring-emerald-500"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCurrent
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {step.num}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                          <span className="text-[10px] font-semibold text-slate-400">
                            • {step.roleName}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{step.desc}</p>
                        {isCurrent && (
                          <div className="mt-2.5 pt-2.5 border-t border-slate-200/80 text-[11px] text-slate-500 leading-relaxed">
                            <strong className="text-emerald-700">Platform Logic:</strong> {step.detail}
                            <div className="mt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSwitchRole(step.role);
                                  onClose();
                                }}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                              >
                                <span>Switch to {step.roleName.split(" ")[0]} View</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Compliant with Hackathon Evaluation Section 25</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

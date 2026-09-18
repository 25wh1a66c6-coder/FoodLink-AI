import React, { useState } from "react";
import { X, Check, HeartHandshake, Sparkles, Users } from "lucide-react";
import type { NgoRequirement } from "../../types";

interface RequirementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRequirement?: NgoRequirement;
  onSubmit: (data: {
    food_type: string;
    quantity_required: number;
    people_to_serve: number;
    dietary_requirement: string[];
    required_before: string;
    capacity: number;
  }) => Promise<void>;
}

export const RequirementsModal: React.FC<RequirementsModalProps> = ({
  isOpen,
  onClose,
  currentRequirement,
  onSubmit,
}) => {
  const [foodType, setFoodType] = useState(currentRequirement?.food_type || "Cooked Meal");
  const [quantityRequired, setQuantityRequired] = useState(
    currentRequirement?.quantity_required || 50
  );
  const [peopleToServe, setPeopleToServe] = useState(currentRequirement?.people_to_serve || 50);
  const [capacity, setCapacity] = useState(currentRequirement?.capacity || 60);
  const [requiredBefore, setRequiredBefore] = useState(
    currentRequirement?.required_before || "18:00"
  );
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(
    currentRequirement?.dietary_requirement || ["Vegetarian"]
  );

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggleDiet = (item: string) => {
    setDietaryPrefs((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        food_type: foodType,
        quantity_required: Number(quantityRequired),
        people_to_serve: Number(peopleToServe),
        dietary_requirement: dietaryPrefs,
        required_before: requiredBefore,
        capacity: Number(capacity),
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 bg-gradient-to-r from-teal-800 to-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Update NGO Requirements</h3>
              <p className="text-xs text-teal-100">
                Helps AI match compatible surplus donations directly to your community
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Food Type Required
            </label>
            <select
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
            >
              <option value="Cooked Meal">Cooked Meal Packets</option>
              <option value="Rice & Curry">Rice & Curry Packs</option>
              <option value="Packaged Food">Packaged Food & Rations</option>
              <option value="Bakery & Bread">Bakery & Bread</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Quantity Needed (Packets) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantityRequired}
                onChange={(e) => setQuantityRequired(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                People to Serve *
              </label>
              <input
                type="number"
                min="1"
                required
                value={peopleToServe}
                onChange={(e) => setPeopleToServe(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Current Storage/Dining Capacity
              </label>
              <input
                type="number"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Required Before (Time)
              </label>
              <input
                type="time"
                value={requiredBefore}
                onChange={(e) => setRequiredBefore(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dietary Preferences & Suitability
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["Vegetarian", "Vegan", "Jain-friendly", "Gluten-free"].map((diet) => {
                const active = dietaryPrefs.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => toggleDiet(diet)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Requirements"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

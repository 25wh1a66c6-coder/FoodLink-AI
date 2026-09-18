import React, { useState, useMemo } from "react";
import {
  X,
  Plus,
  Clock,
  MapPin,
  Phone,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Info,
  Calendar,
} from "lucide-react";
import type { FoodType, FoodCategory, DonationPriority } from "../../types";

interface DonateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (donationData: any) => Promise<void>;
  defaultAddress?: string;
  defaultPhone?: string;
}

export const DonateFoodModal: React.FC<DonateFoodModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultAddress = "Road No. 36, Jubilee Hills, Hyderabad",
  defaultPhone = "+91 98765 43210",
}) => {
  const [foodName, setFoodName] = useState("Vegetarian Meal Pack");
  const [foodType, setFoodType] = useState<FoodType>("Cooked Meal");
  const [foodCategory, setFoodCategory] = useState<FoodCategory>("Veg Meal");
  const [packets, setPackets] = useState<number>(12);
  const [servingsPerPacket, setServingsPerPacket] = useState<number>(1);
  const [prepTime, setPrepTime] = useState("Freshly prepared 45 mins ago");

  // Expiry in hours from now (defaults to 2 hours to match Demo Scenario in Section 25)
  const [expiryHours, setExpiryHours] = useState<number>(2);

  // Dietary options
  const [dietaryOptions, setDietaryOptions] = useState<string[]>([
    "Vegetarian",
    "Jain-friendly",
  ]);

  // Allergens
  const [allergens, setAllergens] = useState<string[]>(["None"]);

  const [pickupLocation, setPickupLocation] = useState(defaultAddress);
  const [contactInfo, setContactInfo] = useState(defaultPhone);
  const [notes, setNotes] = useState(
    "Freshly cooked paneer pulao, dal tadka, and phulkas packed in sealed aluminum containers."
  );

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Live calculations: Available quantity -> Servings -> Expiry countdown -> Estimated collection deadline (Section 3)
  const totalServings = packets * servingsPerPacket;

  const calculatedExpiryDate = useMemo(() => {
    const d = new Date(Date.now() + expiryHours * 60 * 60 * 1000);
    return d;
  }, [expiryHours]);

  const priority: DonationPriority = useMemo(() => {
    if (expiryHours <= 2.5) return "HIGH";
    if (expiryHours <= 6) return "MEDIUM";
    return "LOW";
  }, [expiryHours]);

  // Estimated collection deadline (30-45 mins before expiry for safety)
  const collectionDeadline = useMemo(() => {
    const deadline = new Date(calculatedExpiryDate.getTime() - 40 * 60 * 1000);
    return deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }, [calculatedExpiryDate]);

  if (!isOpen) return null;

  const handleDietaryToggle = (item: string) => {
    setDietaryOptions((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const handleAllergenToggle = (item: string) => {
    if (item === "None") {
      setAllergens(["None"]);
      return;
    }
    setAllergens((prev) => {
      const filtered = prev.filter((x) => x !== "None");
      return filtered.includes(item) ? filtered.filter((x) => x !== item) : [...filtered, item];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Section 3: The donor should NOT be allowed to enter an unrealistic amount that cannot reasonably be collected
    if (packets <= 0) {
      setErrorMessage("Please enter a valid number of food packets (> 0).");
      return;
    }
    if (packets > 500) {
      setErrorMessage(
        "Food safety restriction: Single-trip donations over 500 packets require dedicated refrigerated fleet clearance."
      );
      return;
    }
    if (expiryHours <= 0.25) {
      setErrorMessage("Food safety rule: Expiry must be at least 30 minutes in the future.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        food_name: foodName,
        food_type: foodType,
        food_category: foodCategory,
        quantity: packets,
        packets: Number(packets),
        servings: Number(totalServings),
        prep_time: prepTime,
        expiry_time: calculatedExpiryDate.toISOString(),
        dietary_information: dietaryOptions,
        allergens,
        pickup_location: pickupLocation,
        contact_info: contactInfo,
        additional_notes: notes,
      });
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log donation. Please verify fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center font-bold">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Donate Surplus Food</h3>
              <p className="text-xs text-emerald-100">
                Log fresh meals for instant AI NGO matching & safe redistribution
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

        {/* Live Calculation Strip (Section 3 Requirement) */}
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Real-Time Calculation Engine:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-semibold">Available Quantity</span>
              <span className="font-bold text-slate-800">{packets} Packets</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-semibold">Total Servings</span>
              <span className="font-bold text-slate-800">{totalServings} People</span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-semibold">Calculated Priority</span>
              <span
                className={`font-bold ${
                  priority === "HIGH"
                    ? "text-rose-600 font-black"
                    : priority === "MEDIUM"
                    ? "text-amber-600"
                    : "text-emerald-600"
                }`}
              >
                {priority} PRIORITY
              </span>
            </div>
            <div className="bg-white px-2.5 py-1.5 rounded-lg border border-emerald-100 shadow-2xs">
              <span className="text-[10px] text-slate-400 block font-semibold">Est. Collection Deadline</span>
              <span className="font-bold text-indigo-700">{collectionDeadline}</span>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Food Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Name / Title *
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                placeholder="e.g. Vegetarian Meal Pack"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Food Type Category *
              </label>
              <select
                value={foodType}
                onChange={(e) => setFoodType(e.target.value as FoodType)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Cooked Meal">Cooked Meal</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Bakery & Bread">Bakery & Bread</option>
                <option value="Raw Produce / Grains">Raw Produce / Grains</option>
                <option value="Dairy Products">Dairy Products</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          {/* Quantities & Servings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Number of Packets / Units *
              </label>
              <input
                type="number"
                min="1"
                max="500"
                required
                value={packets}
                onChange={(e) => setPackets(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Max 500 units per van</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Servings per Packet
              </label>
              <input
                type="number"
                min="1"
                value={servingsPerPacket}
                onChange={(e) => setServingsPerPacket(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Total: {totalServings} people served
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preparation Time
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="e.g. Prepared 1 hour ago"
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Expiry Selector (Section 4 & 25 demo) */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Estimated Food Expiry Window *</span>
              </label>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {expiryHours} Hours Remaining
              </span>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.5"
                max="24"
                step="0.5"
                value={expiryHours}
                onChange={(e) => setExpiryHours(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
              <button
                type="button"
                onClick={() => setExpiryHours(0.75)}
                className={`px-2 py-1 rounded-md border text-xs cursor-pointer ${
                  expiryHours === 0.75
                    ? "bg-rose-100 text-rose-800 border-rose-300 font-bold"
                    : "bg-white border-slate-200"
                }`}
              >
                45m (High)
              </button>
              <button
                type="button"
                onClick={() => setExpiryHours(2)}
                className={`px-2 py-1 rounded-md border text-xs cursor-pointer ${
                  expiryHours === 2
                    ? "bg-rose-100 text-rose-800 border-rose-300 font-bold"
                    : "bg-white border-slate-200"
                }`}
              >
                2 Hours (Demo Preset)
              </button>
              <button
                type="button"
                onClick={() => setExpiryHours(5)}
                className={`px-2 py-1 rounded-md border text-xs cursor-pointer ${
                  expiryHours === 5
                    ? "bg-amber-100 text-amber-800 border-amber-300 font-bold"
                    : "bg-white border-slate-200"
                }`}
              >
                5 Hours (Medium)
              </button>
              <button
                type="button"
                onClick={() => setExpiryHours(8)}
                className={`px-2 py-1 rounded-md border text-xs cursor-pointer ${
                  expiryHours === 8
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold"
                    : "bg-white border-slate-200"
                }`}
              >
                8 Hours (Low)
              </button>
            </div>
          </div>

          {/* Dietary Suitability & Allergens (Section 15) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Dietary Suitability Information
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Vegetarian",
                "Non-Vegetarian",
                "Vegan",
                "Jain-friendly",
                "Gluten-free",
                "Diabetic-friendly",
                "Low-sodium",
              ].map((diet) => {
                const active = dietaryOptions.includes(diet);
                return (
                  <button
                    key={diet}
                    type="button"
                    onClick={() => handleDietaryToggle(diet)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      active
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {diet}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Allergen Declarations
            </label>
            <div className="flex flex-wrap gap-1.5">
              {["None", "Contains nuts", "Contains dairy", "Contains gluten", "Contains soy"].map(
                (allergen) => {
                  const active = allergens.includes(allergen);
                  return (
                    <button
                      key={allergen}
                      type="button"
                      onClick={() => handleAllergenToggle(allergen)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        active
                          ? "bg-slate-800 text-white border-slate-800"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {allergen}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* Pickup Location & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pickup Location *</span>
              </label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dispatch Contact Phone *</span>
              </label>
              <input
                type="text"
                required
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Packaging & Food Safety Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Packed in thermal containers. Must remain upright during transit."
              className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
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
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Evaluating AI Matches..." : "Log & Find Matching NGOs"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

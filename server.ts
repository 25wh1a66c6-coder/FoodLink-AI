import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import type {
  User,
  Donation,
  NgoRequirement,
  AiMatch,
  DeliveryTask,
  NotificationItem,
  WasteLog,
  DashboardStats,
  DonationPriority,
  DeliveryStatus,
} from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------
// In-Memory Relational Database with Seed Data
// ----------------------------------------------------

let users: User[] = [
  {
    id: "usr_donor_1",
    name: "Vikram Sharma",
    email: "donor@freshbite.com",
    role: "donor",
    phone: "+91 98765 43210",
    organization_name: "FreshBite Restaurant",
    address: "Road No. 36, Jubilee Hills, Hyderabad, Telangana",
    lat: 17.4319,
    lng: 78.4073,
    avatar: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_donor_2",
    name: "Ananya Iyer",
    email: "ananya@greenleaf.com",
    role: "donor",
    phone: "+91 98450 11223",
    organization_name: "GreenLeaf Catering",
    address: "Banjara Hills, Hyderabad, Telangana",
    lat: 17.4156,
    lng: 78.4350,
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_donor_3",
    name: "Mohan Lal",
    email: "manager@citysupermarket.com",
    role: "donor",
    phone: "+91 99887 76655",
    organization_name: "City Supermarket",
    address: "Madhapur, HITEC City, Hyderabad, Telangana",
    lat: 17.4483,
    lng: 78.3915,
    avatar: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_ngo_1",
    name: "Dr. Sunita Rao",
    email: "ngo@hopecenter.org",
    role: "ngo",
    phone: "+91 98201 54321",
    organization_name: "Hope Community Center",
    address: "Shaikpet, Hyderabad, Telangana",
    lat: 17.4045,
    lng: 78.3986,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_ngo_2",
    name: "Karthik Verma",
    email: "contact@annapurna.org",
    role: "ngo",
    phone: "+91 97110 88990",
    organization_name: "Annapurna Shelter",
    address: "Ameerpet, Hyderabad, Telangana",
    lat: 17.4375,
    lng: 78.4483,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_ngo_3",
    name: "Meera Nair",
    email: "care@carefoundation.org",
    role: "ngo",
    phone: "+91 99440 22334",
    organization_name: "Care Foundation",
    address: "Begumpet, Hyderabad, Telangana",
    lat: 17.4448,
    lng: 78.4664,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_delivery_1",
    name: "Rajesh Kumar",
    email: "rajesh@foodlink.org",
    role: "delivery",
    phone: "+91 91234 56789",
    address: "Hitech City Hub, Hyderabad",
    lat: 17.4380,
    lng: 78.3990,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_delivery_2",
    name: "Priya Sharma",
    email: "priya@foodlink.org",
    role: "delivery",
    phone: "+91 98112 33445",
    address: "Jubilee Hills Hub, Hyderabad",
    lat: 17.4310,
    lng: 78.4100,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_admin_1",
    name: "System Administrator",
    email: "admin@foodlink.org",
    role: "admin",
    phone: "+91 80000 11222",
    address: "FoodLink Headquarters, Hyderabad",
    lat: 17.4239,
    lng: 78.4357,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80",
  },
];

// Helper: current date offset
const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const subHours = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

let donations: Donation[] = [
  {
    donation_id: "DON-101",
    donor_id: "usr_donor_1",
    donor_name: "FreshBite Restaurant",
    donor_phone: "+91 98765 43210",
    donor_address: "Road No. 36, Jubilee Hills, Hyderabad",
    donor_lat: 17.4319,
    donor_lng: 78.4073,
    food_name: "Vegetarian Meal Pack",
    food_type: "Cooked Meal",
    food_category: "Veg Meal",
    quantity: 12,
    packets: 12,
    servings: 12,
    prep_time: "Prepared 1 hour ago",
    expiry_time: addHours(2), // 2 hours from now -> HIGH PRIORITY as requested in demo scenario!
    dietary_information: ["Vegetarian", "Jain-friendly"],
    allergens: ["None"],
    pickup_location: "FreshBite Restaurant, Gate 2 Kitchen, Jubilee Hills",
    contact_info: "Chef Vikram (+91 98765 43210)",
    additional_notes: "Freshly cooked paneer pulao, dal tadka, and phulkas packed in sealed aluminum boxes.",
    status: "AVAILABLE",
    priority: "HIGH",
    created_at: subHours(1),
  },
  {
    donation_id: "DON-102",
    donor_id: "usr_donor_2",
    donor_name: "GreenLeaf Catering",
    donor_phone: "+91 98450 11223",
    donor_address: "Banjara Hills, Hyderabad",
    donor_lat: 17.4156,
    donor_lng: 78.4350,
    food_name: "Steamed Basmati Rice & Dal Packs",
    food_type: "Cooked Meal",
    food_category: "Veg Meal",
    quantity: 25,
    packets: 25,
    servings: 25,
    prep_time: "Prepared 2 hours ago",
    expiry_time: addHours(5), // 5 hours from now -> MEDIUM PRIORITY
    dietary_information: ["Vegetarian", "Gluten-free", "Vegan"],
    allergens: ["None"],
    pickup_location: "GreenLeaf Central Kitchen, Banjara Hills",
    contact_info: "Operations Desk (+91 98450 11223)",
    additional_notes: "Catering surplus from corporate conference luncheon. Keep upright.",
    status: "AVAILABLE",
    priority: "MEDIUM",
    created_at: subHours(2),
  },
  {
    donation_id: "DON-103",
    donor_id: "usr_donor_3",
    donor_name: "City Supermarket",
    donor_phone: "+91 99887 76655",
    donor_address: "Madhapur, HITEC City, Hyderabad",
    donor_lat: 17.4483,
    donor_lng: 78.3915,
    food_name: "Whole Wheat Bread & Buns",
    food_type: "Bakery & Bread",
    food_category: "Bakery",
    quantity: 10,
    packets: 10,
    servings: 15,
    prep_time: "Baked this morning",
    expiry_time: addHours(0.75), // 45 minutes from now -> HIGH PRIORITY URGENT!
    dietary_information: ["Vegetarian"],
    allergens: ["Contains gluten"],
    pickup_location: "City Supermarket In-store Bakery, Rear Loading Bay",
    contact_info: "Bakery Manager (+91 99887 76655)",
    additional_notes: "Fresh artisan loaves and dinner buns. Must be picked up immediately.",
    status: "AVAILABLE",
    priority: "HIGH",
    created_at: subHours(3),
  },
  {
    donation_id: "DON-104",
    donor_id: "usr_donor_1",
    donor_name: "FreshBite Restaurant",
    donor_phone: "+91 98765 43210",
    donor_address: "Road No. 36, Jubilee Hills, Hyderabad",
    donor_lat: 17.4319,
    donor_lng: 78.4073,
    food_name: "Assorted Dinner Meal Boxes",
    food_type: "Cooked Meal",
    food_category: "Veg Meal",
    quantity: 30,
    packets: 30,
    servings: 30,
    prep_time: "Prepared 30 mins ago",
    expiry_time: addHours(8), // 8 hours from now -> LOW PRIORITY
    dietary_information: ["Vegetarian"],
    allergens: ["Contains dairy"],
    pickup_location: "FreshBite Restaurant, Main Counter",
    contact_info: "Manager Rohan (+91 98765 43210)",
    additional_notes: "Dinner buffet surplus packed in insulated thermal food containers.",
    status: "AVAILABLE",
    priority: "LOW",
    created_at: subHours(0.5),
  },
];

let requirements: NgoRequirement[] = [
  {
    requirement_id: "REQ-201",
    ngo_id: "usr_ngo_1",
    ngo_name: "Hope Community Center",
    ngo_address: "Shaikpet, Hyderabad",
    ngo_lat: 17.4045,
    ngo_lng: 78.3986,
    food_type: "Cooked Meal",
    quantity_required: 15,
    people_to_serve: 20,
    dietary_requirement: ["Vegetarian"],
    required_before: "19:00",
    capacity: 60,
    fulfilled_quantity: 0,
    active: true,
  },
  {
    requirement_id: "REQ-202",
    ngo_id: "usr_ngo_2",
    ngo_name: "Helping Hands Foundation",
    ngo_address: "Ameerpet, Hyderabad",
    ngo_lat: 17.4375,
    ngo_lng: 78.4483,
    food_type: "Cooked Meal",
    quantity_required: 30,
    people_to_serve: 30,
    dietary_requirement: ["Vegetarian", "Vegan"],
    required_before: "20:00",
    capacity: 100,
    fulfilled_quantity: 0,
    active: true,
  },
  {
    requirement_id: "REQ-203",
    ngo_id: "usr_ngo_3",
    ngo_name: "Care & Share Trust",
    ngo_address: "Begumpet, Hyderabad",
    ngo_lat: 17.4448,
    ngo_lng: 78.4664,
    food_type: "Packaged Food",
    quantity_required: 20,
    people_to_serve: 25,
    dietary_requirement: ["Vegetarian"],
    required_before: "21:00",
    capacity: 50,
    fulfilled_quantity: 0,
    active: true,
  },
];

let deliveries: DeliveryTask[] = [];

let wasteLogs: WasteLog[] = [
  {
    waste_id: "WST-001",
    donation_id: "DON-098",
    food_name: "Fresh Fruit Salad Cups",
    quantity: 8,
    packets: 8,
    expiry_time: subHours(12),
    reason: "No pickup partner available before cut-off expiry window (45 mins).",
    donor_name: "Sunrise Cafe",
    intended_recipient: "Hope Community Center",
    timestamp: subHours(11),
  },
];

let notifications: NotificationItem[] = [
  {
    notification_id: "NOTIF-001",
    user_id: "usr_ngo_1",
    title: "🔔 Urgent Food Donation Match Available",
    message: "12 vegetarian meal packets available within 4.2 km from FreshBite Restaurant. Expires in 2 hours.",
    type: "DONATION",
    timestamp: subHours(0.5),
    read_status: false,
    link_view: "available-food",
  },
  {
    notification_id: "NOTIF-002",
    user_id: "usr_ngo_2",
    title: "🔔 New Food Donation Available",
    message: "25 rice & dal packets available within 5.5 km. Expires in 5 hours.",
    type: "DONATION",
    timestamp: subHours(1),
    read_status: true,
    link_view: "available-food",
  },
];

// ----------------------------------------------------
// Calculations & AI Matching Engine Helper Functions
// ----------------------------------------------------

// Calculate Haversine distance in km
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Calculate remaining hours and priority
function calculateExpiryAndPriority(expiryIso: string): {
  remainingHours: number;
  priority: DonationPriority;
  isExpired: boolean;
} {
  const diffMs = new Date(expiryIso).getTime() - Date.now();
  const remainingHours = diffMs / (1000 * 60 * 60);

  if (remainingHours <= 0) {
    return { remainingHours: 0, priority: "EXPIRED", isExpired: true };
  } else if (remainingHours <= 2) {
    return { remainingHours, priority: "HIGH", isExpired: false };
  } else if (remainingHours <= 8) {
    return { remainingHours, priority: "MEDIUM", isExpired: false };
  } else {
    return { remainingHours, priority: "LOW", isExpired: false };
  }
}

// Explainable AI Match calculation for a donation across all NGOs
function computeAiMatchesForDonation(donation: Donation): AiMatch[] {
  const { remainingHours, priority, isExpired } = calculateExpiryAndPriority(donation.expiry_time);

  if (isExpired) return [];

  const matches: AiMatch[] = [];

  for (const ngo of users.filter((u) => u.role === "ngo")) {
    const req = requirements.find((r) => r.ngo_id === ngo.id && r.active);
    const distanceKm = calculateDistanceKm(
      donation.donor_lat,
      donation.donor_lng,
      ngo.lat,
      ngo.lng
    );
    // Average urban speed ~ 20-25 km/h + 5 min loading
    const estimatedTravelMins = Math.max(10, Math.round((distanceKm / 22) * 60) + 5);

    let score = 50; // base score
    const reasons: string[] = [];

    // 1. Requirement alignment
    let quantityComparison = "";
    if (req) {
      if (req.food_type.toLowerCase() === donation.food_type.toLowerCase()) {
        score += 15;
        reasons.push(`✓ NGO currently requires ${donation.food_type}`);
      } else {
        reasons.push(`• Food type is complementary to NGO requirements`);
      }

      const needed = req.quantity_required - req.fulfilled_quantity;
      if (donation.packets <= needed) {
        score += 15;
        quantityComparison = `${donation.packets}/${needed} packets can be accepted — ${needed - donation.packets} packets still required`;
        reasons.push(`✓ Quantity can partially satisfy requirement (${quantityComparison})`);
      } else {
        score += 10;
        quantityComparison = `${needed}/${needed} packets will fully meet requirement (${donation.packets - needed} surplus can serve additional community members)`;
        reasons.push(`✓ Quantity meets and exceeds immediate requirement`);
      }

      // Dietary compatibility
      const reqDiet = req.dietary_requirement || [];
      const donDiet = donation.dietary_information || [];
      const hasMatch = reqDiet.some((d) => donDiet.includes(d));
      if (hasMatch || reqDiet.length === 0) {
        score += 10;
        reasons.push(`✓ Dietary information is compatible (${donDiet.join(", ") || "Standard"})`);
      } else {
        score -= 15;
        reasons.push(`⚠ Dietary suitability differs from preference`);
      }
    } else {
      quantityComparison = `Donation of ${donation.packets} packets available for community distribution`;
      reasons.push(`✓ Active charity center serving nearby beneficiaries`);
    }

    // 2. Distance factor
    if (distanceKm <= 5) {
      score += 15;
      reasons.push(`✓ NGO is nearby (${distanceKm} km away — quick dispatch)`);
    } else if (distanceKm <= 10) {
      score += 5;
      reasons.push(`✓ Within reachable transit range (${distanceKm} km)`);
    } else {
      score -= 15;
      reasons.push(`⚠ Distance (${distanceKm} km) requires higher transit buffer`);
    }

    // 3. Expiry urgency & delivery feasibility
    const travelHours = estimatedTravelMins / 60;
    const feasibilityHours = remainingHours - travelHours;
    let feasibility: "High" | "Medium" | "Low" = "High";

    if (feasibilityHours > 1) {
      score += 10;
      feasibility = "High";
      reasons.push(`✓ Delivery can easily be completed before expiry (${Math.round(remainingHours * 10) / 10}h remaining vs ~${estimatedTravelMins}m transit)`);
    } else if (feasibilityHours > 0.3) {
      score += 5;
      feasibility = "Medium";
      reasons.push(`⚠ Tight transit window: needs prompt pickup`);
    } else {
      score -= 25;
      feasibility = "Low";
      reasons.push(`✕ Critical time margin: risk of expiry during transit`);
    }

    if (priority === "HIGH") {
      score += 10;
      reasons.push(`✓ Donation has HIGH expiry priority — prioritized for rapid redistribution`);
    }

    const finalScore = Math.min(98, Math.max(20, Math.round(score)));

    matches.push({
      match_id: `MCH-${donation.donation_id}-${ngo.id.substring(8)}`,
      donation_id: donation.donation_id,
      ngo_id: ngo.id,
      ngo_name: ngo.organization_name || ngo.name,
      match_score: finalScore,
      distance_km: distanceKm,
      estimated_travel_minutes: estimatedTravelMins,
      reasons,
      compatibility_status: finalScore >= 75 ? "Suitable" : finalScore >= 50 ? "Partially suitable" : "Not suitable",
      delivery_feasibility: feasibility,
      quantity_comparison: quantityComparison,
      status: "PENDING",
    });
  }

  // Sort descending by score
  return matches.sort((a, b) => b.match_score - a.match_score);
}

// Background sweep for expired donations -> converts to Waste Log
function sweepExpiredDonations() {
  const swept: any[] = [];
  const currentDonations = [...donations];
  currentDonations.forEach((d) => {
    if (d.status === "AVAILABLE" || d.status === "MATCHED") {
      const { isExpired } = calculateExpiryAndPriority(d.expiry_time);
      if (isExpired) {
        d.status = "EXPIRED";
        d.priority = "EXPIRED";
        swept.push(d);
        // Log to waste table
        wasteLogs.unshift({
          waste_id: `WST-${Date.now().toString().slice(-4)}`,
          donation_id: d.donation_id,
          food_name: d.food_name,
          quantity: d.quantity,
          packets: d.packets,
          expiry_time: d.expiry_time,
          reason: "Reached expiry deadline before NGO acceptance/collection.",
          donor_name: d.donor_name,
          timestamp: new Date().toISOString(),
        });
        // Send alert notification
        notifications.unshift({
          notification_id: `NOTIF-${Date.now()}`,
          user_id: d.donor_id,
          title: "⚠️ Food Expiry Notice",
          message: `Donation ${d.donation_id} (${d.food_name}) reached its expiry deadline and has been marked unsafe for redistribution.`,
          type: "EXPIRY",
          timestamp: new Date().toISOString(),
          read_status: false,
        });
      }
    }
  });
  return swept;
}

// Run sweep every 30 seconds
setInterval(sweepExpiredDonations, 30000);

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// 1. Auth routes
app.post("/api/auth/login", (req, res) => {
  const { email, role } = req.body;
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === (email || "").toLowerCase() ||
      (role && u.role === role)
  );

  if (user) {
    return res.json({ success: true, user, token: `token_${user.id}_${Date.now()}` });
  }

  // Fallback default user by role
  const fallback = users.find((u) => u.role === (role || "donor")) || users[0];
  return res.json({ success: true, user: fallback, token: `token_${fallback.id}_${Date.now()}` });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, role, phone, organization_name, address } = req.body;
  const newUser: User = {
    id: `usr_${Date.now()}`,
    name: name || "New Member",
    email: email || `user_${Date.now()}@foodlink.org`,
    role: role || "donor",
    phone: phone || "+91 90000 00000",
    organization_name: organization_name || name,
    address: address || "Hyderabad, Telangana",
    lat: 17.4200 + (Math.random() - 0.5) * 0.05,
    lng: 78.4200 + (Math.random() - 0.5) * 0.05,
  };
  users.push(newUser);
  res.status(201).json({ success: true, user: newUser });
});

app.get("/api/users", (req, res) => {
  res.json({ success: true, users });
});

// 2. Donations routes
app.get("/api/donations", (req, res) => {
  // refresh priorities dynamically based on current time
  donations.forEach((d) => {
    if (d.status !== "DELIVERED" && d.status !== "EXPIRED") {
      const calc = calculateExpiryAndPriority(d.expiry_time);
      d.priority = calc.priority;
    }
  });

  const { donor_id, status, priority } = req.query;
  let filtered = [...donations];

  if (donor_id) {
    filtered = filtered.filter((d) => d.donor_id === donor_id);
  }
  if (status) {
    filtered = filtered.filter((d) => d.status === status);
  }
  if (priority) {
    filtered = filtered.filter((d) => d.priority === priority);
  }

  res.json({ success: true, donations: filtered });
});

app.get("/api/donations/priority", (req, res) => {
  const highPriority = donations.filter(
    (d) => d.priority === "HIGH" && d.status === "AVAILABLE"
  );
  res.json({ success: true, count: highPriority.length, donations: highPriority });
});

app.get("/api/donations/:id", (req, res) => {
  const donation = donations.find((d) => d.donation_id === req.params.id);
  if (!donation) {
    return res.status(404).json({ success: false, error: "Donation not found" });
  }
  res.json({ success: true, donation });
});

app.post("/api/donations", (req, res) => {
  const {
    donor_id,
    donorId,
    food_name,
    foodName,
    food_type,
    foodType,
    food_category,
    foodCategory,
    quantity,
    packets,
    servings,
    prep_time,
    prepTime,
    expiry_time,
    expiryTime,
    dietary_information,
    dietaryInformation,
    allergens,
    pickup_location,
    pickupAddress,
    contact_info,
    contactPhone,
    additional_notes,
    notes,
    latitude,
    longitude,
  } = req.body;

  const actualFoodName = food_name || foodName;
  const actualExpiryTime = expiry_time || expiryTime;
  const actualPackets = Number(packets) || Number(quantity) || 10;
  const actualServings = Number(servings) || actualPackets;

  // Validation
  if (!actualFoodName || !actualExpiryTime) {
    return res.status(400).json({
      success: false,
      error: "Food name and valid expiry date/time are mandatory.",
    });
  }

  // Prevent unrealistic amounts (e.g. > 500 packets per single run for safety)
  if (actualPackets > 500) {
    return res.status(400).json({
      success: false,
      error: "Unrealistic quantity: Donations above 500 packets require special fleet dispatch clearance.",
    });
  }

  const { priority, isExpired } = calculateExpiryAndPriority(actualExpiryTime);
  if (isExpired) {
    return res.status(400).json({
      success: false,
      error: "Food safety check failed: Expiry date and time must be in the future.",
    });
  }

  const requestedDonorId = donor_id || donorId;
  const donorUser =
    users.find((u) => u.id === requestedDonorId || u.id === "usr_donor_1") || users[0];

  const genId = `DON-${Date.now().toString().slice(-4)}`;

  const newDonation: any = {
    // Both standard properties and alias fields
    id: genId,
    donation_id: genId,
    donorId: donorUser.id,
    donor_id: donorUser.id,
    donorName: donorUser.organization_name || donorUser.name,
    donor_name: donorUser.organization_name || donorUser.name,
    donor_phone: donorUser.phone,
    donor_address: donorUser.address,
    donor_lat: latitude || donorUser.lat,
    donor_lng: longitude || donorUser.lng,
    latitude: latitude || donorUser.lat,
    longitude: longitude || donorUser.lng,
    foodName: actualFoodName,
    food_name: actualFoodName,
    foodType: food_type || foodType || "Cooked Meal",
    food_type: food_type || foodType || "Cooked Meal",
    foodCategory: food_category || foodCategory || "Veg Meal",
    food_category: food_category || foodCategory || "Veg Meal",
    quantity: actualPackets,
    packets: actualPackets,
    servings: actualServings,
    unit: "packets",
    prep_time: prep_time || prepTime || "Freshly prepared",
    prepTime: prep_time || prepTime || "Freshly prepared",
    expiry_time: actualExpiryTime,
    expiryTime: actualExpiryTime,
    availability_time: new Date().toISOString(),
    availabilityTime: new Date().toISOString(),
    dietary_information: Array.isArray(dietary_information || dietaryInformation)
      ? (dietary_information || dietaryInformation)
      : ["Vegetarian"],
    dietaryInformation: Array.isArray(dietary_information || dietaryInformation)
      ? (dietary_information || dietaryInformation)
      : ["Vegetarian"],
    allergens: Array.isArray(allergens) && allergens.length > 0 ? allergens : ["None"],
    pickup_location: pickup_location || pickupAddress || donorUser.address,
    pickupAddress: pickup_location || pickupAddress || donorUser.address,
    contact_info: contact_info || contactPhone || donorUser.phone,
    additional_notes: additional_notes || notes || "",
    status: "AVAILABLE",
    priority,
    created_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  donations.unshift(newDonation);

  // Compute AI matching for NGOs
  const matches = computeAiMatchesForDonation(newDonation);

  // 1. Create Donor Notification (Section 7)
  const donorNotification: any = {
    notification_id: `NOTIF-DON-${Date.now()}`,
    id: `NOTIF-DON-${Date.now()}`,
    user_id: donorUser.id,
    recipientUserId: donorUser.id,
    recipientRole: "DONOR",
    type: "DONATION_CREATED",
    donation_id: newDonation.donation_id,
    donationId: newDonation.donation_id,
    title: "Donation Listed on FoodLink AI",
    message: `${newDonation.food_name} (${newDonation.packets} packets) registered. AI matching nearby NGOs with safety priority ${newDonation.priority}.`,
    foodName: newDonation.food_name,
    food_name: newDonation.food_name,
    quantity: newDonation.packets,
    packets: newDonation.packets,
    unit: "packets",
    priority: newDonation.priority,
    expiryTime: newDonation.expiry_time,
    expiry_time: newDonation.expiry_time,
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    read_status: false,
    read: false,
    channel: "SMS",
    link_view: "my-donations",
  };
  notifications.unshift(donorNotification);

  // 2. Create NGO Notifications (Section 7 & 8: Guaranteed delivery to all NGOs)
  const ngos = users.filter((u) => u.role === "ngo");
  ngos.forEach((ngo) => {
    const distanceKm = calculateDistanceKm(
      newDonation.donor_lat,
      newDonation.donor_lng,
      ngo.lat,
      ngo.lng
    );
    const { remainingHours } = calculateExpiryAndPriority(newDonation.expiry_time);
    const remainingMins = Math.max(0, Math.round(remainingHours * 60));
    const hoursPart = Math.floor(remainingMins / 60);
    const minsPart = remainingMins % 60;
    const expiryCountdownStr =
      hoursPart > 0 ? `${hoursPart}h ${minsPart}m` : `${minsPart}m`;

    const ngoNotif: any = {
      notification_id: `NOTIF-NGO-${Date.now()}-${ngo.id}`,
      id: `NOTIF-NGO-${Date.now()}-${ngo.id}`,
      user_id: ngo.id,
      recipientUserId: ngo.id,
      recipientRole: "NGO",
      type: "NEW_DONATION",
      donation_id: newDonation.donation_id,
      donationId: newDonation.donation_id,
      title: "🔔 New Food Donation Available",
      message: `${newDonation.food_name} • ${newDonation.packets} packets (Serves ${newDonation.servings} people). Expires in ${expiryCountdownStr} (${distanceKm} km away). Priority: ${newDonation.priority}.`,
      foodName: newDonation.food_name,
      food_name: newDonation.food_name,
      quantity: newDonation.packets,
      packets: newDonation.packets,
      servings: newDonation.servings,
      unit: "packets",
      priority: newDonation.priority,
      expiryTime: newDonation.expiry_time,
      expiry_time: newDonation.expiry_time,
      distance: distanceKm,
      distance_km: distanceKm,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      read_status: false,
      read: false,
      channel: "In-App",
      link_view: "available-food",
      meta: {
        donation_id: newDonation.donation_id,
        donationId: newDonation.donation_id,
        food_name: newDonation.food_name,
        packets: newDonation.packets,
        servings: newDonation.servings,
        priority: newDonation.priority,
        distance_km: distanceKm,
      },
    };
    notifications.unshift(ngoNotif);
  });

  // Return both root properties and nested donation object for full client compatibility
  res.status(201).json({
    success: true,
    message: "Donation successfully logged and evaluated by FoodLink AI engine.",
    ...newDonation,
    donation: newDonation,
    donor_notification: donorNotification,
    ai_matches: matches,
  });
});

// 3. NGO Requirements
app.get(["/api/requirements", "/api/ngo/requirements"], (req, res) => {
  res.json({ success: true, requirements });
});

app.put("/api/requirements/:id", (req, res) => {
  const reqItem = requirements.find((r) => r.requirement_id === req.params.id);
  if (reqItem) {
    Object.assign(reqItem, req.body);
  }
  res.json({ success: true, requirement: reqItem });
});

app.post(["/api/requirements", "/api/ngo/requirements"], (req, res) => {
  const { ngo_id, food_type, quantity_required, people_to_serve, dietary_requirement, required_before, capacity } = req.body;
  const ngoUser = users.find((u) => u.id === ngo_id) || users.find((u) => u.role === "ngo");

  const newReq: NgoRequirement = {
    requirement_id: `REQ-${Date.now().toString().slice(-4)}`,
    ngo_id: ngoUser?.id || "usr_ngo_1",
    ngo_name: ngoUser?.organization_name || "Hope Community Center",
    ngo_address: ngoUser?.address || "Shaikpet, Hyderabad",
    ngo_lat: ngoUser?.lat || 17.4045,
    ngo_lng: ngoUser?.lng || 78.3986,
    food_type: food_type || "Cooked Meal",
    quantity_required: Number(quantity_required) || 20,
    people_to_serve: Number(people_to_serve) || 25,
    dietary_requirement: dietary_requirement || ["Vegetarian"],
    required_before: required_before || "19:00",
    capacity: Number(capacity) || 50,
    fulfilled_quantity: 0,
    active: true,
  };

  // Replace or add
  requirements = [newReq, ...requirements.filter((r) => r.ngo_id !== newReq.ngo_id)];
  res.status(201).json({ success: true, requirement: newReq });
});

// 4. AI Matches
app.get(["/api/matches/:donation_id", "/api/donations/:donation_id/matches"], (req, res) => {
  const donation = donations.find(
    (d) => d.donation_id === req.params.donation_id || (d as any).id === req.params.donation_id
  );
  if (!donation) {
    return res.status(404).json({ success: false, error: "Donation not found" });
  }

  const matches = computeAiMatchesForDonation(donation);
  res.json({ success: true, matches });
});

// 5. NGO Acceptance Workflow (Section 10 Critical Requirement!)
app.post(["/api/matches/:id/accept", "/api/donations/:id/accept"], (req, res) => {
  const { ngo_id, donation_id } = req.body;
  let donation = donations.find((d) => d.donation_id === donation_id || (d as any).id === donation_id);

  // If not found directly, extract from req.params.id
  if (!donation && req.params.id) {
    const rawId = req.params.id.replace("match_auto_", "").replace("match_", "");
    donation = donations.find(
      (d) => d.donation_id === rawId || (d as any).id === rawId || d.donation_id === req.params.id
    );
  }

  if (!donation) {
    donation = donations.find((d) => d.status === "AVAILABLE");
  }

  if (!donation) {
    return res.status(404).json({ success: false, error: "Donation not found or already assigned." });
  }

  // Food safety check
  const { isExpired } = calculateExpiryAndPriority(donation.expiry_time);
  if (isExpired || donation.status === "EXPIRED") {
    return res.status(400).json({
      success: false,
      error: "Food safety restriction: This donation has reached its expiry threshold and cannot be accepted.",
    });
  }

  const ngoUser =
    users.find((u) => u.id === ngo_id || u.role === "ngo") ||
    users.find((u) => u.id === "usr_ngo_1") ||
    users[3];

  // Update donation status
  donation.status = "ACCEPTED";
  donation.accepted_by_ngo_id = ngoUser?.id;
  donation.accepted_by_ngo_name = ngoUser?.organization_name || ngoUser?.name;
  (donation as any).acceptedByNgoId = ngoUser?.id;
  (donation as any).acceptedAt = new Date().toISOString();

  // Update NGO requirement fulfillment
  const reqItem = requirements.find((r) => r.ngo_id === ngoUser?.id);
  if (reqItem) {
    reqItem.fulfilled_quantity = Math.min(
      reqItem.quantity_required,
      reqItem.fulfilled_quantity + donation.packets
    );
  }

  // Calculate distance between donor and NGO
  const distanceKm = calculateDistanceKm(
    donation.donor_lat,
    donation.donor_lng,
    ngoUser ? ngoUser.lat : 17.4045,
    ngoUser ? ngoUser.lng : 78.3986
  );
  const estimatedTimeMins = Math.max(12, Math.round((distanceKm / 22) * 60) + 5);

  // Find delivery person (Rajesh Kumar or first available)
  const deliveryPerson =
    users.find((u) => u.id === "usr_delivery_1") ||
    users.find((u) => u.role === "delivery") ||
    users[6];

  // Create Delivery Task (Section 10: Only AFTER NGO accepts, pickup and receiver locations unlock!)
  const newDelivery: DeliveryTask = {
    delivery_id: `DEL-${Date.now().toString().slice(-4)}`,
    donation_id: donation.donation_id,
    food_name: donation.food_name,
    quantity_display: `${donation.packets} Packets (${donation.servings} Servings)`,
    donor_id: donation.donor_id,
    donor_name: donation.donor_name,
    pickup_location: donation.pickup_location,
    pickup_lat: donation.donor_lat,
    pickup_lng: donation.donor_lng,
    donor_contact: donation.contact_info,
    ngo_id: ngoUser?.id || "usr_ngo_1",
    ngo_name: ngoUser?.organization_name || "Hope Community Center",
    destination: ngoUser?.address || "Shaikpet, Hyderabad",
    dest_lat: ngoUser?.lat || 17.4045,
    dest_lng: ngoUser?.lng || 78.3986,
    ngo_contact: ngoUser?.phone || "+91 98201 54321",
    delivery_person_id: deliveryPerson.id,
    delivery_person_name: deliveryPerson.name,
    delivery_person_phone: deliveryPerson.phone,
    distance_km: distanceKm,
    estimated_time_minutes: estimatedTimeMins,
    current_lat: deliveryPerson.lat,
    current_lng: deliveryPerson.lng,
    status: "ASSIGNED",
    expiry_time: donation.expiry_time,
    route_coordinates: [
      [deliveryPerson.lat, deliveryPerson.lng],
      [donation.donor_lat, donation.donor_lng],
      [ngoUser?.lat || 17.4045, ngoUser?.lng || 78.3986],
    ] as any,
  };

  deliveries.unshift(newDelivery);
  donation.assigned_delivery_id = newDelivery.delivery_id;

  // 1. Notify Donor: "Your donation has been accepted by [NGO Name]"
  notifications.unshift({
    notification_id: `NOTIF-${Date.now()}-donor`,
    id: `NOTIF-${Date.now()}-donor`,
    user_id: donation.donor_id,
    recipientUserId: donation.donor_id,
    recipientRole: "DONOR",
    title: "🎉 Donation Accepted!",
    message: `Your donation of ${donation.packets} packets has been accepted by ${newDelivery.ngo_name}. Delivery partner ${deliveryPerson.name} has been assigned.`,
    type: "ACCEPTANCE",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    read_status: false,
    read: false,
    link_view: "my-donations",
    meta: { donation_id: donation.donation_id, delivery_id: newDelivery.delivery_id },
  } as any);

  // 2. Notify Delivery Person: "New delivery task assigned"
  notifications.unshift({
    notification_id: `NOTIF-${Date.now()}-delivery`,
    id: `NOTIF-${Date.now()}-delivery`,
    user_id: deliveryPerson.id,
    recipientUserId: deliveryPerson.id,
    recipientRole: "DELIVERY",
    title: "🚴 New Delivery Task Assigned",
    message: `Pickup: ${donation.donor_name} → Destination: ${newDelivery.ngo_name}. Distance: ${distanceKm} km. Priority: ${donation.priority}.`,
    type: "DELIVERY",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    read_status: false,
    read: false,
    link_view: "delivery-dashboard",
    meta: { delivery_id: newDelivery.delivery_id },
  } as any);

  // 3. Notify NGO: "Donation accepted and courier dispatched"
  notifications.unshift({
    notification_id: `NOTIF-${Date.now()}-ngo-confirmed`,
    id: `NOTIF-${Date.now()}-ngo-confirmed`,
    user_id: ngoUser?.id || "usr_ngo_1",
    recipientUserId: ngoUser?.id || "usr_ngo_1",
    recipientRole: "NGO",
    title: "✅ Donation Accepted & Courier Dispatched",
    message: `Courier ${deliveryPerson.name} has been assigned to collect ${donation.food_name} from ${donation.donor_name}.`,
    type: "DELIVERY",
    timestamp: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    read_status: false,
    read: false,
    link_view: "delivery-tracking",
    meta: { delivery_id: newDelivery.delivery_id },
  } as any);

  res.json({
    success: true,
    message: `Donation accepted by ${newDelivery.ngo_name}. Delivery task created and routes generated!`,
    delivery: newDelivery,
    donation,
  });
});

// 6. Deliveries Workflow
app.get("/api/deliveries", (req, res) => {
  res.json({ success: true, deliveries });
});

app.get("/api/deliveries/:id/tracking", (req, res) => {
  const delivery = deliveries.find((d) => d.delivery_id === req.params.id);
  if (!delivery) {
    return res.status(404).json({ success: false, error: "Delivery not found" });
  }

  const donation = donations.find((d) => d.donation_id === delivery.donation_id);
  const { remainingHours } = calculateExpiryAndPriority(delivery.expiry_time);

  res.json({
    success: true,
    tracking: {
      delivery,
      donation,
      remaining_hours: Math.max(0, Math.round(remainingHours * 10) / 10),
      current_step:
        delivery.status === "ASSIGNED"
          ? 1
          : delivery.status === "GOING_TO_PICKUP"
          ? 2
          : delivery.status === "FOOD_COLLECTED"
          ? 3
          : delivery.status === "OUT_FOR_DELIVERY"
          ? 4
          : delivery.status === "DELIVERED_SUCCESSFULLY"
          ? 5
          : 0,
    },
  });
});

app.put("/api/deliveries/:id/status", (req, res) => {
  const { status, failure_reason } = req.body as { status: DeliveryStatus; failure_reason?: string };
  const delivery = deliveries.find((d) => d.delivery_id === req.params.id);

  if (!delivery) {
    return res.status(404).json({ success: false, error: "Delivery task not found" });
  }

  const donation = donations.find((d) => d.donation_id === delivery.donation_id);

  delivery.status = status;

  if (status === "FOOD_COLLECTED") {
    delivery.pickup_time = new Date().toISOString();
    // Update simulated current position to donor location
    delivery.current_lat = delivery.pickup_lat;
    delivery.current_lng = delivery.pickup_lng;
    if (donation) donation.status = "FOOD_COLLECTED";

    notifications.unshift({
      notification_id: `NOTIF-${Date.now()}-collected`,
      user_id: delivery.ngo_id,
      title: "📦 Food Collected by Delivery Partner",
      message: `${delivery.delivery_person_name} has picked up ${delivery.food_name} from ${delivery.donor_name} and is heading your way.`,
      type: "DELIVERY",
      timestamp: new Date().toISOString(),
      read_status: false,
    });
  } else if (status === "OUT_FOR_DELIVERY") {
    // Intermediate waypoint
    delivery.current_lat = (delivery.pickup_lat + delivery.dest_lat) / 2;
    delivery.current_lng = (delivery.pickup_lng + delivery.dest_lng) / 2;
    if (donation) donation.status = "IN_TRANSIT";
  } else if (status === "DELIVERED_SUCCESSFULLY") {
    delivery.delivery_time = new Date().toISOString();
    delivery.current_lat = delivery.dest_lat;
    delivery.current_lng = delivery.dest_lng;
    if (donation) donation.status = "DELIVERED";

    // 1. Notify Donor
    notifications.unshift({
      notification_id: `NOTIF-${Date.now()}-delivered-donor`,
      user_id: delivery.donor_id,
      title: "✅ Donation Successfully Delivered!",
      message: `Your donation of ${delivery.food_name} has reached ${delivery.ngo_name}. Thank you for preventing food waste!`,
      type: "DELIVERY",
      timestamp: new Date().toISOString(),
      read_status: false,
      link_view: "donation-success",
      meta: { delivery_id: delivery.delivery_id },
    });

    // 2. Notify NGO
    notifications.unshift({
      notification_id: `NOTIF-${Date.now()}-delivered-ngo`,
      user_id: delivery.ngo_id,
      title: "🎉 Food Delivered & Received!",
      message: `${delivery.food_name} has arrived at your distribution center. Ready to serve community members.`,
      type: "DELIVERY",
      timestamp: new Date().toISOString(),
      read_status: false,
    });
  } else if (status === "UNABLE_TO_DELIVER") {
    delivery.failure_reason = failure_reason || "Logistics or access issue during transit";
    if (donation) donation.status = "CANCELLED";

    wasteLogs.unshift({
      waste_id: `WST-${Date.now().toString().slice(-4)}`,
      donation_id: delivery.donation_id,
      food_name: delivery.food_name,
      quantity: donation?.quantity || 10,
      packets: donation?.packets || 10,
      expiry_time: delivery.expiry_time,
      reason: `Failed delivery: ${delivery.failure_reason}`,
      donor_name: delivery.donor_name,
      intended_recipient: delivery.ngo_name,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({ success: true, delivery, donation });
});

// 7. Dashboard Statistics
app.get(["/api/stats", "/api/dashboard/statistics"], (req, res) => {
  const totalDonations = donations.length;
  const completedDonations = donations.filter((d) => d.status === "DELIVERED").length;
  const activeDonations = donations.filter(
    (d) => d.status === "AVAILABLE" || d.status === "ACCEPTED" || d.status === "ASSIGNED" || d.status === "FOOD_COLLECTED" || d.status === "IN_TRANSIT"
  ).length;
  const expiredDonations = donations.filter((d) => d.status === "EXPIRED").length + wasteLogs.length;

  const totalPacketsDonated = donations.reduce((acc, d) => acc + d.packets, 0);
  const totalPacketsDelivered = donations
    .filter((d) => d.status === "DELIVERED")
    .reduce((acc, d) => acc + d.packets, 0);
  const peopleServed = donations
    .filter((d) => d.status === "DELIVERED")
    .reduce((acc, d) => acc + d.servings, 0);

  const activeDeliveries = deliveries.filter(
    (d) => d.status !== "DELIVERED_SUCCESSFULLY" && d.status !== "UNABLE_TO_DELIVER"
  ).length;

  const wastedKg = wasteLogs.reduce((acc, w) => acc + (w.quantity || 5), 0);

  const stats: DashboardStats = {
    total_donations: totalDonations,
    active_donations: activeDonations,
    completed_donations: completedDonations,
    food_packets_donated: totalPacketsDonated,
    food_packets_delivered: totalPacketsDelivered,
    people_served: peopleServed,
    active_deliveries: activeDeliveries,
    expired_donations: expiredDonations,
    wasted_food_kg: wastedKg,
    high_priority_count: donations.filter((d) => d.priority === "HIGH" && d.status === "AVAILABLE").length,
    donations_over_time: [
      { date: "Mon", donations: 14, delivered: 14 },
      { date: "Tue", donations: 22, delivered: 20 },
      { date: "Wed", donations: 18, delivered: 17 },
      { date: "Thu", donations: 28, delivered: 27 },
      { date: "Fri", donations: 35, delivered: 33 },
      { date: "Sat", donations: 42, delivered: 40 },
      { date: "Today", donations: totalDonations, delivered: completedDonations },
    ],
    category_breakdown: [
      { name: "Cooked Meals", value: 65 },
      { name: "Bakery & Breads", value: 15 },
      { name: "Rice & Grains", value: 12 },
      { name: "Packaged & Dairy", value: 8 },
    ],
    impact_saved_rupees: (totalPacketsDelivered || 45) * 85, // estimated ₹85 per meal saved
  };

  res.json({ success: true, statistics: stats, stats, ...stats });
});

// 8. Notifications
app.get("/api/notifications", (req, res) => {
  const { user_id, userId, role, recipientRole } = req.query as Record<string, string>;
  const filterUser = user_id || userId;
  const filterRole = (role || recipientRole || "").toUpperCase();

  let list = [...notifications];

  if (filterUser && filterUser !== "ALL") {
    list = list.filter((n: any) => {
      if (n.user_id === filterUser || n.recipientUserId === filterUser || n.user_id === "ALL") return true;
      // Also match normalized variants usr_ngo_1 <-> user_ngo_1
      const normalizedQuery = filterUser.replace("user_", "usr_");
      const normalizedNotifUser = (n.user_id || "").replace("user_", "usr_");
      if (normalizedQuery === normalizedNotifUser) return true;
      // Match by role if requested
      if (filterRole && (n.recipientRole || "").toUpperCase() === filterRole) return true;
      return false;
    });
  } else if (filterRole) {
    list = list.filter((n: any) => (n.recipientRole || "").toUpperCase() === filterRole);
  }

  const unreadCount = list.filter((n: any) => !n.read_status && !n.read).length;
  res.json({ success: true, notifications: list, unread_count: unreadCount, unreadCount });
});

app.put("/api/notifications/:id/read", (req, res) => {
  const notif = notifications.find(
    (n) => n.notification_id === req.params.id || (n as any).id === req.params.id
  );
  if (notif) {
    notif.read_status = true;
    (notif as any).read = true;
  }
  res.json({ success: true });
});

app.put("/api/notifications/read-all", (req, res) => {
  notifications.forEach((n) => {
    n.read_status = true;
    (n as any).read = true;
  });
  res.json({ success: true });
});

// 9. Waste Logs
app.get(["/api/waste", "/api/waste-logs"], (req, res) => {
  res.json({ success: true, waste_logs: wasteLogs, wasteLogs });
});

// Safety sweep endpoint
app.post("/api/maintenance/sweep-expired", (req, res) => {
  const swept = sweepExpiredDonations();
  res.json({
    success: true,
    message: "Automated expiry & safety sweep completed.",
    swept_count: swept.length,
    swept,
  });
});

// 10. Reset Demo State (Crucial for live hackathon walkthroughs!)
app.post("/api/system/reset-demo", (req, res) => {
  // Re-seed original demo state
  donations = [
    {
      donation_id: "DON-101",
      donor_id: "usr_donor_1",
      donor_name: "FreshBite Restaurant",
      donor_phone: "+91 98765 43210",
      donor_address: "Road No. 36, Jubilee Hills, Hyderabad",
      donor_lat: 17.4319,
      donor_lng: 78.4073,
      food_name: "Vegetarian Meal Pack",
      food_type: "Cooked Meal",
      food_category: "Veg Meal",
      quantity: 12,
      packets: 12,
      servings: 12,
      prep_time: "Prepared 1 hour ago",
      expiry_time: addHours(2),
      dietary_information: ["Vegetarian", "Jain-friendly"],
      allergens: ["None"],
      pickup_location: "FreshBite Restaurant, Gate 2 Kitchen, Jubilee Hills",
      contact_info: "Chef Vikram (+91 98765 43210)",
      additional_notes: "Freshly cooked paneer pulao, dal tadka, and phulkas packed in sealed aluminum boxes.",
      status: "AVAILABLE",
      priority: "HIGH",
      created_at: subHours(1),
    },
    {
      donation_id: "DON-102",
      donor_id: "usr_donor_2",
      donor_name: "GreenLeaf Catering",
      donor_phone: "+91 98450 11223",
      donor_address: "Banjara Hills, Hyderabad",
      donor_lat: 17.4156,
      donor_lng: 78.4350,
      food_name: "Steamed Basmati Rice & Dal Packs",
      food_type: "Cooked Meal",
      food_category: "Veg Meal",
      quantity: 25,
      packets: 25,
      servings: 25,
      prep_time: "Prepared 2 hours ago",
      expiry_time: addHours(5),
      dietary_information: ["Vegetarian", "Gluten-free", "Vegan"],
      allergens: ["None"],
      pickup_location: "GreenLeaf Central Kitchen, Banjara Hills",
      contact_info: "Operations Desk (+91 98450 11223)",
      additional_notes: "Catering surplus from corporate conference luncheon.",
      status: "AVAILABLE",
      priority: "MEDIUM",
      created_at: subHours(2),
    },
    {
      donation_id: "DON-103",
      donor_id: "usr_donor_3",
      donor_name: "City Supermarket",
      donor_phone: "+91 99887 76655",
      donor_address: "Madhapur, HITEC City, Hyderabad",
      donor_lat: 17.4483,
      donor_lng: 78.3915,
      food_name: "Whole Wheat Bread & Buns",
      food_type: "Bakery & Bread",
      food_category: "Bakery",
      quantity: 10,
      packets: 10,
      servings: 15,
      prep_time: "Baked this morning",
      expiry_time: addHours(0.75),
      dietary_information: ["Vegetarian"],
      allergens: ["Contains gluten"],
      pickup_location: "City Supermarket In-store Bakery",
      contact_info: "Bakery Manager (+91 99887 76655)",
      additional_notes: "Fresh artisan loaves and dinner buns.",
      status: "AVAILABLE",
      priority: "HIGH",
      created_at: subHours(3),
    },
    {
      donation_id: "DON-104",
      donor_id: "usr_donor_1",
      donor_name: "FreshBite Restaurant",
      donor_phone: "+91 98765 43210",
      donor_address: "Road No. 36, Jubilee Hills, Hyderabad",
      donor_lat: 17.4319,
      donor_lng: 78.4073,
      food_name: "Assorted Dinner Meal Boxes",
      food_type: "Cooked Meal",
      food_category: "Veg Meal",
      quantity: 30,
      packets: 30,
      servings: 30,
      prep_time: "Prepared 30 mins ago",
      expiry_time: addHours(8),
      dietary_information: ["Vegetarian"],
      allergens: ["Contains dairy"],
      pickup_location: "FreshBite Restaurant, Main Counter",
      contact_info: "Manager Rohan (+91 98765 43210)",
      additional_notes: "Dinner buffet surplus packed in insulated thermal food containers.",
      status: "AVAILABLE",
      priority: "LOW",
      created_at: subHours(0.5),
    },
  ];

  requirements[0].fulfilled_quantity = 0;
  deliveries = [];

  notifications = [
    {
      notification_id: "NOTIF-001",
      user_id: "usr_ngo_1",
      title: "🔔 Urgent Food Donation Match Available",
      message: "12 vegetarian meal packets available within 4.2 km from FreshBite Restaurant. Expires in 2 hours.",
      type: "DONATION",
      timestamp: new Date().toISOString(),
      read_status: false,
      link_view: "available-food",
    },
  ];

  res.json({ success: true, message: "Demo scenario reset successfully! Ready for walkthrough." });
});

// ----------------------------------------------------
// Vite Middleware / Static Serving Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use("/FoodLink-AI", express.static(distPath));
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FoodLink AI Server running on http://localhost:${PORT}`);
  });
}

startServer();

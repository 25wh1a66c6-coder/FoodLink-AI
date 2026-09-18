import type {
  Donation,
  DashboardStats,
  NgoRequirement,
  DeliveryTask,
  WasteLog,
  NotificationItem,
  User,
  AiMatch,
  DeliveryStatus,
} from "../types";

// Helper: current date offset
const now = new Date();
const addHours = (h: number) => new Date(now.getTime() + h * 60 * 60 * 1000).toISOString();
const subHours = (h: number) => new Date(now.getTime() - h * 60 * 60 * 1000).toISOString();

const INITIAL_USERS: User[] = [
  {
    id: "usr_donor_1",
    name: "Chef Vikram",
    email: "manager@freshbite.com",
    role: "donor",
    phone: "+91 98765 43210",
    organization_name: "FreshBite Restaurant",
    address: "Road No. 36, Jubilee Hills, Hyderabad, Telangana",
    lat: 17.4319,
    lng: 78.4073,
    avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=120&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_donor_2",
    name: "Anita Sharma",
    email: "anita@greenleafcatering.in",
    role: "donor",
    phone: "+91 98450 11223",
    organization_name: "GreenLeaf Catering",
    address: "Banjara Hills, Hyderabad, Telangana",
    lat: 17.4156,
    lng: 78.4350,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=120&auto=format&fit=crop&q=80",
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

const INITIAL_DONATIONS: Donation[] = [
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
    expiry_time: addHours(2), // 2 hours from now -> HIGH PRIORITY
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
    expiry_time: addHours(0.75), // 45 mins -> HIGH PRIORITY
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

const INITIAL_REQUIREMENTS: NgoRequirement[] = [
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

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    notification_id: "NOTIF-001",
    user_id: "usr_ngo_1",
    recipientUserId: "usr_ngo_1",
    recipientRole: "NGO",
    title: "🔔 Urgent Food Donation Match Available",
    message: "12 vegetarian meal packets available within 4.2 km from FreshBite Restaurant. Expires in 2 hours.",
    type: "DONATION",
    timestamp: subHours(0.5),
    read_status: false,
    link_view: "available-food",
  },
  {
    notification_id: "NOTIF-002",
    user_id: "usr_ngo_1",
    recipientUserId: "usr_ngo_1",
    recipientRole: "NGO",
    title: "🔔 New Food Donation Available",
    message: "Whole Wheat Bread & Buns • 10 packets. Expires in 45m (5.1 km away). Priority: HIGH.",
    type: "NEW_DONATION",
    timestamp: subHours(0.2),
    read_status: false,
    link_view: "available-food",
  },
];

const INITIAL_WASTE_LOGS: WasteLog[] = [
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

// Local state container for static deployments (GitHub Pages)
class LocalStateStore {
  donations: Donation[] = [...INITIAL_DONATIONS];
  requirements: NgoRequirement[] = [...INITIAL_REQUIREMENTS];
  deliveries: DeliveryTask[] = [];
  wasteLogs: WasteLog[] = [...INITIAL_WASTE_LOGS];
  notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];
  users: User[] = [...INITIAL_USERS];

  constructor() {
    this.loadFromStorage();
  }

  loadFromStorage() {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem("foodlink_state_v1");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.donations) this.donations = parsed.donations;
        if (parsed.requirements) this.requirements = parsed.requirements;
        if (parsed.deliveries) this.deliveries = parsed.deliveries;
        if (parsed.wasteLogs) this.wasteLogs = parsed.wasteLogs;
        if (parsed.notifications) this.notifications = parsed.notifications;
        if (parsed.users) this.users = parsed.users;
      }
    } catch (e) {
      console.warn("Could not load stored state:", e);
    }
  }

  saveToStorage() {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "foodlink_state_v1",
        JSON.stringify({
          donations: this.donations,
          requirements: this.requirements,
          deliveries: this.deliveries,
          wasteLogs: this.wasteLogs,
          notifications: this.notifications,
          users: this.users,
        })
      );
    } catch (e) {
      console.warn("Could not save state:", e);
    }
  }

  getStats(): DashboardStats {
    const totalDonations = this.donations.length;
    const activeDonations = this.donations.filter(
      (d) => d.status === "AVAILABLE" || d.status === "MATCHED" || d.status === "ACCEPTED" || d.status === "IN_TRANSIT"
    ).length;
    const completedDonations = this.donations.filter((d) => d.status === "DELIVERED").length;
    const foodPacketsDonated = this.donations.reduce((sum, d) => sum + (d.packets || d.quantity || 0), 0);
    const foodPacketsDelivered = this.donations
      .filter((d) => d.status === "DELIVERED")
      .reduce((sum, d) => sum + (d.packets || d.quantity || 0), 0);
    const peopleServed = foodPacketsDelivered > 0 ? foodPacketsDelivered : Math.round(foodPacketsDonated * 0.75);
    const expiredDonations = this.donations.filter((d) => d.status === "EXPIRED").length;
    const wastedKg = this.wasteLogs.reduce((sum, w) => sum + (w.packets || w.quantity || 0) * 0.4, 0);
    const activeDeliveries = this.deliveries.filter(
      (d) => d.status !== "DELIVERED_SUCCESSFULLY" && d.status !== "UNABLE_TO_DELIVER"
    ).length;
    const highPriorityCount = this.donations.filter((d) => d.priority === "HIGH" && d.status === "AVAILABLE").length;
    const impactSavedRupees = (foodPacketsDelivered || foodPacketsDonated) * 65;

    return {
      total_donations: totalDonations,
      active_donations: activeDonations,
      completed_donations: completedDonations,
      food_packets_donated: foodPacketsDonated,
      food_packets_delivered: foodPacketsDelivered,
      people_served: peopleServed,
      expired_donations: expiredDonations,
      wasted_food_kg: Math.round(wastedKg * 10) / 10,
      active_deliveries: activeDeliveries,
      high_priority_count: highPriorityCount,
      impact_saved_rupees: impactSavedRupees,
      donations_over_time: [
        { date: "Mon", donations: 18, delivered: 16 },
        { date: "Tue", donations: 24, delivered: 22 },
        { date: "Wed", donations: 32, delivered: 30 },
        { date: "Thu", donations: 29, delivered: 27 },
        { date: "Fri", donations: 45, delivered: 42 },
        { date: "Sat", donations: 58, delivered: 55 },
        { date: "Sun", donations: 41, delivered: 39 },
      ],
      category_breakdown: [
        { name: "Cooked Meals", value: 56 },
        { name: "Bakery & Bread", value: 23 },
        { name: "Produce / Fresh", value: 13 },
        { name: "Packaged / Dry", value: 8 },
      ],
    };
  }

  createDonation(donationData: any): Donation {
    const id = `DON-${Math.floor(1000 + Math.random() * 9000)}`;
    const packets = Number(donationData.packets || donationData.quantity || 10);
    const newDonation: Donation = {
      donation_id: id,
      donor_id: donationData.donor_id || "usr_donor_1",
      donor_name: donationData.donor_name || "FreshBite Restaurant",
      donor_phone: donationData.contact_info || "+91 98765 43210",
      donor_address: donationData.pickup_location || "Jubilee Hills, Hyderabad",
      donor_lat: donationData.latitude || 17.4325,
      donor_lng: donationData.longitude || 78.4072,
      food_name: donationData.food_name || "Fresh Meal",
      food_type: donationData.food_type || "Cooked Meal",
      food_category: donationData.food_category || "Veg Meal",
      quantity: packets,
      packets: packets,
      servings: Number(donationData.servings || packets),
      prep_time: donationData.prep_time || "Freshly prepared",
      expiry_time: donationData.expiry_time || addHours(3),
      dietary_information: donationData.dietary_information || ["Vegetarian"],
      allergens: donationData.allergens || ["None"],
      pickup_location: donationData.pickup_location || "Main Counter",
      contact_info: donationData.contact_info || "+91 98765 43210",
      additional_notes: donationData.additional_notes || "",
      status: "AVAILABLE",
      priority: donationData.priority || "HIGH",
      created_at: new Date().toISOString(),
    };

    this.donations.unshift(newDonation);

    // Create notifications for NGOs
    this.notifications.unshift({
      notification_id: `NOTIF-${Date.now()}`,
      user_id: "usr_ngo_1",
      recipientUserId: "usr_ngo_1",
      recipientRole: "NGO",
      donation_id: newDonation.donation_id,
      title: "🔔 New Food Donation Available",
      message: `${newDonation.food_name} • ${newDonation.packets} packets available nearby. Priority: ${newDonation.priority}.`,
      food_name: newDonation.food_name,
      packets: newDonation.packets,
      priority: newDonation.priority,
      type: "NEW_DONATION",
      timestamp: new Date().toISOString(),
      read_status: false,
    });

    this.saveToStorage();
    return newDonation;
  }

  acceptMatch(match: AiMatch, donation: Donation, ngoData: any) {
    // Update donation status
    const targetDonation = this.donations.find((d) => d.donation_id === donation.donation_id);
    if (targetDonation) {
      targetDonation.status = "ACCEPTED";
    }

    // Create delivery task
    const delId = `DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDelivery: DeliveryTask = {
      delivery_id: delId,
      donation_id: donation.donation_id,
      food_name: donation.food_name,
      quantity_display: `${donation.packets} packets`,
      donor_id: donation.donor_id,
      donor_name: donation.donor_name,
      pickup_location: donation.pickup_location || donation.donor_address,
      pickup_lat: donation.donor_lat,
      pickup_lng: donation.donor_lng,
      donor_contact: donation.donor_phone || "+91 98765 43210",
      ngo_id: ngoData.ngo_id || "usr_ngo_1",
      ngo_name: ngoData.ngo_name || "Hope Community Center",
      destination: ngoData.destination || "Shaikpet, Hyderabad",
      dest_lat: 17.4045,
      dest_lng: 78.3986,
      ngo_contact: ngoData.contact_phone || "+91 98201 54321",
      delivery_person_id: ngoData.delivery_person_id || "usr_delivery_1",
      delivery_person_name: ngoData.delivery_person_name || "Rajesh Kumar",
      delivery_person_phone: "+91 91234 56789",
      current_lat: 17.4200,
      current_lng: 78.4050,
      distance_km: match.distance_km || 4.2,
      estimated_time_minutes: match.estimated_travel_minutes || 22,
      status: "ASSIGNED",
      expiry_time: donation.expiry_time,
    };

    this.deliveries.unshift(newDelivery);

    // Update NGO requirement fulfillment
    const req = this.requirements.find((r) => r.ngo_id === newDelivery.ngo_id) || this.requirements[0];
    if (req) {
      req.fulfilled_quantity = (req.fulfilled_quantity || 0) + donation.packets;
    }

    // Notifications
    this.notifications.unshift({
      notification_id: `NOTIF-${Date.now()}-DEL`,
      user_id: "usr_delivery_1",
      recipientUserId: "usr_delivery_1",
      recipientRole: "DELIVERY",
      title: "📦 New Pickup Assigned",
      message: `Pickup ${donation.packets} packets of ${donation.food_name} from ${donation.donor_name}. Deliver to ${newDelivery.ngo_name}.`,
      type: "DELIVERY",
      timestamp: new Date().toISOString(),
      read_status: false,
    });

    this.saveToStorage();
    return { success: true, delivery: newDelivery };
  }

  updateDeliveryStatus(deliveryId: string, status: DeliveryStatus, reason?: string) {
    const delivery = this.deliveries.find((d) => d.delivery_id === deliveryId);
    if (!delivery) throw new Error("Delivery not found");

    delivery.status = status;
    if (reason) delivery.failure_reason = reason;

    if (status === "FOOD_COLLECTED") {
      const don = this.donations.find((d) => d.donation_id === delivery.donation_id);
      if (don) don.status = "IN_TRANSIT";
      delivery.pickup_time = new Date().toISOString();
    } else if (status === "DELIVERED_SUCCESSFULLY") {
      const don = this.donations.find((d) => d.donation_id === delivery.donation_id);
      if (don) don.status = "DELIVERED";
      delivery.delivery_time = new Date().toISOString();
    }

    this.saveToStorage();
    return delivery;
  }

  updateRequirements(targetId: string, reqData: any) {
    const req = this.requirements.find((r) => r.requirement_id === targetId) || this.requirements[0];
    if (req) {
      Object.assign(req, reqData);
      this.saveToStorage();
    }
    return req;
  }

  sweepExpired() {
    let sweptCount = 0;
    this.donations.forEach((d) => {
      if (d.status === "AVAILABLE" || d.status === "MATCHED") {
        const isExpired = new Date(d.expiry_time).getTime() <= Date.now();
        if (isExpired) {
          d.status = "EXPIRED";
          d.priority = "EXPIRED";
          sweptCount++;
          this.wasteLogs.unshift({
            waste_id: `WST-${Math.floor(1000 + Math.random() * 9000)}`,
            donation_id: d.donation_id,
            food_name: d.food_name,
            quantity: d.packets || d.quantity,
            packets: d.packets || d.quantity,
            expiry_time: d.expiry_time,
            reason: "Passed safe food redistribution window.",
            donor_name: d.donor_name,
            intended_recipient: "Local Shelters",
            timestamp: new Date().toISOString(),
          });
        }
      }
    });
    this.saveToStorage();
    return { sweptCount, message: `Swept ${sweptCount} expired items.` };
  }

  markAllNotificationsRead() {
    this.notifications.forEach((n) => {
      n.read_status = true;
      n.read = true;
    });
    this.saveToStorage();
  }

  resetDemo() {
    this.donations = [...INITIAL_DONATIONS];
    this.requirements = [...INITIAL_REQUIREMENTS];
    this.deliveries = [];
    this.wasteLogs = [...INITIAL_WASTE_LOGS];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.users = [...INITIAL_USERS];
    this.saveToStorage();
  }
}

export const localStore = new LocalStateStore();

// Universal API wrapper: tries real backend first; on GitHub Pages (or backend down), uses localStore
async function tryFetchJson<T>(url: string, init?: RequestInit): Promise<T | null> {
  // If running on GitHub Pages (github.io), do not attempt /api/ call which would 404
  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return null;
  }
  try {
    const res = await fetch(url, init);
    const contentType = res.headers.get("content-type");
    if (res.ok && contentType && contentType.includes("application/json")) {
      return (await res.json()) as T;
    }
  } catch {
    // Network or parse error -> fallback to localStore
  }
  return null;
}

export const apiClient = {
  async fetchInitialData() {
    const serverDonations = await tryFetchJson<any>("/api/donations");
    const serverStats = await tryFetchJson<any>("/api/stats");
    const serverReqs = await tryFetchJson<any>("/api/requirements");
    const serverDeliveries = await tryFetchJson<any>("/api/deliveries");
    const serverWaste = await tryFetchJson<any>("/api/waste-logs");
    const serverNotifs = await tryFetchJson<any>("/api/notifications");
    const serverUsers = await tryFetchJson<any>("/api/users");

    return {
      donations: serverDonations
        ? Array.isArray(serverDonations)
          ? serverDonations
          : serverDonations.donations || []
        : localStore.donations,
      stats: serverStats
        ? serverStats.statistics || serverStats.stats || serverStats
        : localStore.getStats(),
      requirements: serverReqs
        ? Array.isArray(serverReqs)
          ? serverReqs
          : serverReqs.requirements || []
        : localStore.requirements,
      deliveries: serverDeliveries
        ? Array.isArray(serverDeliveries)
          ? serverDeliveries
          : serverDeliveries.deliveries || []
        : localStore.deliveries,
      wasteLogs: serverWaste
        ? Array.isArray(serverWaste)
          ? serverWaste
          : serverWaste.waste_logs || serverWaste.wasteLogs || []
        : localStore.wasteLogs,
      notifications: serverNotifs
        ? Array.isArray(serverNotifs)
          ? serverNotifs
          : serverNotifs.notifications || []
        : localStore.notifications,
      users: serverUsers
        ? Array.isArray(serverUsers)
          ? serverUsers
          : serverUsers.users || []
        : localStore.users,
    };
  },

  async createDonation(donationData: any) {
    const serverRes = await tryFetchJson<any>("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...donationData,
        donor_id: "usr_donor_1",
        donor_name: "FreshBite Restaurant",
        latitude: 17.4325,
        longitude: 78.4072,
      }),
    });
    if (serverRes) {
      return serverRes.donation || serverRes;
    }
    return localStore.createDonation(donationData);
  },

  async acceptMatch(match: AiMatch, donation: Donation) {
    const ngoData = {
      ngo_id: "usr_ngo_1",
      ngo_name: "Hope Community Center",
      donation_id: donation.donation_id,
      destination: "Shaikpet, Hyderabad",
      contact_phone: "+91 98201 54321",
      delivery_person_id: "usr_delivery_1",
      delivery_person_name: "Rajesh Kumar",
    };
    const serverRes = await tryFetchJson<any>(`/api/matches/${match.match_id}/accept`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ngoData),
    });
    if (serverRes) {
      return serverRes;
    }
    return localStore.acceptMatch(match, donation, ngoData);
  },

  async updateDeliveryStatus(deliveryId: string, status: DeliveryStatus, reason?: string) {
    const serverRes = await tryFetchJson<any>(`/api/deliveries/${deliveryId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, failure_reason: reason }),
    });
    if (serverRes) {
      return serverRes;
    }
    return localStore.updateDeliveryStatus(deliveryId, status, reason);
  },

  async updateRequirements(targetId: string, reqData: any) {
    const serverRes = await tryFetchJson<any>(`/api/requirements/${targetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reqData),
    });
    if (serverRes) {
      return serverRes;
    }
    return localStore.updateRequirements(targetId, reqData);
  },

  async triggerSafetySweep() {
    const serverRes = await tryFetchJson<any>("/api/maintenance/sweep-expired", {
      method: "POST",
    });
    if (serverRes) {
      return serverRes;
    }
    return localStore.sweepExpired();
  },

  async markAllNotificationsRead() {
    const serverRes = await tryFetchJson<any>("/api/notifications/read-all", {
      method: "PUT",
    });
    if (serverRes) {
      return serverRes;
    }
    localStore.markAllNotificationsRead();
  },

  async resetDemo() {
    const serverRes = await tryFetchJson<any>("/api/demo/reset", {
      method: "POST",
    });
    if (serverRes) {
      return serverRes;
    }
    localStore.resetDemo();
  },
};

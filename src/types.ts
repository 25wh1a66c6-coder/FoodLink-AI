export type UserRole = 'donor' | 'ngo' | 'delivery' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  organization_name?: string;
  address: string;
  lat: number;
  lng: number;
  avatar?: string;
}

export type FoodType = 
  | 'Cooked Meal' 
  | 'Packaged Food' 
  | 'Bakery & Bread' 
  | 'Raw Produce / Grains' 
  | 'Dairy Products' 
  | 'Beverages';

export type FoodCategory = 
  | 'Veg Meal' 
  | 'Non-Veg Meal' 
  | 'Vegan' 
  | 'Snacks' 
  | 'Groceries' 
  | 'Bakery';

export type DonationPriority = 'HIGH' | 'MEDIUM' | 'LOW' | 'EXPIRED';

export type DonationStatus = 
  | 'AVAILABLE' 
  | 'MATCHED' 
  | 'ACCEPTED' 
  | 'ASSIGNED' 
  | 'GOING_TO_PICKUP' 
  | 'FOOD_COLLECTED' 
  | 'IN_TRANSIT' 
  | 'DELIVERED' 
  | 'EXPIRED' 
  | 'CANCELLED';

export interface Donation {
  donation_id: string;
  donor_id: string;
  donor_name: string;
  donor_phone: string;
  donor_address: string;
  donor_lat: number;
  donor_lng: number;
  food_name: string;
  food_type: FoodType;
  food_category: FoodCategory;
  quantity: number; // in packets/kg
  packets: number;
  servings: number;
  prep_time: string;
  expiry_time: string; // ISO string
  dietary_information: string[];
  allergens: string[];
  pickup_location: string;
  contact_info: string;
  additional_notes?: string;
  status: DonationStatus;
  priority: DonationPriority;
  created_at: string;
  accepted_by_ngo_id?: string;
  accepted_by_ngo_name?: string;
  assigned_delivery_id?: string;
}

export interface NgoRequirement {
  requirement_id: string;
  ngo_id: string;
  ngo_name: string;
  ngo_address: string;
  ngo_lat: number;
  ngo_lng: number;
  food_type: string;
  quantity_required: number;
  people_to_serve: number;
  dietary_requirement: string[];
  required_before: string; // e.g. "18:00" or ISO
  capacity: number;
  fulfilled_quantity: number;
  active: boolean;
}

export interface AiMatch {
  match_id: string;
  donation_id: string;
  ngo_id: string;
  ngo_name: string;
  match_score: number; // 0-100
  distance_km: number;
  estimated_travel_minutes: number;
  reasons: string[];
  compatibility_status: 'Suitable' | 'Partially suitable' | 'Not suitable';
  delivery_feasibility: 'High' | 'Medium' | 'Low';
  quantity_comparison: string; // e.g. "12/20 packets can be accepted — 8 packets still required"
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export type DeliveryStatus = 
  | 'ASSIGNED' 
  | 'GOING_TO_PICKUP' 
  | 'FOOD_COLLECTED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED_SUCCESSFULLY' 
  | 'UNABLE_TO_DELIVER';

export interface DeliveryTask {
  delivery_id: string;
  donation_id: string;
  food_name: string;
  quantity_display: string;
  donor_id: string;
  donor_name: string;
  pickup_location: string;
  pickup_lat: number;
  pickup_lng: number;
  donor_contact: string;
  ngo_id: string;
  ngo_name: string;
  destination: string;
  dest_lat: number;
  dest_lng: number;
  ngo_contact: string;
  delivery_person_id: string;
  delivery_person_name: string;
  delivery_person_phone: string;
  distance_km: number;
  estimated_time_minutes: number;
  current_lat: number;
  current_lng: number;
  route_coordinates?: { lat: number; lng: number }[];
  status: DeliveryStatus;
  pickup_time?: string;
  delivery_time?: string;
  expiry_time: string;
  failure_reason?: string;
}

export interface NotificationItem {
  notification_id: string;
  id?: string;
  user_id: string; // user id or 'ROLE_DONOR' | 'ROLE_NGO' | 'ROLE_DELIVERY' | 'ALL'
  recipientUserId?: string;
  recipientRole?: string;
  donation_id?: string;
  donationId?: string;
  title: string;
  message: string;
  food_name?: string;
  foodName?: string;
  packets?: number;
  servings?: number;
  priority?: DonationPriority;
  distance_km?: number;
  type:
    | 'DONATION'
    | 'NEW_DONATION'
    | 'DONATION_CREATED'
    | 'ACCEPTANCE'
    | 'DELIVERY'
    | 'ALERT'
    | 'EXPIRY'
    | 'AI_MATCH'
    | 'EXPIRY_WARNING'
    | 'DELIVERY_UPDATE';
  timestamp: string;
  createdAt?: string;
  read_status: boolean;
  read?: boolean;
  channel?: string;
  link_view?: string;
  meta?: Record<string, any>;
}

export interface WasteLog {
  waste_id: string;
  donation_id: string;
  food_name: string;
  quantity: number;
  packets: number;
  expiry_time: string;
  reason: string;
  donor_name: string;
  intended_recipient?: string;
  timestamp: string;
}

export interface DashboardStats {
  total_donations: number;
  active_donations: number;
  completed_donations: number;
  food_packets_donated: number;
  food_packets_delivered: number;
  people_served: number;
  active_deliveries: number;
  expired_donations: number;
  wasted_food_kg: number;
  high_priority_count: number;
  donations_over_time: { date: string; donations: number; delivered: number }[];
  category_breakdown: { name: string; value: number }[];
  impact_saved_rupees: number;
}

export type UserProfile = User;
export type AppNotification = NotificationItem;

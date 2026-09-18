import React, { useState, useEffect, useCallback } from "react";
import type {
  UserRole,
  User,
  Donation,
  DashboardStats,
  NgoRequirement,
  DeliveryTask,
  WasteLog,
  AppNotification,
  UserProfile,
  DeliveryStatus,
  AiMatch,
} from "./types";
import { Header } from "./components/Header";
import { Sidebar, NavView } from "./components/Sidebar";
import { MockSmsToast } from "./components/common/MockSmsToast";
import { DemoWalkthroughModal } from "./components/common/DemoWalkthroughModal";
import { NotificationsView } from "./components/common/NotificationsView";
import { HelpAboutView } from "./components/common/HelpAboutView";

// Donor Components
import { DonorDashboard } from "./components/donor/DonorDashboard";
import { DonateFoodModal } from "./components/donor/DonateFoodModal";
import { MyDonationsView } from "./components/donor/MyDonationsView";
import { DonationSuccessView } from "./components/donor/DonationSuccessView";
import { DonationDetailModal } from "./components/donor/DonationDetailModal";

// NGO Components
import { NgoDashboard } from "./components/ngo/NgoDashboard";
import { AvailableFoodView } from "./components/ngo/AvailableFoodView";
import { RequirementsModal } from "./components/ngo/RequirementsModal";
import { AcceptedDonationsView } from "./components/ngo/AcceptedDonationsView";

// Delivery Components
import { DeliveryDashboard } from "./components/delivery/DeliveryDashboard";
import { DeliveryTrackingView } from "./components/delivery/DeliveryTrackingView";

// Admin Components
import { AdminDashboard } from "./components/admin/AdminDashboard";
import { FoodWasteLogView } from "./components/admin/FoodWasteLogView";
import { UserManagementView } from "./components/admin/UserManagementView";
import { apiClient } from "./services/apiClient";

export function App() {
  // Navigation & Role State
  const [currentRole, setCurrentRole] = useState<UserRole>("donor");
  const [currentView, setCurrentView] = useState<NavView>("donor-dashboard");

  // Core Data State
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_donations: 0,
    active_donations: 0,
    completed_donations: 0,
    food_packets_donated: 0,
    food_packets_delivered: 0,
    people_served: 0,
    expired_donations: 0,
    wasted_food_kg: 0,
    active_deliveries: 0,
    high_priority_count: 0,
    impact_saved_rupees: 0,
    donations_over_time: [],
    category_breakdown: [],
  });
  const [requirements, setRequirements] = useState<NgoRequirement[]>([]);
  const [deliveries, setDeliveries] = useState<DeliveryTask[]>([]);
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // Modals & Active Selections
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [isRequirementsModalOpen, setIsRequirementsModalOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState<string | null>(null);
  const [activeSmsToast, setActiveSmsToast] = useState<AppNotification | null>(null);
  const [celebrationDelivery, setCelebrationDelivery] = useState<DeliveryTask | null>(null);

  // Loading States
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [acceptingDonationId, setAcceptingDonationId] = useState<string | null>(null);

  // Fetch initial data
  const fetchData = useCallback(async () => {
    try {
      const data = await apiClient.fetchInitialData();
      setDonations(data.donations || []);
      setStats(data.stats);
      setRequirements(data.requirements || []);
      setDeliveries(data.deliveries || []);
      setWasteLogs(data.wasteLogs || []);
      setNotifications(data.notifications || []);
      setUsers(data.users || []);
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Periodic refresh every 10 seconds for real-time live feel
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Handle Role Switching and reset view to appropriate dashboard
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === "donor") setCurrentView("donor-dashboard");
    else if (role === "ngo") setCurrentView("ngo-dashboard");
    else if (role === "delivery") setCurrentView("delivery-dashboard");
    else if (role === "admin") setCurrentView("admin-dashboard");
  };

  // Donor: Create Donation
  const handleCreateDonation = async (donationData: any) => {
    setIsActionLoading(true);
    try {
      const created = await apiClient.createDonation(donationData);

      // Show SMS simulation toast with defined properties
      const foodName =
        created.food_name || created.foodName || donationData.food_name || "Surplus Food";
      const packetsCount =
        created.packets || created.quantity || donationData.packets || 10;
      const priorityVal = created.priority || "HIGH";

      setActiveSmsToast({
        notification_id: `sms_${Date.now()}`,
        user_id: "usr_donor_1",
        title: "Donation Listed on FoodLink AI",
        message: `${foodName} (${packetsCount} units) registered. AI matching nearby NGOs with safety priority ${priorityVal}.`,
        type: "AI_MATCH",
        channel: "SMS",
        read_status: false,
        timestamp: new Date().toISOString(),
      });

      await fetchData();
      setCurrentView("my-donations");
    } finally {
      setIsActionLoading(false);
    }
  };

  // NGO: Accept Match (Section 10 Critical Acceptance Workflow)
  const handleAcceptMatch = async (match: AiMatch, donation: Donation) => {
    setAcceptingDonationId(donation.donation_id);
    try {
      const result = await apiClient.acceptMatch(match, donation);
      const del = result.delivery || {};

      // Show SMS alert toast to simulate Section 14 notification
      setActiveSmsToast({
        notification_id: `sms_${Date.now()}`,
        user_id: "usr_ngo_1",
        title: "Donation Accepted - Courier Dispatched",
        message: `Accepted ${donation.packets} units of ${donation.food_name}. Courier Rajesh Kumar assigned (~${del.distance_km || 4.2} km / ${del.estimated_time_minutes || 20} mins).`,
        type: "DELIVERY_UPDATE",
        channel: "SMS",
        read_status: false,
        timestamp: new Date().toISOString(),
      });

      await fetchData();
      setCurrentView("accepted-donations");
    } catch (err: any) {
      alert(err.message || "Failed to accept donation");
    } finally {
      setAcceptingDonationId(null);
    }
  };

  // Delivery: Update Status
  const handleUpdateDeliveryStatus = async (
    deliveryId: string,
    status: DeliveryStatus,
    reason?: string
  ) => {
    setIsActionLoading(true);
    try {
      const updated = await apiClient.updateDeliveryStatus(deliveryId, status, reason);

      // Check for delivery completion -> show Section 19 success celebration!
      if (status === "DELIVERED_SUCCESSFULLY") {
        setCelebrationDelivery(updated);
        setCurrentView("donation-success");
      }

      await fetchData();
    } catch (err: any) {
      alert(err.message || "Failed to update delivery");
    } finally {
      setIsActionLoading(false);
    }
  };

  // NGO: Update Requirements
  const handleUpdateRequirements = async (reqData: any) => {
    try {
      const target = requirements[0] || { requirement_id: "req_1" };
      await apiClient.updateRequirements(target.requirement_id, reqData);
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Admin: Expiry Sweep
  const handleTriggerSweep = async () => {
    try {
      const res = await apiClient.triggerSafetySweep();
      alert(`Safety audit complete: ${res.message || "Audited successfully"}`);
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Section 25: 1-Click End-to-End Simulation
  const handleTriggerDemoFlow = async () => {
    setIsActionLoading(true);
    try {
      // 1. Create FreshBite donation (12 units, 2 hours expiry)
      const newDonation = await apiClient.createDonation({
        donor_id: "usr_donor_1",
        donor_name: "FreshBite Restaurant",
        food_name: "Vegetarian Meal Pack",
        food_type: "Cooked Meal",
        food_category: "Veg Meal",
        quantity: 12,
        packets: 12,
        servings: 12,
        prep_time: "Freshly prepared 30 mins ago",
        expiry_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        dietary_information: ["Vegetarian", "Jain-friendly"],
        allergens: ["None"],
        pickup_location: "Road No. 36, Jubilee Hills, Hyderabad",
        contact_info: "+91 98765 43210",
        additional_notes: "Fresh paneer pulao and dal in sealed containers.",
        latitude: 17.4325,
        longitude: 78.4072,
      });

      // 2. Synthesize AI match
      const mockMatch: AiMatch = {
        match_id: `match_${newDonation.donation_id}`,
        donation_id: newDonation.donation_id,
        ngo_id: "usr_ngo_1",
        ngo_name: "Hope Community Center",
        match_score: 95,
        distance_km: 4.2,
        estimated_travel_minutes: 15,
        reasons: [
          "Dietary requirement (Vegetarian) matches perfectly",
          "Immediate transit corridor within 4.2 km",
        ],
        compatibility_status: "Suitable",
        delivery_feasibility: "High",
        quantity_comparison: "12/15 packets accepted",
        status: "PENDING",
      };

      // 3. NGO Accepts
      const acceptResult = await apiClient.acceptMatch(mockMatch, newDonation);

      // 4. Progress Delivery
      if (acceptResult?.delivery) {
        const completedDelivery = await apiClient.updateDeliveryStatus(
          acceptResult.delivery.delivery_id,
          "DELIVERED_SUCCESSFULLY"
        );
        setCelebrationDelivery(completedDelivery);
      }

      await fetchData();
      setCurrentRole("donor");
      setCurrentView("donation-success");
    } catch (err) {
      console.error("Demo flow error:", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  // Section 8 & Section 14: Filter notifications for current user/role
  const currentUserNotifications = notifications.filter((n) => {
    if (n.user_id === "ALL") return true;
    if (currentRole === "donor") {
      return (
        n.user_id === "usr_donor_1" ||
        n.user_id === "user_donor_1" ||
        n.recipientUserId === "usr_donor_1" ||
        n.recipientUserId === "user_donor_1" ||
        n.recipientRole === "DONOR"
      );
    }
    if (currentRole === "ngo") {
      return (
        n.user_id === "usr_ngo_1" ||
        n.user_id === "user_ngo_1" ||
        n.recipientUserId === "usr_ngo_1" ||
        n.recipientUserId === "user_ngo_1" ||
        n.recipientRole === "NGO" ||
        n.type === "DONATION" ||
        n.type === "NEW_DONATION"
      );
    }
    if (currentRole === "delivery") {
      return (
        n.user_id === "usr_delivery_1" ||
        n.user_id === "user_del_1" ||
        n.recipientUserId === "usr_delivery_1" ||
        n.recipientUserId === "user_del_1" ||
        n.recipientRole === "DELIVERY" ||
        n.type === "DELIVERY" ||
        n.type === "DELIVERY_UPDATE"
      );
    }
    return true; // admin sees all
  });

  // Helper getters
  const currentNgoRequirement = requirements[0];
  const urgentCount = donations.filter(
    (d) => d.status === "AVAILABLE" && d.priority === "HIGH"
  ).length;
  const activeDeliveryCount = deliveries.filter(
    (d) => d.status !== "DELIVERED_SUCCESSFULLY" && d.status !== "UNABLE_TO_DELIVER"
  ).length;
  const unreadNotifCount = currentUserNotifications.filter(
    (n) => !n.read_status && !n.read
  ).length;

  const handleMarkAllNotificationsRead = async () => {
    try {
      await apiClient.markAllNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read_status: true, read: true }))
      );
    } catch (e) {
      console.error("Failed to mark notifications read:", e);
    }
  };

  // Selected delivery for tracking
  const activeTrackingDelivery =
    deliveries.find((d) => d.delivery_id === selectedDeliveryId) ||
    deliveries.find((d) => d.status !== "DELIVERED_SUCCESSFULLY") ||
    deliveries[0];

  // AI matches for NGO dashboard
  const ngoMatches = donations
    .filter((d) => d.status === "AVAILABLE")
    .map((d) => ({
      match: {
        match_id: `match_${d.donation_id}`,
        donation_id: d.donation_id,
        ngo_id: "usr_ngo_1",
        ngo_name: "Hope Community Center",
        match_score: d.priority === "HIGH" ? 94 : 88,
        distance_km: 4.2,
        estimated_travel_minutes: 14,
        reasons: [
          "Dietary requirement (Vegetarian) matches perfectly",
          "Distance (4.2 km) is within immediate freshness transit window",
          `Expiry urgency is ${d.priority} priority - high allocation preference`,
          `Packets count (${d.packets}) satisfies urgent meal demand`,
        ],
        compatibility_status: "Suitable",
        delivery_feasibility: "High",
        quantity_comparison: `${d.packets}/15 packets can be accepted`,
        status: "PENDING",
      } as AiMatch,
      donation: d,
    }));

  const currentUser: User = {
    id:
      currentRole === "donor"
        ? "usr_donor_1"
        : currentRole === "ngo"
        ? "usr_ngo_1"
        : currentRole === "delivery"
        ? "usr_delivery_1"
        : "usr_admin_1",
    name:
      currentRole === "donor"
        ? "FreshBite Restaurant"
        : currentRole === "ngo"
        ? "Hope Community Center"
        : currentRole === "delivery"
        ? "Rajesh Kumar"
        : "System Administrator",
    email: `${currentRole}@foodlink.ai`,
    role: currentRole,
    phone: "+91 98765 43210",
    organization_name:
      currentRole === "donor"
        ? "FreshBite Restaurant"
        : currentRole === "ngo"
        ? "Hope Community Center"
        : undefined,
    address: "Hyderabad Urban Hub",
    lat: 17.4325,
    lng: 78.4072,
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Header */}
      <Header
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
        onOpenDemoGuide={() => setIsWalkthroughOpen(true)}
        onResetDemo={async () => {
          await apiClient.resetDemo();
          await fetchData();
        }}
        notifications={currentUserNotifications}
        onNotificationClick={() => setCurrentView("notifications")}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      />

      {/* Main App Layout */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          currentRole={currentRole}
          currentView={currentView}
          onSelectView={setCurrentView}
          unreadCount={unreadNotifCount}
          urgentFoodCount={urgentCount}
          activeDeliveryCount={activeDeliveryCount}
        />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {/* DONOR VIEWS */}
          {currentView === "donor-dashboard" && (
            <DonorDashboard
              donations={donations}
              stats={stats}
              onOpenDonateModal={() => setIsDonateModalOpen(true)}
              onViewDonations={() => setCurrentView("my-donations")}
              onSelectDonation={(d) => setSelectedDonation(d)}
            />
          )}

          {currentView === "donate-food" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <button
                  onClick={() => setCurrentView("donor-dashboard")}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Dashboard
                </button>
              </div>
              <DonateFoodModal
                isOpen={true}
                onClose={() => setCurrentView("donor-dashboard")}
                onSubmit={handleCreateDonation}
              />
            </div>
          )}

          {currentView === "my-donations" && (
            <MyDonationsView
              donations={donations}
              onSelectDonation={(d) => setSelectedDonation(d)}
              onOpenDonateModal={() => setIsDonateModalOpen(true)}
            />
          )}

          {currentView === "donation-success" && (
            <DonationSuccessView
              delivery={celebrationDelivery}
              onReturnToDashboard={() => setCurrentView("donor-dashboard")}
            />
          )}

          {/* NGO VIEWS */}
          {currentView === "ngo-dashboard" && (
            <NgoDashboard
              ngoName="Hope Community Center"
              requirement={currentNgoRequirement}
              aiMatches={ngoMatches}
              urgentDonations={donations.filter(
                (d) => d.status === "AVAILABLE" && d.priority === "HIGH"
              )}
              onAcceptMatch={handleAcceptMatch}
              onOpenRequirementsModal={() => setIsRequirementsModalOpen(true)}
              onViewAvailableFood={() => setCurrentView("available-food")}
              onViewDelivery={(delId) => {
                setSelectedDeliveryId(delId);
                setCurrentView("delivery-tracking");
              }}
              acceptingId={acceptingDonationId}
              notifications={currentUserNotifications}
            />
          )}

          {currentView === "available-food" && (
            <AvailableFoodView
              donations={donations}
              onAcceptDonation={(donation) => {
                const matchObj: AiMatch = {
                  match_id: `match_auto_${donation.donation_id}`,
                  donation_id: donation.donation_id,
                  ngo_id: "user_ngo_1",
                  ngo_name: "Hope Community Center",
                  match_score: 92,
                  distance_km: 4.2,
                  estimated_travel_minutes: 14,
                  reasons: ["Compatible dietary profile", "Under 5 km direct road distance"],
                  compatibility_status: "Suitable",
                  delivery_feasibility: "High",
                  quantity_comparison: `${donation.packets}/15 packets can be accepted`,
                  status: "PENDING",
                };
                handleAcceptMatch(matchObj, donation);
              }}
              acceptingId={acceptingDonationId}
            />
          )}

          {currentView === "ngo-requirements" && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Active NGO Requirements & Targets
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  Set daily meal packet quotas, diet guidelines, and dining facility capacity.
                </p>
                <RequirementsModal
                  isOpen={true}
                  onClose={() => setCurrentView("ngo-dashboard")}
                  currentRequirement={currentNgoRequirement}
                  onSubmit={handleUpdateRequirements}
                />
              </div>
            </div>
          )}

          {currentView === "accepted-donations" && (
            <AcceptedDonationsView
              donations={donations}
              deliveries={deliveries}
              onTrackDelivery={(delId) => {
                setSelectedDeliveryId(delId);
                setCurrentView("delivery-tracking");
              }}
            />
          )}

          {/* DELIVERY VIEWS */}
          {currentView === "delivery-dashboard" || currentView === "assigned-deliveries" ? (
            <DeliveryDashboard
              deliveries={deliveries}
              onUpdateStatus={handleUpdateDeliveryStatus}
              onOpenTracking={(delId) => {
                setSelectedDeliveryId(delId);
                setCurrentView("delivery-tracking");
              }}
              loadingId={isActionLoading ? "loading" : null}
            />
          ) : null}

          {currentView === "delivery-tracking" && (
            <DeliveryTrackingView
              delivery={activeTrackingDelivery}
              onUpdateStatus={handleUpdateDeliveryStatus}
              onBack={() => setCurrentView("delivery-dashboard")}
              loading={isActionLoading}
            />
          )}

          {currentView === "delivery-history" && (
            <div className="space-y-6">
              <h2 className="text-xl font-extrabold text-slate-900">Delivery History & Completed Runs</h2>
              <DeliveryDashboard
                deliveries={deliveries.filter((d) => d.status === "DELIVERED_SUCCESSFULLY")}
                onUpdateStatus={handleUpdateDeliveryStatus}
                onOpenTracking={(delId) => {
                  setSelectedDeliveryId(delId);
                  setCurrentView("delivery-tracking");
                }}
              />
            </div>
          )}

          {/* ADMIN VIEWS */}
          {currentView === "admin-dashboard" && (
            <AdminDashboard
              stats={stats}
              donations={donations}
              deliveries={deliveries}
              wasteLogs={wasteLogs}
              onViewWasteLog={() => setCurrentView("food-waste-log")}
              onViewDonations={() => setCurrentView("donation-monitoring")}
              onViewDeliveries={() => setCurrentView("delivery-monitoring")}
              onViewUsers={() => setCurrentView("user-management")}
            />
          )}

          {currentView === "donation-monitoring" && (
            <MyDonationsView
              donations={donations}
              onSelectDonation={(d) => setSelectedDonation(d)}
              onOpenDonateModal={() => setIsDonateModalOpen(true)}
            />
          )}

          {currentView === "delivery-monitoring" && (
            <DeliveryDashboard
              deliveries={deliveries}
              onUpdateStatus={handleUpdateDeliveryStatus}
              onOpenTracking={(delId) => {
                setSelectedDeliveryId(delId);
                setCurrentView("delivery-tracking");
              }}
            />
          )}

          {currentView === "food-waste-log" && (
            <FoodWasteLogView wasteLogs={wasteLogs} onTriggerSweep={handleTriggerSweep} />
          )}

          {currentView === "user-management" && <UserManagementView users={users} />}

          {/* SYSTEM VIEWS */}
          {currentView === "notifications" && (
            <NotificationsView
              notifications={currentUserNotifications}
              onMarkAllAsRead={handleMarkAllNotificationsRead}
              onClearNotifications={() => setNotifications([])}
            />
          )}

          {currentView === "help-about" && <HelpAboutView />}
        </main>
      </div>

      {/* Floating SMS Simulator Toast */}
      {activeSmsToast && (
        <MockSmsToast
          notification={activeSmsToast}
          onDismiss={() => setActiveSmsToast(null)}
        />
      )}

      {/* Modals */}
      <DonateFoodModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        onSubmit={handleCreateDonation}
      />

      <RequirementsModal
        isOpen={isRequirementsModalOpen}
        onClose={() => setIsRequirementsModalOpen(false)}
        currentRequirement={currentNgoRequirement}
        onSubmit={handleUpdateRequirements}
      />

      <DemoWalkthroughModal
        isOpen={isWalkthroughOpen}
        onClose={() => setIsWalkthroughOpen(false)}
        onSwitchRole={handleRoleChange}
        onTriggerDemoFlow={handleTriggerDemoFlow}
        isExecuting={isActionLoading}
      />

      <DonationDetailModal
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
        delivery={deliveries.find((d) => d.donation_id === selectedDonation?.donation_id)}
        onTrackRoute={(delId) => {
          setSelectedDeliveryId(delId);
          setCurrentView("delivery-tracking");
        }}
      />
    </div>
  );
}
export default App;

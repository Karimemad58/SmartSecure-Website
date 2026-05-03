import { Routes, Route } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

// MAIN
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";

// AUTH
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// LOCATIONS
import LocationList from "./pages/location/LocationList";
import LocationDetails from "./pages/location/LocationDetails";

// RESERVATIONS
import ReservationPage from "./pages/reservation/ReservationPage";
import MyReservations from "./pages/reservation/MyReservations";

// LOCKERS
import LockerList from "./pages/locker/LockerList";
import LockerDetails from "./pages/locker/LockerDetails";

// SUBSCRIPTIONS
import SubscriptionPage from "./pages/subscription/SubscriptionPage";
import MySubscriptions from "./pages/subscription/MySubscription";
import PlansPage from "./pages/subscription_plan/PlansPage";

// EXTRA
import NotificationPage from "./pages/notification/NotificationsPage";
import ReportsPage from "./pages/report/ReportsPage";

// PAYMENT
import PaymentPage from "./pages/payment/PaymentPage";

// ACCOUNT
import Profile from "./pages/account/Profile";

// ADMIN
import AdminOverview from "./pages/admin/AdminOverview";
import LocationsAdmin from "./pages/admin/LocationsAdmin";
import UsersAdmin from "./pages/admin/UsersAdmin";
import ReservationsAdmin from "./pages/admin/ReservationsAdmin";
import PaymentsAdmin from "./pages/admin/PaymentsAdmin";
import LockersAdmin from "./pages/admin/LockersAdmin";
import SubscriptionsAdmin from "./pages/admin/SubscriptionsAdmin";
import SmartDevicesAdmin from "./pages/admin/SmartDevicesAdmin";
import PlansAdmin from "./pages/admin/PlansAdmin";
import NotificationsAdmin from "./pages/admin/NotificationsAdmin";
import ReportsAdmin from "./pages/admin/ReportsAdmin";

function App() {
  return (
    <Routes>
      {/* USER */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/how-it-works" element={<HowItWorks />} />

        {/* LOCATIONS */}
        <Route path="/locations" element={<LocationList />} />
        <Route path="/locations/:id" element={<LocationDetails />} />

        {/* RESERVATIONS */}
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/reservations/:id" element={<ReservationPage />} />
        <Route path="/book/:id" element={<ReservationPage />} />
        <Route path="/reservations/my" element={<MyReservations />} />

        {/* LOCKERS */}
        <Route path="/lockers" element={<LockerList />} />
        <Route path="/lockers/:id" element={<LockerDetails />} />

        {/* SUBSCRIPTIONS */}
        <Route path="/subscriptions/:id" element={<SubscriptionPage />} />
        <Route path="/subscriptions/my" element={<MySubscriptions />} />
        <Route path="/subscriptions/plans" element={<PlansPage />} />

        {/* EXTRA */}
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/reports" element={<ReportsPage />} />

        {/* PAYMENT */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ACCOUNT */}
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ADMIN */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin" element={<AdminOverview />} />

        <Route path="/admin/locations" element={<LocationsAdmin />} />
        <Route path="/admin/users" element={<UsersAdmin />} />
        <Route path="/admin/reservations" element={<ReservationsAdmin />} />
        <Route path="/admin/payments" element={<PaymentsAdmin />} />

        <Route path="/admin/lockers" element={<LockersAdmin />} />
        <Route path="/admin/subscriptions" element={<SubscriptionsAdmin />} />
        <Route path="/admin/smart-devices" element={<SmartDevicesAdmin />} />

        <Route path="/admin/plans" element={<PlansAdmin />} />
        <Route path="/admin/notifications" element={<NotificationsAdmin />} />
        <Route path="/admin/reports" element={<ReportsAdmin />} />
      </Route>
    </Routes>
  );
}

export default App;

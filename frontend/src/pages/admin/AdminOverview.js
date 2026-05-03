import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

function AdminOverview() {
  const [storageCount, setStorageCount] = useState(0);
  const [occupiedUnits, setOccupiedUnits] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [openBookings, setOpenBookings] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);

  // Load dashboard data
  useEffect(() => {
    loadStorages();
    loadBookings();
    loadPayments();
  }, []);

  // ----------------------------
  // Load Storages
  // ----------------------------
  const loadStorages = async () => {
    try {
      const res = await api.get("/storage");
      if (res.data.Status === "OK") {
        setStorageCount(res.data.Data.length);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------
  // Load Bookings
  // ----------------------------
  const loadBookings = async () => {
    try {
      const res = await api.get("/booking");
      if (res.data.Status === "OK") {
        const bookings = res.data.Data;

        setOccupiedUnits(bookings.length);
        setOpenBookings(bookings.filter((b) => b.status !== "c").length);
        setRecentBookings(bookings.slice(-5).reverse());
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ----------------------------
  // Load Payments
  // ----------------------------
  const loadPayments = async () => {
    try {
      const res = await api.get("/payment");
      if (res.data.Status === "OK") {
        const currentMonth = new Date().getMonth() + 1;

        const total = res.data.Data.filter(
          (p) => new Date(p.date).getMonth() + 1 === currentMonth,
        ).reduce((sum, p) => sum + Number(p.amount), 0);

        setMonthlyRevenue(total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Overview of storage units, bookings, payments and staff.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
            Back to Home
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-4 gap-4">
        <DashboardCard label="Total Storage Units" value={storageCount} />
        <DashboardCard
          label="Occupied Units"
          value={`${occupiedUnits} (${(
            (occupiedUnits / storageCount) * 100 || 0
          ).toFixed(1)}%)`}
        />
        <DashboardCard
          label="Monthly Revenue"
          value={`${monthlyRevenue} EGP`}
        />
        <DashboardCard label="Open Bookings" value={openBookings} />
      </div>

      {/* RECENT BOOKINGS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Recent Bookings
          </h2>

          <ul className="divide-y text-sm">
            {recentBookings.map((b) => (
              <li key={b.booking_id} className="py-2 flex justify-between">
                <span>
                  Booking #{b.booking_id} • {b.start_time}
                </span>
                <span
                  className={
                    b.status === "c"
                      ? "text-emerald-600 font-medium"
                      : "text-amber-600 font-medium"
                  }>
                  {b.status === "c" ? "Completed" : "Active"}
                </span>
              </li>
            ))}

            {recentBookings.length === 0 && (
              <li className="py-3 text-slate-500 text-center">
                No recent bookings
              </li>
            )}
          </ul>
        </div>

        {/* SENSOR PLACEHOLDER */}
        <div className="bg-white rounded-2xl border shadow-sm p-4">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Sensor Alerts
          </h2>
          <p className="text-sm text-slate-500">No sensor alerts available.</p>
        </div>
      </div>
    </div>
  );
}

// Reusable card component
function DashboardCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4">
      <p className="text-xs font-medium text-slate-500 uppercase">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}

export default AdminOverview;

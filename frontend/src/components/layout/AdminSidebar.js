import { Link, NavLink } from "react-router-dom";

const base =
  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium";
const inactive = "text-slate-500 hover:bg-slate-100";
const active = "bg-indigo-50 text-indigo-700";

const navItems = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/locations", label: "Locations" },
  { to: "/admin/lockers", label: "Lockers" },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/subscriptions", label: "Subscriptions" },
  { to: "/admin/subscription-plans", label: "Subscription Plans" },
  { to: "/admin/payments", label: "Payments" },
  { to: "/admin/smart-devices", label: "Smart Devices" },
  { to: "/admin/notifications", label: "Notifications" },
  { to: "/admin/reports", label: "Reports" },
];

function AdminSidebar() {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white h-full">
      <div className="p-4 border-b border-slate-200">
        <p className="text-xs font-semibold text-slate-500 uppercase">
          Admin Panel
        </p>
        <p className="text-sm text-slate-400">Manage your storage business</p>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin"}
            className={({ isActive }) =>
              `${base} ${isActive ? active : inactive}`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-200 mt-auto">
        <Link
          to="/"
          className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
        >
          Back to Home
        </Link>
      </div>
    </aside>
  );
}

export default AdminSidebar;
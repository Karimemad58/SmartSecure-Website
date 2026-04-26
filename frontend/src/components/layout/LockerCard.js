import { Link } from "react-router-dom";

function LockerCard({ locker }) {
  const statusColors = {
    available: "text-green-600",
    occupied: "text-red-500",
    maintenance: "text-yellow-500",
  };

  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-800">
          {locker.locker_code}
        </h3>
        <span className={`text-sm font-medium capitalize ${statusColors[locker.status] || "text-slate-500"}`}>
          {locker.status}
        </span>
      </div>

      <div className="text-sm text-slate-500 space-y-1">
        <p>Location ID: {locker.location_id}</p>
        <p>Device ID: {locker.smart_device_id}</p>
        <p>Installed: {new Date(locker.installation_date).toLocaleDateString()}</p>
        <p>Last Maintenance: {new Date(locker.last_maintenance).toLocaleDateString()}</p>
      </div>

      <Link
        to={`/lockers/${locker.locker_id}`}
        className="mt-4 inline-block text-sm text-indigo-600 hover:text-indigo-800 font-medium"
      >
        View Details →
      </Link>
    </div>
  );
}

export default LockerCard;
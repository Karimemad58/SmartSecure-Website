import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function LockerDetails() {
  const { id } = useParams();
  const [locker, setLocker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/Modules/locker?locker_id=${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setLocker(data && data[0]);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load locker details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (!locker) return <p className="mt-10 text-center">Locker not found.</p>;

  return (
    <div className="py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">
          Locker #{locker.locker_code}
        </h1>

        <div className="mt-4">
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              locker.status === "available"
                ? "bg-green-100 text-green-700"
                : locker.status === "occupied"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {locker.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-slate-600 text-sm">
          <p>
            Location ID:{" "}
            <span className="font-semibold">{locker.location_id}</span>
          </p>
          <p>
            Smart Device ID:{" "}
            <span className="font-semibold">{locker.smart_device_id}</span>
          </p>
          <p>
            Installation Date:{" "}
            <span className="font-semibold">
              {locker.installation_date
                ? new Date(locker.installation_date).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
          <p>
            Last Maintenance:{" "}
            <span className="font-semibold">
              {locker.last_maintenance
                ? new Date(locker.last_maintenance).toLocaleDateString()
                : "N/A"}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">
          Book this locker
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Choose your dates and confirm the booking.
        </p>

        <Link
          to={`/book/${locker.locker_id}`}
          className="block mt-5 bg-indigo-600 text-white text-center text-sm font-semibold rounded-xl py-2.5 hover:bg-indigo-700"
        >
          Continue to booking
        </Link>
      </div>
    </div>
  );
}

export default LockerDetails;
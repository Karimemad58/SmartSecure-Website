import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

function LocationDetails() {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/location?location_id=${id}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setLocation(data && data[0]);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load location details");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (!location) return <p className="mt-10 text-center">Location not found.</p>;

  return (
    <div className="py-10 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-900">{location.name}</h1>
        <p className="mt-2 text-slate-500">{location.city}</p>
        <p className="mt-1 text-slate-500">{location.address}</p>

        <div className="mt-6 flex gap-6">
          <p className="text-slate-600">
            Category:{" "}
            <span className="font-semibold capitalize">{location.category}</span>
          </p>
          <p className="text-slate-600">
            Lockers:{" "}
            <span className="font-semibold">{location.num_lockers}</span>
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
          to={`/book/${location.location_id}`}
          className="block mt-5 bg-indigo-600 text-white text-center text-sm font-semibold rounded-xl py-2.5 hover:bg-indigo-700"
        >
          Continue to booking
        </Link>
      </div>
    </div>
  );
}

export default LocationDetails;
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";

function LocationList() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityInput, setCityInput] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const cityParam = searchParams.get("city");

  useEffect(() => {
    setLoading(true);

    const url = cityParam
      ? `/location/search?keyword=city&keyvalue=${cityParam}`
      : `/location`;

    api
      .get(url)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setLocations(data || []);
      })
      .catch((err) => {
        console.error("Error loading locations:", err);
        alert("Failed to load locations");
      })
      .finally(() => setLoading(false));
  }, [cityParam]);

  const handleFilter = () => {
    if (!cityInput.trim()) {
      setSearchParams({});
    } else {
      setSearchParams({ city: cityInput });
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Available Locker Locations
      </h1>

      {/* CITY FILTER */}
      <div className="flex gap-3 mb-8">
        <select
          placeholder="Filter by city"
          className="flex-1 border rounded-lg p-3 text-slate-600"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}>
          <option value="">All Locations</option>
          <option value="cairo">Cairo</option>
          <option value="giza">Giza</option>
          <option value="alexandria">Alexandria</option>
        </select>

        <button
          onClick={handleFilter}
          className="bg-indigo-600 text-white px-6 rounded-lg font-semibold hover:bg-indigo-700">
          Filter
        </button>
      </div>

      {/* LOCATION LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((l) => (
          <div
            key={l.location_id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">{l.name}</h2>
              <p className="text-sm text-slate-500 mt-1">
                {l.city} • {l.address}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Category: <span className="capitalize">{l.category}</span> •
                Lockers: {l.num_lockers}
              </p>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/locations/${l.location_id}`}
                className="text-indigo-600 text-sm font-semibold hover:underline">
                View details
              </Link>

              <Link
                to={`/book/${l.location_id}`}
                className="text-sm font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-700">
                Book
              </Link>
            </div>
          </div>
        ))}

        {locations.length === 0 && (
          <p className="text-slate-500 col-span-full">No locations found.</p>
        )}
      </div>
    </div>
  );
}

export default LocationList;

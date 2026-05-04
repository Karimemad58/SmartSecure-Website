import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";

function LockerList() {
  const [lockers, setLockers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusInput, setStatusInput] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get("status");

  useEffect(() => {
    setLoading(true);

    const path = statusParam
      ? `/locker/search?keyword=status&keyvalue=${statusParam}`
      : `/locker`;

    api
      .get(path)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setLockers(data || []);
      })
      .catch((err) => {
        console.error("Error loading lockers:", err);
        alert("Failed to load lockers");
      })
      .finally(() => setLoading(false));
  }, [statusParam]);

  const handleFilter = () => {
    if (!statusInput.trim()) {
      setSearchParams({});
    } else {
      setSearchParams({ status: statusInput });
    }
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="py-10">
      <h1 className="text-2xl font-semibold text-slate-900 mb-4">
        Available Lockers
      </h1>

      {/* STATUS FILTER */}
      <div className="flex gap-3 mb-8">
        <select
          className="flex-1 border rounded-lg p-3 text-slate-600"
          value={statusInput}
          onChange={(e) => setStatusInput(e.target.value)}>
          <option value="">All statuses</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <button
          onClick={handleFilter}
          className="bg-indigo-600 text-white px-6 rounded-lg font-semibold hover:bg-indigo-700">
          Filter
        </button>
      </div>

      {/* LOCKER LIST */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lockers.map((l) => (
          <div
            key={l.locker_id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold">Locker #{l.locker_code}</h2>
              <p className="text-sm text-slate-500 mt-1">
                Location ID: {l.location_id}
              </p>
              <div className="mt-2">
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                    l.status === "available"
                      ? "bg-green-100 text-green-700"
                      : l.status === "occupied"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}>
                  {l.status}
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Link
                to={`/lockers/${l.locker_id}`}
                className="text-indigo-600 text-sm font-semibold hover:underline">
                View details
              </Link>

              {l.status === "available" && (
                <Link
                  to={`/book/${l.locker_id}`}
                  className="text-sm font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-xl hover:bg-indigo-700">
                  Book
                </Link>
              )}
            </div>
          </div>
        ))}

        {lockers.length === 0 && (
          <p className="text-slate-500 col-span-full">No lockers found.</p>
        )}
      </div>
    </div>
  );
}

export default LockerList;

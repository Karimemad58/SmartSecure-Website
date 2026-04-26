import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.append("city", city);
    if (status) params.append("status", status);
    navigate(`/lockers?${params.toString()}`);
  };

  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700">
            Smart lockers • Secure • IoT-enabled
          </span>

          <h1 className="mt-4 text-4xl font-extrabold text-slate-900">
            Reserve a smart locker
            <span className="text-indigo-600"> in seconds</span>
          </h1>

          <p className="mt-4 text-slate-500 text-lg">
            Find IoT-powered secure lockers near you across Egypt — reserve
            online and access instantly with your smart device.
          </p>

          <div className="mt-6 flex gap-3">
            <Link
              to="/lockers"
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700"
            >
              Browse lockers
            </Link>

            <Link
              to="/plans"
              className="px-6 py-3 border rounded-xl text-slate-700 hover:border-slate-300"
            >
              View plans
            </Link>
          </div>
        </div>

        {/* FILTER CARD */}
        <div className="bg-white rounded-3xl shadow-xl border p-6 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Quick locker finder
          </h2>

          {/* CITY */}
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">
              City
            </label>
            <input
              type="text"
              placeholder="Cairo, Giza, Alexandria..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">
              Locker Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl border text-sm"
            >
              <option value="">Any</option>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          {/* SEARCH BUTTON */}
          <button
            onClick={handleSearch}
            className="w-full mt-2 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            Search available lockers
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "IoT-powered lockers",
            desc: "Every locker is connected to our smart monitoring system for real-time status updates.",
          },
          {
            title: "Fully secure",
            desc: "Smart sensors and 24/7 monitoring ensure your belongings are protected at all times.",
          },
          {
            title: "Flexible subscriptions",
            desc: "Choose a plan that fits your needs — upgrade, downgrade, or cancel anytime.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="bg-white rounded-2xl border shadow-sm p-5"
          >
            <h3 className="font-semibold text-slate-800">{f.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Home;
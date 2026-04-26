
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/Modules/subscription_plan")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        // Only show active plans
        setPlans((data || []).filter((p) => p.is_active === 1));
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load plans");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChoosePlan = (plan_id) => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first");
      navigate("/login");
      return;
    }
    navigate(`/subscription/${plan_id}`);
  };

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="bg-slate-50 py-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-slate-900">
          Simple, transparent pricing
        </h1>
        <p className="mt-3 text-center text-slate-600">
          Choose the plan that matches your locker needs.
        </p>

        {plans.length === 0 ? (
          <p className="text-center text-slate-500 mt-12">
            No plans available at the moment.
          </p>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => {
              const isPopular = index === 1;

              return (
                <div
                  key={plan.plan_id}
                  className={`rounded-2xl border shadow-sm bg-white p-6 flex flex-col ${
                    isPopular
                      ? "border-indigo-500 ring-1 ring-indigo-100"
                      : "border-slate-200"
                  }`}
                >
                  {isPopular && (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700 bg-indigo-50 rounded-full self-start">
                      Most popular
                    </span>
                  )}

                  <h2 className="mt-3 text-xl font-semibold text-slate-900">
                    {plan.name}
                  </h2>

                  <p className="mt-2 text-2xl font-bold text-indigo-600">
                    {plan.price} EGP
                    <span className="text-sm font-normal text-slate-500">
                      {" "}/ {plan.duration_days} days
                    </span>
                  </p>

                  {plan.discount_rate > 0 && (
                    <p className="mt-1 text-sm text-green-600 font-semibold">
                      {plan.discount_rate}% discount
                    </p>
                  )}

                  <p className="mt-2 text-sm text-slate-500">
                    {plan.description}
                  </p>

                  <div className="mt-4 text-sm text-slate-600">
                    Locker access:{" "}
                    <span className="font-semibold">{plan.locker_access}</span>
                  </div>

                  <div className="flex-1" />

                  <button
                    onClick={() => handleChoosePlan(plan.plan_id)}
                    className="mt-6 w-full text-center bg-indigo-600 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-indigo-700"
                  >
                    Choose plan
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PlansPage;
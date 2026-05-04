import { useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getOneMonthLaterString = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
};

function SubscriptionPage() {
  const navigate = useNavigate();
  const { id: planId } = useParams();

  const today = getTodayString();
  const [startDate] = useState(today); // locked to today
  const [endDate, setEndDate] = useState(getOneMonthLaterString());
  const [autoRenew, setAutoRenew] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleSubmit = async () => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert("End date must be after today");
      return;
    }

    const oneMonthLater = new Date(startDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
    if (end < oneMonthLater) {
      alert("Subscription must be at least 1 month");
      return;
    }

    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      alert("Please login first");
      return;
    }

    const user = JSON.parse(storedUser);

    try {
      const res = await api.post("/subscription", {
        user_id: user.user_id,
        plan_id: planId,
        status: "active",
        start_date: startDate,
        end_date: endDate,
        auto_renew: autoRenew ? 1 : 0,
        last_payment_id: null,
      });

      if (res.data.Status === "OK") {
        alert("Subscription created successfully!");
        setSubscriptionSuccess(true);
      } else {
        alert(res.data.Message || "Subscription failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating subscription");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-xl mt-6">
      <h1 className="text-3xl font-bold mb-6">Subscribe to Plan #{planId}</h1>

      <label className="block mb-2 font-medium">Start Date</label>
      <input
        type="date"
        className="w-full border rounded p-3 mb-4 bg-gray-100 cursor-not-allowed"
        value={startDate}
        disabled
      />

      <label className="block mb-2 font-medium">End Date</label>
      <input
        type="date"
        className="w-full border rounded p-3 mb-4"
        value={endDate}
        min={getOneMonthLaterString()} // can't pick less than 1 month
        onChange={(e) => setEndDate(e.target.value)}
      />

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="autoRenew"
          checked={autoRenew}
          onChange={(e) => setAutoRenew(e.target.checked)}
          className="w-4 h-4"
        />
        <label htmlFor="autoRenew" className="text-sm font-medium">
          Auto Renew
        </label>
      </div>

      {!subscriptionSuccess && (
        <button
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          onClick={handleSubmit}>
          Confirm Subscription
        </button>
      )}

      {subscriptionSuccess && (
        <button
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold mt-4"
          onClick={() => navigate("/subscriptions/my")}>
          View My Subscriptions
        </button>
      )}
    </div>
  );
}

export default SubscriptionPage;

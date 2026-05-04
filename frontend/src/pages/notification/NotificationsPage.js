import { useEffect, useState } from "react";
import api from "../../api/axios";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = sessionStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) return;

    api
      .get(
        `/notification/search?keyword=user_id&keyvalue=${user.user_id}&sort=DESC`
      )
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data.Data;
        setNotifications(data || []);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to load notifications");
      })
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = (notification_id) => {
    api
      .put(
        `/notification?notification_id=${notification_id}`,
        { is_read: 1 }
      )
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.notification_id === notification_id ? { ...n, is_read: 1 } : n
          )
        );
      })
      .catch((err) => console.error("Failed to mark as read", err));
  };

  const markAllAsRead = () => {
    const unread = notifications.filter((n) => n.is_read === 0);
    Promise.all(
      unread.map((n) =>
        api.put(
          `/notification?notification_id=${n.notification_id}`,
          { is_read: 1 }
        )
      )
    ).then(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    });
  };

  const typeStyles = {
    booking:     "bg-indigo-100 text-indigo-700",
    payment:     "bg-green-100 text-green-700",
    maintenance: "bg-yellow-100 text-yellow-700",
    alert:       "bg-red-100 text-red-700",
  };

  if (!user)
    return (
      <p className="mt-10 text-center text-slate-500">
        Please log in to view notifications.
      </p>
    );

  if (loading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="py-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Notifications
        </h1>

        {notifications.some((n) => n.is_read === 0) && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-indigo-600 font-semibold hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="text-slate-500 text-center mt-10">
          No notifications yet.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              className={`bg-white border rounded-2xl p-5 shadow-sm flex justify-between items-start gap-4 ${
                n.is_read === 0 ? "border-indigo-300" : "border-slate-200"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${
                      typeStyles[n.type] || "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {n.type}
                  </span>
                  {n.is_read === 0 && (
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                  )}
                </div>

                <p className="text-slate-700 text-sm">{n.message}</p>

                <p className="text-xs text-slate-400 mt-2">
                  {n.sent_at
                    ? new Date(n.sent_at).toLocaleString()
                    : "No date"}
                </p>
              </div>

              {n.is_read === 0 && (
                <button
                  onClick={() => markAsRead(n.notification_id)}
                  className="text-xs text-indigo-600 font-semibold hover:underline whitespace-nowrap"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPage;
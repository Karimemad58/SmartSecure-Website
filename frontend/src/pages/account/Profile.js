import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser || storedUser === "undefined" || storedUser === "null") {
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
    } catch (error) {
      console.error("Invalid user data in sessionStorage:", error);
      sessionStorage.removeItem("user");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) {
    return <p className="text-sm text-slate-500">Please login first.</p>;
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-semibold text-slate-900">My Account</h1>
      <p className="text-sm text-slate-500">
        Manage your SmartSecure Lockers account information.
      </p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">
            Full Name
          </label>
          <input
            type="text"
            defaultValue={user.full_name}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">
            Email
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">
            Phone
          </label>
          <input
            type="text"
            defaultValue={user.phone}
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">
            Role
          </label>
          <input
            type="text"
            defaultValue={user.role}
            disabled
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase">
            Status
          </label>
          <input
            type="text"
            defaultValue={user.status}
            disabled
            className="mt-1 w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
          />
        </div>

        <button className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700">
          Save Changes
        </button>
        <button
          onClick={() => {
            handleLogout();
            window.location.reload();
          }}
          className="mt-2 ml-2 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

export default Profile;
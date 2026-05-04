import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const res = await api.get(
        `/user/login?email=${email}&password=${password}`,
      );

      if (res.data.Status === "OK") {
        const rawUser = res.data.User || res.data.user || res.data.Data?.[0];
        const loggedInUser = rawUser
          ? {
              ...rawUser,
              user_id: rawUser.user_id ?? rawUser.id ?? rawUser.userId ?? null,
            }
          : null;

        if (!loggedInUser?.user_id) {
          alert("Login succeeded but user data is missing. Please try again.");
          return;
        }

        sessionStorage.setItem("user", JSON.stringify(loggedInUser));
        if (loggedInUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      } else {
        alert("Login failed. " + res.data.Message);
      }
    } catch (error) {
      alert("Error connecting to server.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <label>Email:</label>
      <input
        type="email"
        className="w-full p-3 border rounded mb-4"
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password:</label>
      <input
        type="password"
        className="w-full p-3 border rounded mb-4"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={async () => {
          await handleLogin();
          window.location.reload();
        }}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
        Log in
      </button>
    </div>
  );
}

export default Login;

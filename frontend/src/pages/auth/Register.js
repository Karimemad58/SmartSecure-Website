import { useState } from "react";
import { registerUser } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await registerUser({ full_name: fullName, phone, email, password });
      console.log("Register response:", res.data);

      if (res.data.Status === "OK") {
        alert("Account created successfully!");
        navigate("/login");
      } else {
        alert("Signup failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Signup failed.");
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow border border-slate-200">
        <h2 className="text-2xl font-semibold text-slate-900">Create account</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-600">Full name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
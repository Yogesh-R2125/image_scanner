import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password
      });

      login(res.data);

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">

      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          placeholder="Username"
          onChange={e => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            className="flex-1 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="flex-1 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </div>

      </div>

    </div>
  );
}

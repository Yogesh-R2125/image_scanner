import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!username || !password) {
      alert("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        password
      });

      alert("Registration successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Student Registration
        </h2>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleRegister}
          className="w-full py-3 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 py-3 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Back to Login
        </button>

      </div>

    </div>
  );
}

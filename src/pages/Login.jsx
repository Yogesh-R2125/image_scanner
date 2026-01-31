import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../App.css";

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

      login(res.data); // ✅ CRITICAL LINE

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      alert("Invalid login");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>

      <input
        placeholder="Username"
        onChange={e => setUsername(e.target.value)}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={e => setPassword(e.target.value)}
      />

    <div className="login-btn">
        <button onClick={handleLogin}>
          Login
        </button>
    
        <button
          onClick={() => navigate("/register")}
        >
        Student Register
        </button>
      </div>
    </div>
  );
}

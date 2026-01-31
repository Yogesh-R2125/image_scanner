import "./DashboardLayout.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout({ title, menu, children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("LOGGED USER:", user);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dash-layout">
      {/* SIDEBAR */}
      <div className="dash-sidebar">

        {/* USER INFO (TOP LEFT) */}
        <div className="sidebar-user">
          <h2>Student Image Upload</h2>
        </div>

        {/* MENU */}
        {menu.map((item, i) => (
          <button
            key={i}
            className="menu-btn"
            onClick={item.onClick}
          >
            {item.label}
          </button>
        ))}

        {/* LOGOUT */}
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="dash-main">
        <div className="dash-header">{title}</div>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}

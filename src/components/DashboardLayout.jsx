import "./DashboardLayout.css";
import { useNavigate } from "react-router-dom";

export default function DashboardLayout({ title, menu, children }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dash-layout">
      <div className="dash-sidebar">
        <h2 className="logo">Student Image Upload</h2>

        {menu.map((item, i) => (
          <button key={i} className="menu-btn" onClick={item.onClick}>
            {item.label}
          </button>
        ))}

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="dash-main">
        <div className="dash-header">{title}</div>
        <div className="dash-content">{children}</div>
      </div>
    </div>
  );
}

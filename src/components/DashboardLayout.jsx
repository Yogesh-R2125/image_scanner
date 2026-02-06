import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function DashboardLayout({ title, menu, children }) {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex h-screen">

      {/* SIDEBAR */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">

        {/* APP TITLE */}
        <div className="p-5 text-xl font-bold border-b border-slate-700">
          Student Image Upload
        </div>

        {/* MENU */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menu.map((item, i) => (
            <button
              key={i}
              onClick={item.onClick}
              className="w-full text-left px-4 py-3 rounded bg-slate-800 hover:bg-blue-600 transition"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={logout}
            className="w-full py-3 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* HEADER */}
        <div className="h-16 flex items-center px-6 bg-white shadow font-semibold">
          {title}
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </div>

      </div>

    </div>
  );
}

import React from "react";
import { useApp } from "../../context/AppContext";
import { ROLES } from "../../data/mockData";

const NAV_ITEMS = [
  { id: "dashboard", icon: "⬡", label: "Dashboard" },
  { id: "transactions", icon: "↔", label: "Transactions" },
  { id: "insights", icon: "◈", label: "Insights" },
];

export default function Sidebar({ isOpen, onClose }) {
  const { activeTab, setActiveTab, role, setRole } = useApp();

  const handleNav = (id) => {
    setActiveTab(id);
    onClose?.();
  };

  return (
    <aside className={`sidebar${isOpen ? " open" : ""}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">💰</div>
        <span className="sidebar-logo-text">Fin<span>Track</span></span>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Menu</span>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item${activeTab === item.id ? " active" : ""}`}
            onClick={() => handleNav(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 8, paddingLeft: 4 }}>
          ROLE
        </p>
        <select
          className="role-switcher"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value={ROLES.VIEWER}>👁 Viewer</option>
          <option value={ROLES.ADMIN}>⚡ Admin</option>
        </select>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 8, paddingLeft: 4, lineHeight: 1.5 }}>
          {role === ROLES.ADMIN ? "Full access: add, edit, delete" : "Read-only access"}
        </p>
      </div>
    </aside>
  );
}

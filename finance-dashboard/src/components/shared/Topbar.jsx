import React from "react";
import { useApp } from "../../context/AppContext";
import { ROLES } from "../../data/mockData";

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", subtitle: "Your financial overview at a glance" },
  transactions: { title: "Transactions", subtitle: "Track every rupee in and out" },
  insights: { title: "Insights", subtitle: "Understand your spending patterns" },
};

export default function Topbar({ onMenuClick }) {
  const { activeTab, darkMode, toggleDarkMode, role } = useApp();
  const { title, subtitle } = PAGE_TITLES[activeTab] || PAGE_TITLES.dashboard;

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button className="hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
        <div>
          <div className="topbar-title">{title}</div>
          <div className="topbar-subtitle">{subtitle}</div>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" onClick={toggleDarkMode} title="Toggle dark mode" aria-label="Toggle dark mode">
          {darkMode ? "☀️" : "🌙"}
        </button>
        <span className={`role-badge ${role}`}>
          {role === ROLES.ADMIN ? "⚡ Admin" : "👁 Viewer"}
        </span>
      </div>
    </header>
  );
}

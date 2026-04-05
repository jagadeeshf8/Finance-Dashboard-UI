import React from "react";
import { useApp } from "../../context/AppContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { CATEGORIES } from "../../data/mockData";

export default function RecentTransactions() {
  const { transactions, setActiveTab } = useApp();
  const recent = [...transactions]
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .slice(0, 5);

  return (
    <div className="chart-card" style={{ marginTop: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <div className="chart-title">Recent Transactions</div>
          <div className="chart-subtitle">Latest 5 activities</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab("transactions")}>
          View all →
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No transactions yet</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {recent.map((t) => {
            const cat = CATEGORIES[t.category] || CATEGORIES.Other;
            return (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-hover)",
                  transition: "transform 0.15s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(4px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <div style={{
                  width: 38, height: 38,
                  borderRadius: "var(--radius-sm)",
                  background: cat.color + "25",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, flexShrink: 0,
                }}>
                  {cat.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 500, fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {t.description}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
                    {formatDate(t.date)} · {t.category}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: t.type === "income" ? "var(--accent-green)" : "var(--accent-red)",
                  flexShrink: 0,
                }}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount, true)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

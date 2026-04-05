import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { computeMonthlyData, formatCurrency } from "../../utils/helpers";

export default function BarChart() {
  const { transactions } = useApp();
  const monthly = computeMonthlyData(transactions);
  const [hovered, setHovered] = useState(null);

  const maxVal = Math.max(...monthly.flatMap((m) => [m.income, m.expenses]), 1);

  return (
    <div className="chart-card">
      <div className="chart-title">Monthly Cash Flow</div>
      <div className="chart-subtitle">Income vs Expenses per month</div>

      {hovered !== null && (
        <div style={{
          background: "var(--bg-sidebar)",
          color: "#fff",
          padding: "10px 14px",
          borderRadius: "var(--radius-sm)",
          fontSize: 12,
          marginBottom: 12,
          display: "inline-flex",
          gap: 16,
          lineHeight: 1.7,
        }}>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Month</div>
            <strong>{monthly[hovered]?.month}</strong>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Income</div>
            <strong style={{ color: "var(--accent-green)" }}>{formatCurrency(monthly[hovered]?.income, true)}</strong>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Expenses</div>
            <strong style={{ color: "var(--accent-red)" }}>{formatCurrency(monthly[hovered]?.expenses, true)}</strong>
          </div>
          <div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Balance</div>
            <strong style={{ color: monthly[hovered]?.balance >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
              {formatCurrency(monthly[hovered]?.balance, true)}
            </strong>
          </div>
        </div>
      )}

      <div className="bar-chart">
        {monthly.map((m, i) => (
          <div
            key={m.month}
            className="bar-group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="bar-wrap">
              <div
                className="bar income-bar"
                style={{ height: `${(m.income / maxVal) * 100}%` }}
                title={`Income: ${formatCurrency(m.income)}`}
              />
            </div>
            <div className="bar-wrap">
              <div
                className="bar expense-bar"
                style={{ height: `${(m.expenses / maxVal) * 100}%` }}
                title={`Expenses: ${formatCurrency(m.expenses)}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
        {monthly.map((m) => (
          <div key={m.month} style={{ fontSize: 10, color: "var(--text-muted)", textAlign: "center", flex: 1 }}>
            {m.month.split(" ")[0]}
          </div>
        ))}
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--accent-green)" }} />
          Income
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: "var(--accent-red)" }} />
          Expenses
        </div>
      </div>
    </div>
  );
}

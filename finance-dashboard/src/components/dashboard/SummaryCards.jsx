import React from "react";
import { useApp } from "../../context/AppContext";
import { computeSummary, formatCurrency } from "../../utils/helpers";
import { useAnimateNumber } from "../../hooks";

function AnimatedCard({ label, value, icon, className, prefix = "₹", trend, trendDir }) {
  const animated = useAnimateNumber(value);
  return (
    <div className={`summary-card ${className}`}>
      <div className="card-header">
        <span className="card-label">{label}</span>
        <span className="card-icon">{icon}</span>
      </div>
      <div className={`card-value ${className}`}>
        {prefix}{animated.toLocaleString("en-IN")}
      </div>
      <div className="card-footer">
        {trend && (
          <span className={`card-trend ${trendDir}`}>
            {trendDir === "up" ? "▲" : "▼"} {trend}
          </span>
        )}
        {!trend && <span style={{ color: "var(--text-muted)" }}>All time</span>}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const { totalIncome, totalExpenses, balance } = computeSummary(transactions);
  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

  return (
    <div className="cards-grid">
      <AnimatedCard
        label="Net Balance"
        value={Math.abs(balance)}
        icon="💳"
        className="balance"
        trend={`${savingsRate}% savings rate`}
        trendDir={balance >= 0 ? "up" : "down"}
      />
      <AnimatedCard
        label="Total Income"
        value={totalIncome}
        icon="📈"
        className="income"
        trend="All sources"
        trendDir="up"
      />
      <AnimatedCard
        label="Total Expenses"
        value={totalExpenses}
        icon="📉"
        className="expense"
        trend={`${transactions.filter(t => t.type === "expense").length} transactions`}
        trendDir="down"
      />
    </div>
  );
}

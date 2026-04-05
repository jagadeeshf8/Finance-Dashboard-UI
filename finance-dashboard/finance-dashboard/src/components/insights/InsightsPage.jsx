import React, { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { computeCategoryData, computeMonthlyData, computeSummary, formatCurrency } from "../../utils/helpers";
import { CATEGORIES } from "../../data/mockData";

function InsightCard({ icon, iconBg, title, subtitle, children }) {
  return (
    <div className="insight-card">
      <div className="insight-header">
        <div className="insight-icon" style={{ background: iconBg }}>{icon}</div>
        <div>
          <div className="insight-title">{title}</div>
          <div className="insight-subtitle">{subtitle}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function InsightsPage() {
  const { transactions } = useApp();
  const catData = useMemo(() => computeCategoryData(transactions), [transactions]);
  const monthly = useMemo(() => computeMonthlyData(transactions), [transactions]);
  const summary = useMemo(() => computeSummary(transactions), [transactions]);

  const topCat = catData[0];
  const expenseTotal = catData.reduce((s, c) => s + c.total, 0);
  const savingsRate = summary.totalIncome > 0 ? ((summary.balance / summary.totalIncome) * 100).toFixed(1) : 0;

  // Monthly comparison (last 2 months)
  const lastTwo = monthly.slice(-2);
  const prev = lastTwo[0];
  const curr = lastTwo[1];
  const expChange = prev && curr ? (((curr.expenses - prev.expenses) / prev.expenses) * 100).toFixed(1) : null;

  // Avg monthly spend
  const avgSpend = monthly.length > 0 ? monthly.reduce((s, m) => s + m.expenses, 0) / monthly.length : 0;

  return (
    <div>
      <div className="page-header">
        <div className="section-title">Financial Insights</div>
        <div className="section-subtitle">Smart observations from your spending data</div>
      </div>

      {/* Quick Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Savings Rate", value: `${savingsRate}%`, icon: "🎯", color: Number(savingsRate) > 20 ? "var(--accent-green)" : "var(--accent-yellow)" },
          { label: "Avg Monthly Spend", value: formatCurrency(avgSpend, true), icon: "📊", color: "var(--accent-blue)" },
          { label: "Total Months", value: monthly.length, icon: "📅", color: "var(--accent-purple)" },
          { label: "Categories Used", value: catData.length, icon: "🏷️", color: "var(--accent-yellow)" },
        ].map((s) => (
          <div
            key={s.label}
            className="insight-card"
            style={{ padding: "18px 20px" }}
          >
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="insights-grid">
        {/* Top Spending Category */}
        <InsightCard
          icon={topCat ? CATEGORIES[topCat.category]?.icon || "📦" : "📦"}
          iconBg="rgba(255,107,107,0.12)"
          title="Highest Spending Category"
          subtitle="Where most money goes"
        >
          {topCat ? (
            <>
              <div className="insight-value" style={{ color: CATEGORIES[topCat.category]?.color || "var(--text-primary)" }}>
                {topCat.category}
              </div>
              <div className="insight-label">
                {formatCurrency(topCat.total)} · {topCat.count} transactions · {expenseTotal > 0 ? ((topCat.total / expenseTotal) * 100).toFixed(1) : 0}% of expenses
              </div>
              <div className="progress-bar-wrap" style={{ marginTop: 16 }}>
                {catData.slice(0, 5).map((c) => (
                  <div className="progress-item" key={c.category}>
                    <div className="progress-label-row">
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span>{CATEGORIES[c.category]?.icon}</span>
                        <span>{c.category}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(c.total, true)}</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${(c.total / topCat.total) * 100}%`,
                          background: c.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-text">No expense data yet</div>
            </div>
          )}
        </InsightCard>

        {/* Monthly Comparison */}
        <InsightCard
          icon="📅"
          iconBg="rgba(79,142,247,0.12)"
          title="Monthly Comparison"
          subtitle="Last months side by side"
        >
          {lastTwo.length >= 2 ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div className="insight-value" style={{ fontSize: 22, color: Number(expChange) > 0 ? "var(--accent-red)" : "var(--accent-green)" }}>
                  {Number(expChange) > 0 ? "+" : ""}{expChange}%
                </div>
                <div className="insight-label">
                  Expense change from {prev.month} to {curr.month}
                </div>
              </div>
              <div className="month-compare">
                {lastTwo.map((m) => {
                  const maxI = Math.max(prev.income, curr.income, 1);
                  const maxE = Math.max(prev.expenses, curr.expenses, 1);
                  return (
                    <div className="month-row" key={m.month}>
                      <div className="month-row-header">
                        <span style={{ fontWeight: 600 }}>{m.month}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: 12 }}>
                          Balance: <strong style={{ color: m.balance >= 0 ? "var(--accent-green)" : "var(--accent-red)" }}>
                            {formatCurrency(m.balance, true)}
                          </strong>
                        </span>
                      </div>
                      <div className="compare-bars">
                        <div className="compare-bar-row">
                          <span style={{ width: 50 }}>Income</span>
                          <div className="compare-bar-track">
                            <div className="compare-bar-fill" style={{ width: `${(m.income / maxI) * 100}%`, background: "var(--accent-green)" }} />
                          </div>
                          <span style={{ width: 50, textAlign: "right" }}>{formatCurrency(m.income, true)}</span>
                        </div>
                        <div className="compare-bar-row">
                          <span style={{ width: 50 }}>Expense</span>
                          <div className="compare-bar-track">
                            <div className="compare-bar-fill" style={{ width: `${(m.expenses / maxE) * 100}%`, background: "var(--accent-red)" }} />
                          </div>
                          <span style={{ width: 50, textAlign: "right" }}>{formatCurrency(m.expenses, true)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ padding: "20px 0" }}>
              <div className="empty-text">Need at least 2 months of data</div>
            </div>
          )}
        </InsightCard>

        {/* Savings Health */}
        <InsightCard
          icon="💡"
          iconBg="rgba(0,200,150,0.12)"
          title="Financial Health"
          subtitle="Key observations"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              {
                icon: Number(savingsRate) >= 20 ? "✅" : Number(savingsRate) >= 10 ? "⚠️" : "❌",
                text: Number(savingsRate) >= 20
                  ? `Great! You're saving ${savingsRate}% of your income.`
                  : Number(savingsRate) >= 10
                  ? `You're saving ${savingsRate}%. Try to aim for 20%+.`
                  : `Savings rate is only ${savingsRate}%. Review your expenses.`,
              },
              {
                icon: "📌",
                text: topCat
                  ? `${topCat.category} is your biggest expense at ${expenseTotal > 0 ? ((topCat.total / expenseTotal) * 100).toFixed(0) : 0}% of total spending.`
                  : "No expense data to analyze.",
              },
              {
                icon: "📆",
                text: `You averaged ${formatCurrency(avgSpend, true)} in monthly expenses across ${monthly.length} months.`,
              },
              {
                icon: expChange !== null && Number(expChange) > 10 ? "⚠️" : "📈",
                text: expChange !== null
                  ? `Spending ${Number(expChange) > 0 ? "increased" : "decreased"} by ${Math.abs(Number(expChange))}% compared to last month.`
                  : "Keep tracking to see monthly trends.",
              },
            ].map((obs, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--bg-hover)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{obs.icon}</span>
                <span style={{ color: "var(--text-secondary)" }}>{obs.text}</span>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* Income Sources */}
        <InsightCard
          icon="💼"
          iconBg="rgba(155,127,244,0.12)"
          title="Income Breakdown"
          subtitle="Where money comes from"
        >
          {(() => {
            const incomeMap = {};
            transactions.filter((t) => t.type === "income").forEach((t) => {
              incomeMap[t.category] = (incomeMap[t.category] || 0) + t.amount;
            });
            const incomeArr = Object.entries(incomeMap)
              .map(([cat, total]) => ({ cat, total, color: CATEGORIES[cat]?.color || "#60A5FA" }))
              .sort((a, b) => b.total - a.total);
            const incTotal = incomeArr.reduce((s, x) => s + x.total, 0);

            return incomeArr.length === 0 ? (
              <div className="empty-state" style={{ padding: "20px 0" }}>
                <div className="empty-text">No income data yet</div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {incomeArr.map(({ cat, total, color }) => (
                  <div key={cat}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        <span>{CATEGORIES[cat]?.icon}</span>
                        <span>{cat}</span>
                      </span>
                      <span style={{ fontWeight: 600 }}>
                        {formatCurrency(total, true)} <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>({((total / incTotal) * 100).toFixed(0)}%)</span>
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${(total / incTotal) * 100}%`, background: color }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: "10px 12px", background: "var(--bg-hover)", borderRadius: "var(--radius-sm)", fontSize: 13 }}>
                  <strong>Total Income:</strong> <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>{formatCurrency(incTotal)}</span>
                </div>
              </div>
            );
          })()}
        </InsightCard>
      </div>
    </div>
  );
}

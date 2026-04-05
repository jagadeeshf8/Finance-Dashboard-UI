import React, { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import { computeCategoryData, formatCurrency } from "../../utils/helpers";

const RADIUS = 70;
const STROKE = 16;
const CENTER = 86;
const CIRC = 2 * Math.PI * RADIUS;

export default function DonutChart() {
  const { transactions } = useApp();
  const [hovered, setHovered] = useState(null);
  const catData = useMemo(() => computeCategoryData(transactions), [transactions]);
  const total = catData.reduce((s, c) => s + c.total, 0);

  const slices = useMemo(() => {
    let offset = 0;
    return catData.slice(0, 6).map((cat) => {
      const pct = cat.total / total;
      const dash = pct * CIRC;
      const slice = { ...cat, offset, dash, pct };
      offset += dash;
      return slice;
    });
  }, [catData, total]);

  if (catData.length === 0) {
    return (
      <div className="chart-card">
        <div className="chart-title">Spending Breakdown</div>
        <div className="empty-state"><div className="empty-icon">🥧</div><div className="empty-text">No expense data</div></div>
      </div>
    );
  }

  const hov = hovered !== null ? slices[hovered] : null;

  return (
    <div className="chart-card">
      <div className="chart-title">Spending Breakdown</div>
      <div className="chart-subtitle">By category</div>

      <div className="donut-container">
        <svg width={CENTER * 2} height={CENTER * 2} viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`} className="donut-svg">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
          {slices.map((s, i) => (
            <circle
              key={s.category}
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke={s.color}
              strokeWidth={hovered === i ? STROKE + 4 : STROKE}
              strokeDasharray={`${s.dash} ${CIRC - s.dash}`}
              strokeDashoffset={-s.offset + CIRC * 0.25}
              strokeLinecap="round"
              style={{ transition: "all 0.3s ease", cursor: "pointer", opacity: hovered !== null && hovered !== i ? 0.5 : 1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          ))}
        </svg>
        <div className="donut-center">
          {hov ? (
            <>
              <div className="donut-center-value" style={{ color: hov.color, fontSize: 16 }}>
                {formatCurrency(hov.total, true)}
              </div>
              <div className="donut-center-label">{hov.category}</div>
              <div style={{ fontSize: 12, color: "var(--accent-green)", fontWeight: 600, marginTop: 2 }}>
                {(hov.pct * 100).toFixed(1)}%
              </div>
            </>
          ) : (
            <>
              <div className="donut-center-value">{formatCurrency(total, true)}</div>
              <div className="donut-center-label">Total Spent</div>
            </>
          )}
        </div>
      </div>

      <div className="donut-legend">
        {slices.map((s, i) => (
          <div
            key={s.category}
            className="donut-legend-item"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{ cursor: "pointer", opacity: hovered !== null && hovered !== i ? 0.5 : 1, transition: "opacity 0.2s" }}
          >
            <div className="donut-legend-color" style={{ background: s.color }} />
            <span className="donut-legend-name">{s.category}</span>
            <span className="donut-legend-val">{formatCurrency(s.total, true)}</span>
            <span className="donut-legend-pct">{(s.pct * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

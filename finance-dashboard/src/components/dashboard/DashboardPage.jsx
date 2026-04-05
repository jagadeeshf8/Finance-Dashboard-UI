import React from "react";
import SummaryCards from "./SummaryCards";
import BarChart from "./BarChart";
import DonutChart from "./DonutChart";
import RecentTransactions from "./RecentTransactions";

export default function DashboardPage() {
  return (
    <div>
      <SummaryCards />
      <div className="charts-row">
        <BarChart />
        <DonutChart />
      </div>
      <RecentTransactions />
    </div>
  );
}

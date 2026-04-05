import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { ToastProvider } from "./components/shared/Toast";
import Sidebar from "./components/shared/Sidebar";
import Topbar from "./components/shared/Topbar";
import DashboardPage from "./components/dashboard/DashboardPage";
import TransactionsPage from "./components/transactions/TransactionsPage";
import InsightsPage from "./components/insights/InsightsPage";
import "./styles.css";

function AppContent() {
  const { activeTab } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (activeTab) {
      case "transactions": return <TransactionsPage />;
      case "insights": return <InsightsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {sidebarOpen && (
        <div className="overlay visible" onClick={() => setSidebarOpen(false)} />
      )}
      <div className="main-content">
        <Topbar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="page-wrapper">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AppProvider>
  );
}

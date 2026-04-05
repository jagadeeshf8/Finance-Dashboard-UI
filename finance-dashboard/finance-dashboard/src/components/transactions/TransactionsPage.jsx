import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES, ROLES } from "../../data/mockData";
import { formatCurrency, formatDate, exportToCSV, exportToJSON } from "../../utils/helpers";
import { useModal, useDebounce } from "../../hooks";
import TransactionModal from "./TransactionModal";
import { useToast } from "../shared/Toast";

const SORT_FIELDS = [
  { value: "date", label: "Date" },
  { value: "amount", label: "Amount" },
  { value: "description", label: "Description" },
  { value: "category", label: "Category" },
];

export default function TransactionsPage() {
  const {
    filteredTransactions, role, filters, search, sort, dateRange,
    setFilter, setSearch, setSort, setDateRange, deleteTransaction,
  } = useApp();
  const { showToast } = useToast();
  const modal = useModal();
  const [localSearch, setLocalSearch] = useState(search);
  const debounced = useDebounce(localSearch, 300);

  React.useEffect(() => { setSearch(debounced); }, [debounced, setSearch]);

  const isAdmin = role === ROLES.ADMIN;

  const handleDelete = (id, desc) => {
    if (window.confirm(`Delete "${desc}"?`)) {
      deleteTransaction(id);
      showToast("Transaction deleted", "🗑️");
    }
  };

  const toggleSort = (field) => {
    if (sort.field === field) {
      setSort({ field, direction: sort.direction === "asc" ? "desc" : "asc" });
    } else {
      setSort({ field, direction: "desc" });
    }
  };

  const SortIcon = ({ field }) => {
    if (sort.field !== field) return <span className="sort-icon">↕</span>;
    return <span className="sort-icon">{sort.direction === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div className="section-title">All Transactions</div>
          <div className="section-subtitle" style={{ margin: 0 }}>
            {filteredTransactions.length} records found
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <div className="export-row">
            <button className="btn btn-ghost btn-sm" onClick={() => exportToCSV(filteredTransactions)} title="Export CSV">
              ⬇ CSV
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => exportToJSON(filteredTransactions)} title="Export JSON">
              ⬇ JSON
            </button>
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => modal.open(null)}>
              + Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="transactions-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by name, category or amount..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filters.type}
          onChange={(e) => setFilter({ type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="income">💰 Income</option>
          <option value="expense">💸 Expense</option>
        </select>

        <select
          className="filter-select"
          value={filters.category}
          onChange={(e) => setFilter({ category: e.target.value })}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>{v.icon} {k}</option>
          ))}
        </select>

        <input
          type="date"
          className="date-input"
          value={dateRange.start}
          onChange={(e) => setDateRange({ start: e.target.value })}
          title="From date"
        />
        <input
          type="date"
          className="date-input"
          value={dateRange.end}
          onChange={(e) => setDateRange({ end: e.target.value })}
          title="To date"
        />

        {(filters.type !== "all" || filters.category !== "all" || search || dateRange.start || dateRange.end) && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setFilter({ type: "all", category: "all" });
              setSearch(""); setLocalSearch("");
              setDateRange({ start: "", end: "" });
            }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="table-wrap">
        <div className="table-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="table-title">Transactions</span>
          <span className="table-count">{filteredTransactions.length} entries</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔎</div>
            <div className="empty-text">No transactions found</div>
            <div className="empty-sub">Try adjusting your filters or search query</div>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  {["date", "description", "category", "type", "amount"].map((f) => (
                    <th
                      key={f}
                      className={sort.field === f ? "sorted" : ""}
                      onClick={() => toggleSort(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      <SortIcon field={f} />
                    </th>
                  ))}
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, i) => {
                  const cat = CATEGORIES[t.category] || CATEGORIES.Other;
                  return (
                    <tr key={t.id} style={{ animationDelay: `${Math.min(i, 15) * 30}ms` }}>
                      <td style={{ color: "var(--text-secondary)", fontSize: 13 }}>{formatDate(t.date)}</td>
                      <td style={{ fontWeight: 500 }}>{t.description}</td>
                      <td>
                        <span className="category-chip" style={{ color: cat.color }}>
                          {cat.icon} {t.category}
                        </span>
                      </td>
                      <td>
                        <span className={`type-badge ${t.type}`}>
                          {t.type === "income" ? "↑" : "↓"} {t.type}
                        </span>
                      </td>
                      <td>
                        <span className={`amount-cell ${t.type}`}>
                          {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-ghost btn-sm" onClick={() => modal.open(t)} title="Edit">
                              ✏️
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.id, t.description)} title="Delete">
                              🗑️
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TransactionModal isOpen={modal.isOpen} data={modal.data} onClose={modal.close} />
    </div>
  );
}

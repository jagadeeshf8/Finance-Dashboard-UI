import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { CATEGORIES } from "../../data/mockData";
import { generateId } from "../../utils/helpers";
import { useToast } from "../shared/Toast";

const EMPTY_FORM = {
  description: "",
  amount: "",
  category: "Food",
  type: "expense",
  date: new Date().toISOString().slice(0, 10),
};

export default function TransactionModal({ isOpen, data, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const { showToast } = useToast();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (data) {
      setForm({ ...data, amount: String(data.amount) });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [data, isOpen]);

  if (!isOpen) return null;

  const set = (field, val) => setForm((f) => ({ ...f, [field]: val }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = "Enter a valid amount";
    if (!form.date) e.date = "Date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const txn = { ...form, amount: Number(form.amount), id: data?.id || generateId() };
    if (data) {
      editTransaction(txn);
      showToast("Transaction updated!", "✏️");
    } else {
      addTransaction(txn);
      showToast("Transaction added!", "✅");
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">{data ? "Edit Transaction" : "Add Transaction"}</div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            className="form-input"
            placeholder="e.g. Zomato Order, Monthly Salary..."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
          {errors.description && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: 4 }}>{errors.description}</div>}
        </div>

        <div className="form-row">
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Amount (₹)</label>
            <input
              className="form-input"
              type="number"
              placeholder="0"
              min="1"
              value={form.amount}
              onChange={(e) => set("amount", e.target.value)}
            />
            {errors.amount && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: 4 }}>{errors.amount}</div>}
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Date</label>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(e) => set("date", e.target.value)}
            />
            {errors.date && <div style={{ color: "var(--accent-red)", fontSize: 12, marginTop: 4 }}>{errors.date}</div>}
          </div>
        </div>

        <div className="form-row" style={{ marginTop: 16 }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Type</label>
            <select className="form-select" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="expense">💸 Expense</option>
              <option value="income">💰 Income</option>
            </select>
          </div>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {Object.entries(CATEGORIES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {k}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            {data ? "Save Changes" : "Add Transaction"}
          </button>
        </div>
      </div>
    </div>
  );
}

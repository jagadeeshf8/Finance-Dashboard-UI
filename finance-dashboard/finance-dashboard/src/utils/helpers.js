import { CATEGORIES, MONTHS } from "../data/mockData";

export const formatCurrency = (amount, compact = false) => {
  if (compact && amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (compact && amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

export const getMonthYear = (dateStr) => {
  const date = new Date(dateStr);
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

export const computeSummary = (transactions) => {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = totalIncome - totalExpenses;
  return { totalIncome, totalExpenses, balance };
};

export const computeMonthlyData = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const key = getMonthYear(t.date);
    if (!map[key]) map[key] = { month: key, income: 0, expenses: 0, balance: 0 };
    if (t.type === "income") map[key].income += t.amount;
    else map[key].expenses += t.amount;
    map[key].balance = map[key].income - map[key].expenses;
  });
  return Object.values(map).sort((a, b) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const [am, ay] = a.month.split(" ");
    const [bm, by] = b.month.split(" ");
    return ay !== by ? Number(ay) - Number(by) : months.indexOf(am) - months.indexOf(bm);
  });
};

export const computeCategoryData = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      if (!map[t.category]) map[t.category] = { category: t.category, total: 0, count: 0, color: CATEGORIES[t.category]?.color || "#94A3B8" };
      map[t.category].total += t.amount;
      map[t.category].count += 1;
    });
  return Object.values(map).sort((a, b) => b.total - a.total);
};

export const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

export const exportToCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount (₹)"];
  const rows = transactions.map((t) => [t.date, t.description, t.category, t.type, t.amount]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

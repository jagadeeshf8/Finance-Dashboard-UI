import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { initialTransactions, ROLES } from "../data/mockData";

const AppContext = createContext(null);

const ACTIONS = {
  SET_ROLE: "SET_ROLE",
  ADD_TRANSACTION: "ADD_TRANSACTION",
  EDIT_TRANSACTION: "EDIT_TRANSACTION",
  DELETE_TRANSACTION: "DELETE_TRANSACTION",
  SET_FILTER: "SET_FILTER",
  SET_SEARCH: "SET_SEARCH",
  SET_SORT: "SET_SORT",
  SET_DATE_RANGE: "SET_DATE_RANGE",
  TOGGLE_DARK_MODE: "TOGGLE_DARK_MODE",
  SET_ACTIVE_TAB: "SET_ACTIVE_TAB",
};

const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const initialState = {
  role: loadFromStorage("fd_role", ROLES.VIEWER),
  transactions: loadFromStorage("fd_transactions", initialTransactions),
  darkMode: loadFromStorage("fd_darkmode", false),
  activeTab: "dashboard",
  filters: { type: "all", category: "all" },
  search: "",
  sort: { field: "date", direction: "desc" },
  dateRange: { start: "", end: "" },
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_ROLE:
      return { ...state, role: action.payload };
    case ACTIONS.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case ACTIONS.EDIT_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };
    case ACTIONS.DELETE_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case ACTIONS.SET_FILTER:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTIONS.SET_SEARCH:
      return { ...state, search: action.payload };
    case ACTIONS.SET_SORT:
      return { ...state, sort: action.payload };
    case ACTIONS.SET_DATE_RANGE:
      return { ...state, dateRange: { ...state.dateRange, ...action.payload } };
    case ACTIONS.TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
    case ACTIONS.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("fd_role", JSON.stringify(state.role));
    localStorage.setItem("fd_transactions", JSON.stringify(state.transactions));
    localStorage.setItem("fd_darkmode", JSON.stringify(state.darkMode));
  }, [state.role, state.transactions, state.darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", state.darkMode ? "dark" : "light");
  }, [state.darkMode]);

  const setRole = useCallback((role) => dispatch({ type: ACTIONS.SET_ROLE, payload: role }), []);
  const addTransaction = useCallback((t) => dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: t }), []);
  const editTransaction = useCallback((t) => dispatch({ type: ACTIONS.EDIT_TRANSACTION, payload: t }), []);
  const deleteTransaction = useCallback((id) => dispatch({ type: ACTIONS.DELETE_TRANSACTION, payload: id }), []);
  const setFilter = useCallback((f) => dispatch({ type: ACTIONS.SET_FILTER, payload: f }), []);
  const setSearch = useCallback((s) => dispatch({ type: ACTIONS.SET_SEARCH, payload: s }), []);
  const setSort = useCallback((s) => dispatch({ type: ACTIONS.SET_SORT, payload: s }), []);
  const setDateRange = useCallback((r) => dispatch({ type: ACTIONS.SET_DATE_RANGE, payload: r }), []);
  const toggleDarkMode = useCallback(() => dispatch({ type: ACTIONS.TOGGLE_DARK_MODE }), []);
  const setActiveTab = useCallback((tab) => dispatch({ type: ACTIONS.SET_ACTIVE_TAB, payload: tab }), []);

  const filteredTransactions = React.useMemo(() => {
    let result = [...state.transactions];
    if (state.filters.type !== "all") result = result.filter((t) => t.type === state.filters.type);
    if (state.filters.category !== "all") result = result.filter((t) => t.category === state.filters.category);
    if (state.search) {
      const q = state.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.amount.toString().includes(q)
      );
    }
    if (state.dateRange.start)
      result = result.filter((t) => t.date >= state.dateRange.start);
    if (state.dateRange.end)
      result = result.filter((t) => t.date <= state.dateRange.end);
    result.sort((a, b) => {
      const { field, direction } = state.sort;
      let valA = a[field], valB = b[field];
      if (field === "amount") { valA = Number(valA); valB = Number(valB); }
      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [state.transactions, state.filters, state.search, state.sort, state.dateRange]);

  return (
    <AppContext.Provider
      value={{
        ...state,
        filteredTransactions,
        setRole,
        addTransaction,
        editTransaction,
        deleteTransaction,
        setFilter,
        setSearch,
        setSort,
        setDateRange,
        toggleDarkMode,
        setActiveTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

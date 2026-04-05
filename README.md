# 💰 FinTrack — Personal Finance Dashboard

> A clean, interactive, and fully responsive finance dashboard built with React. Track your income, monitor expenses, understand spending patterns, and manage transactions — all from one place.

---

## 📸 What It Looks Like

The app has three main sections:

- **Dashboard** — Summary cards, bar chart (monthly cash flow), donut chart (spending breakdown), and recent transactions
- **Transactions** — Full table with search, filter, sort, date range, add/edit/delete (admin only), and export
- **Insights** — Smart observations: top spending category, monthly comparison, savings rate, income breakdown

---

## 🚀 Getting Started

### Prerequisites

Make sure you have **Node.js** (v16 or above) and **npm** installed.

```bash
node -v   # should show v16+
npm -v    # should show 8+
```

### Installation & Running

```bash
# 1. Unzip the project and open the folder
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
```

The app opens at **http://localhost:3000** automatically.

### Build for Production

```bash
npm run build
```

This creates an optimized `build/` folder you can deploy to Netlify, Vercel, or any static host.

---

## 🗂️ Project Structure

```
finance-dashboard/
├── public/
│   └── index.html               # HTML entry point
├── src/
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.jsx      # Puts together the overview
│   │   │   ├── SummaryCards.jsx       # Balance / Income / Expense cards
│   │   │   ├── BarChart.jsx           # Monthly income vs expense bars
│   │   │   ├── DonutChart.jsx         # Category spending breakdown
│   │   │   └── RecentTransactions.jsx # Last 5 transactions widget
│   │   ├── transactions/
│   │   │   ├── TransactionsPage.jsx   # Full transaction table + filters
│   │   │   └── TransactionModal.jsx   # Add / Edit form modal
│   │   ├── insights/
│   │   │   └── InsightsPage.jsx       # Spending analysis & observations
│   │   └── shared/
│   │       ├── Sidebar.jsx            # Left navigation + role switcher
│   │       ├── Topbar.jsx             # Header with dark mode toggle
│   │       └── Toast.jsx              # Notification system
│   ├── context/
│   │   └── AppContext.jsx             # Global state (useReducer + Context)
│   ├── data/
│   │   └── mockData.js                # 60 sample transactions (6 months)
│   ├── hooks/
│   │   └── index.js                   # Custom hooks
│   ├── utils/
│   │   └── helpers.js                 # Formatting, computation, export utils
│   ├── styles.css                     # All global styles + CSS variables
│   ├── App.jsx                        # Root component
│   └── index.jsx                      # React DOM entry point
├── package.json
└── README.md
```



---

## 🧠 Concepts & Techniques Used

This section explains every major React concept used in the project — written so anyone learning React can follow along.

---

### 1. 🔁 `useReducer` — Central State Management

Instead of scattering multiple `useState` calls everywhere, all global app state lives in one place using `useReducer`. Think of it like a tiny Redux — you dispatch named actions, and the reducer decides how state changes.

```js
// In AppContext.jsx
const [state, dispatch] = useReducer(reducer, initialState);

// Example action
dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });

// Reducer handles it
case "ADD_TRANSACTION":
  return { ...state, transactions: [action.payload, ...state.transactions] };
```

**Why use it?** When state logic is complex (filters + role + dark mode + sort + transactions all together), `useReducer` keeps it organized and predictable.

---

### 2. 🌍 `useContext` — Sharing State Without Prop Drilling

`React.createContext()` creates a "global bucket" of data. Any component can reach into it without passing props through every parent in between.

```js
// Creating context
const AppContext = createContext(null);

// Providing it at the top level
<AppContext.Provider value={{ ...state, setRole, addTransaction, ... }}>
  {children}
</AppContext.Provider>

// Consuming it anywhere in the tree
const { transactions, role } = useApp(); // useApp() is a wrapper around useContext
```

**Why use it?** A component like `DonutChart` deep in the tree can access `transactions` directly — no need to pass it through `DashboardPage` → `BarChart` → ... like a telephone game.

---

### 3. 🧮 `useMemo` — Expensive Computation Caching

Some computations like filtering + sorting 60 transactions should not re-run on every render. `useMemo` caches the result and only recomputes when dependencies actually change.

```js
const filteredTransactions = useMemo(() => {
  let result = [...state.transactions];
  if (state.filters.type !== "all") result = result.filter(...);
  result.sort(...);
  return result;
}, [state.transactions, state.filters, state.search, state.sort, state.dateRange]);
```

**Why use it?** Imagine having 500 transactions — sorting them on every keystroke would feel sluggish. `useMemo` makes it efficient.

---

### 4. ⚡ `useCallback` — Stable Function References

When functions are passed as props or used in `useEffect` dependencies, they can cause infinite re-renders if recreated on every render. `useCallback` gives them a stable identity.

```js
const addTransaction = useCallback(
  (t) => dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: t }),
  [] // only created once
);
```

**Why use it?** Without `useCallback`, a child component receiving `addTransaction` as a prop would re-render on every parent render, even if nothing changed.

---

### 5. 🎨 `useEffect` — Side Effects

Used for things that happen *outside* React's render cycle — like syncing to localStorage, changing the document theme, or debouncing a search input.

```js
// Persist to localStorage whenever these values change
useEffect(() => {
  localStorage.setItem("fd_role", JSON.stringify(state.role));
  localStorage.setItem("fd_transactions", JSON.stringify(state.transactions));
}, [state.role, state.transactions]);

// Apply dark mode to the document
useEffect(() => {
  document.documentElement.setAttribute("data-theme", state.darkMode ? "dark" : "light");
}, [state.darkMode]);
```

---

### 6. 🔢 `useState` — Local Component State

For things that are purely local (modal open/closed, hovered chart bar, local search text before debounce):

```js
const [hovered, setHovered] = useState(null);   // Which bar is hovered
const [isOpen, setIsOpen] = useState(false);     // Modal visibility
const [form, setForm] = useState(EMPTY_FORM);    // Form field values
```

---

### 7. 🎯 Custom Hooks — Reusable Logic

Custom hooks are just functions that use other hooks internally. They help you extract repeated logic into clean, reusable pieces.

#### `useDebounce`
Delays a value update until the user stops typing. Prevents a search API call (or expensive filter) on every single keystroke.

```js
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer); // cleanup on next keystroke
  }, [value, delay]);
  return debounced;
};

// Usage: search only fires after user pauses 300ms
const debounced = useDebounce(localSearch, 300);
useEffect(() => { setSearch(debounced); }, [debounced]);
```

#### `useModal`
Packages open/close state + data into one reusable hook, used for the Add/Edit transaction modal.

```js
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const open = (d = null) => { setData(d); setIsOpen(true); };
  const close = () => { setIsOpen(false); setData(null); };
  return { isOpen, data, open, close };
};
```

#### `useAnimateNumber`
Smoothly animates a number from 0 to its target value using `requestAnimationFrame`. Gives the summary cards that satisfying count-up effect on load.

```js
export const useAnimateNumber = (target, duration = 800) => {
  const [current, setCurrent] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCurrent(Math.round(target * eased));
      if (progress < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return current;
};
```

#### `useClickOutside`
Detects clicks outside a referenced element — used to close dropdowns or modals.

```js
export const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) callback();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ref, callback]);
};
```

---

### 8. 🗄️ `useRef` — Mutable Values Without Re-renders

Used to hold the `requestAnimationFrame` ID in `useAnimateNumber`. Unlike `useState`, changing a `ref` doesn't trigger a re-render.

```js
const raf = useRef(null);
raf.current = requestAnimationFrame(animate); // update without re-render
cancelAnimationFrame(raf.current);            // cancel on cleanup
```

---

## 🔄 App Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      AppProvider                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  State (via useReducer)                           │  │
│  │  • transactions[]    • role                       │  │
│  │  • filters           • search                     │  │
│  │  • sort              • dateRange                  │  │
│  │  • darkMode          • activeTab                  │  │
│  └───────────────┬───────────────────────────────────┘  │
│                  │ Context (via useContext)              │
└──────────────────┼──────────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │      App.jsx        │
         │  Reads: activeTab   │
         └─────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
Dashboard    Transactions     Insights
Page         Page             Page
    │              │
    ├─ SummaryCards │─ Controls (filters, search, sort)
    ├─ BarChart     │─ Table (sortable columns)
    ├─ DonutChart   │─ TransactionModal (add/edit)
    └─ RecentTxns   └─ Export (CSV / JSON)

User Action Flow:
User types in search → localSearch state updates →
useDebounce waits 300ms → setSearch() dispatches to reducer →
filteredTransactions recomputes via useMemo →
Table re-renders with new results
```

---

## 🎭 Role-Based UI (RBAC Simulation)

Two roles are available — switch them from the sidebar dropdown or they persist via `localStorage`.

| Feature                  | Viewer | Admin |
|--------------------------|:------:|:-----:|
| View dashboard           | ✅     | ✅    |
| View transactions        | ✅     | ✅    |
| View insights            | ✅     | ✅    |
| Add new transaction      | ❌     | ✅    |
| Edit existing transaction| ❌     | ✅    |
| Delete transaction       | ❌     | ✅    |
| Export CSV/JSON          | ✅     | ✅    |

Implementation is purely frontend — no backend needed. The `role` value is checked inline:

```jsx
const isAdmin = role === ROLES.ADMIN;
{isAdmin && <button onClick={() => modal.open(null)}>+ Add Transaction</button>}
{isAdmin && <button onClick={() => modal.open(t)}>✏️</button>}
```

---

## 💾 Data Persistence

Using `localStorage`, the app remembers:

- Your **selected role** (Admin/Viewer)
- All **transaction data** (including ones you add/edit/delete)
- **Dark mode** preference

This means closing and reopening the browser keeps your data intact. No backend, no database — just browser storage.

```js
// On every relevant state change:
localStorage.setItem("fd_transactions", JSON.stringify(state.transactions));

// On load:
const loadFromStorage = (key, fallback) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};
```

---

## 🌙 Dark Mode

Toggled with the 🌙 button in the top-right. Works by setting a `data-theme` attribute on the `<html>` element, which switches a full set of CSS custom properties.

```css
:root {
  --bg-primary: #F4F1ED;
  --text-primary: #1A1A2E;
  /* ... */
}

[data-theme="dark"] {
  --bg-primary: #0F0F1A;
  --text-primary: #F4F1ED;
  /* ... */
}
```

Every component automatically picks up the right colors — no conditional class names needed anywhere.

---

## 📤 Export Feature

From the Transactions page, you can export visible (filtered) data as:

- **CSV** — Opens in Excel / Google Sheets
- **JSON** — Raw structured data for developers

```js
export const exportToCSV = (transactions) => {
  const headers = ["Date", "Description", "Category", "Type", "Amount (₹)"];
  const rows = transactions.map((t) => [t.date, t.description, t.category, t.type, t.amount]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  // trigger browser download...
};
```

---

## 📊 Charts (Pure CSS + SVG — No Chart Library)

Both charts are built from scratch without Recharts, Chart.js, or any other library:

### Bar Chart (Monthly Cash Flow)
- Uses CSS flexbox with dynamic `height` percentages
- Heights animate via CSS `transition`
- Hover reveals a tooltip with month-specific numbers

### Donut Chart (Category Breakdown)
- Built with SVG `<circle>` elements using `stroke-dasharray` and `stroke-dashoffset`
- Each slice is a circle with a specific portion of its circumference drawn
- Hover highlights a segment and shows its details in the center

---

## 🎨 Design Decisions

| Decision | Rationale |
|---|---|
| **Syne + DM Sans fonts** | Syne is bold and geometric for headings; DM Sans is warm and readable for body |
| **Dark sidebar + light content** | Classic split creates visual hierarchy without being distracting |
| **CSS Variables for theming** | One source of truth for all colors; dark mode works by swapping one attribute |
| **No UI library (MUI/Shadcn)** | Everything is handcrafted so the design is unique and purposeful |
| **INR currency (₹)** | Localized for Indian users using `Intl.NumberFormat("en-IN")` |
| **Compact numbers (₹1.2L)** | Better readability in cards and charts where space is tight |

---



## 🛠️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI library |
| React DOM | 18.2 | Rendering |
| Create React App | 5.0 | Build tooling |
| CSS Custom Properties | — | Theming |
| localStorage | — | Persistence |
| Intl API | — | Currency formatting |
| SVG | — | Donut chart |

**Zero external UI libraries.** Everything from charts to modals to toasts is handbuilt.

---



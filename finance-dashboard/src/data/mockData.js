export const CATEGORIES = {
  Food: { icon: "🍔", color: "#FF6B6B" },
  Transport: { icon: "🚗", color: "#4ECDC4" },
  Shopping: { icon: "🛍️", color: "#FFE66D" },
  Entertainment: { icon: "🎬", color: "#A78BFA" },
  Health: { icon: "💊", color: "#34D399" },
  Bills: { icon: "📄", color: "#FB923C" },
  Salary: { icon: "💼", color: "#60A5FA" },
  Freelance: { icon: "💻", color: "#F472B6" },
  Investment: { icon: "📈", color: "#10B981" },
  Other: { icon: "📦", color: "#94A3B8" },
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const initialTransactions = [
  // January
  { id: generateId(), date: "2024-01-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: generateId(), date: "2024-01-07", description: "Zomato Order", amount: 450, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-01-10", description: "Metro Card Recharge", amount: 500, category: "Transport", type: "expense" },
  { id: generateId(), date: "2024-01-12", description: "Amazon Shopping", amount: 3200, category: "Shopping", type: "expense" },
  { id: generateId(), date: "2024-01-15", description: "Netflix Subscription", amount: 649, category: "Entertainment", type: "expense" },
  { id: generateId(), date: "2024-01-18", description: "Electricity Bill", amount: 1800, category: "Bills", type: "expense" },
  { id: generateId(), date: "2024-01-20", description: "Freelance Project", amount: 25000, category: "Freelance", type: "income" },
  { id: generateId(), date: "2024-01-22", description: "Gym Membership", amount: 1200, category: "Health", type: "expense" },
  { id: generateId(), date: "2024-01-25", description: "Swiggy Dinner", amount: 620, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-01-28", description: "Mutual Fund SIP", amount: 5000, category: "Investment", type: "expense" },

  // February
  { id: generateId(), date: "2024-02-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: generateId(), date: "2024-02-08", description: "Grocery Store", amount: 2100, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-02-10", description: "Ola Cab", amount: 380, category: "Transport", type: "expense" },
  { id: generateId(), date: "2024-02-14", description: "Valentine Dinner", amount: 2800, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-02-16", description: "Medical Checkup", amount: 1500, category: "Health", type: "expense" },
  { id: generateId(), date: "2024-02-19", description: "Internet Bill", amount: 999, category: "Bills", type: "expense" },
  { id: generateId(), date: "2024-02-21", description: "Freelance Design", amount: 18000, category: "Freelance", type: "income" },
  { id: generateId(), date: "2024-02-24", description: "Movie Tickets", amount: 700, category: "Entertainment", type: "expense" },
  { id: generateId(), date: "2024-02-26", description: "Mutual Fund SIP", amount: 5000, category: "Investment", type: "expense" },
  { id: generateId(), date: "2024-02-28", description: "Flipkart Purchase", amount: 4500, category: "Shopping", type: "expense" },

  // March
  { id: generateId(), date: "2024-03-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: generateId(), date: "2024-03-07", description: "Petrol Fill", amount: 1200, category: "Transport", type: "expense" },
  { id: generateId(), date: "2024-03-09", description: "Restaurant Lunch", amount: 850, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-03-12", description: "Spotify Premium", amount: 119, category: "Entertainment", type: "expense" },
  { id: generateId(), date: "2024-03-15", description: "Freelance Content", amount: 32000, category: "Freelance", type: "income" },
  { id: generateId(), date: "2024-03-18", description: "Water Bill", amount: 650, category: "Bills", type: "expense" },
  { id: generateId(), date: "2024-03-20", description: "Pharmacy", amount: 920, category: "Health", type: "expense" },
  { id: generateId(), date: "2024-03-22", description: "Myntra Order", amount: 2600, category: "Shopping", type: "expense" },
  { id: generateId(), date: "2024-03-25", description: "Zomato Lunch", amount: 390, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-03-28", description: "Mutual Fund SIP", amount: 5000, category: "Investment", type: "expense" },

  // April
  { id: generateId(), date: "2024-04-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: generateId(), date: "2024-04-08", description: "Grocery Store", amount: 1800, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-04-11", description: "Bus Pass", amount: 400, category: "Transport", type: "expense" },
  { id: generateId(), date: "2024-04-13", description: "Streaming Bundle", amount: 1299, category: "Entertainment", type: "expense" },
  { id: generateId(), date: "2024-04-16", description: "Freelance App Dev", amount: 45000, category: "Freelance", type: "income" },
  { id: generateId(), date: "2024-04-18", description: "Electricity Bill", amount: 2100, category: "Bills", type: "expense" },
  { id: generateId(), date: "2024-04-21", description: "Dental Visit", amount: 2500, category: "Health", type: "expense" },
  { id: generateId(), date: "2024-04-24", description: "Amazon Electronics", amount: 8900, category: "Shopping", type: "expense" },
  { id: generateId(), date: "2024-04-26", description: "Dinner Out", amount: 1100, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-04-29", description: "Mutual Fund SIP", amount: 5000, category: "Investment", type: "expense" },

  // May
  { id: generateId(), date: "2024-05-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: generateId(), date: "2024-05-08", description: "Swiggy Breakfast", amount: 280, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-05-10", description: "Rapido Bike", amount: 180, category: "Transport", type: "expense" },
  { id: generateId(), date: "2024-05-14", description: "Concert Tickets", amount: 2000, category: "Entertainment", type: "expense" },
  { id: generateId(), date: "2024-05-17", description: "Freelance Consulting", amount: 20000, category: "Freelance", type: "income" },
  { id: generateId(), date: "2024-05-20", description: "Mobile Bill", amount: 799, category: "Bills", type: "expense" },
  { id: generateId(), date: "2024-05-22", description: "Health Insurance", amount: 3500, category: "Health", type: "expense" },
  { id: generateId(), date: "2024-05-25", description: "Clothes Shopping", amount: 3800, category: "Shopping", type: "expense" },
  { id: generateId(), date: "2024-05-28", description: "Family Dinner", amount: 1600, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-05-30", description: "Mutual Fund SIP", amount: 5000, category: "Investment", type: "expense" },

  // June
  { id: generateId(), date: "2024-06-05", description: "Monthly Salary", amount: 85000, category: "Salary", type: "income" },
  { id: generateId(), date: "2024-06-07", description: "Lunch Delivery", amount: 520, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-06-10", description: "Auto Rickshaw", amount: 220, category: "Transport", type: "expense" },
  { id: generateId(), date: "2024-06-14", description: "Freelance UI/UX", amount: 38000, category: "Freelance", type: "income" },
  { id: generateId(), date: "2024-06-17", description: "Annual Maintenance", amount: 4500, category: "Bills", type: "expense" },
  { id: generateId(), date: "2024-06-19", description: "Gaming Subscription", amount: 499, category: "Entertainment", type: "expense" },
  { id: generateId(), date: "2024-06-22", description: "Vitamins & Supplements", amount: 1200, category: "Health", type: "expense" },
  { id: generateId(), date: "2024-06-24", description: "Home Decor", amount: 5600, category: "Shopping", type: "expense" },
  { id: generateId(), date: "2024-06-27", description: "Birthday Dinner", amount: 2200, category: "Food", type: "expense" },
  { id: generateId(), date: "2024-06-30", description: "Mutual Fund SIP", amount: 5000, category: "Investment", type: "expense" },
];

export const ROLES = {
  VIEWER: "viewer",
  ADMIN: "admin",
};

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

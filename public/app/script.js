const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const expenseForm = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const totalElement = document.getElementById("total");
const userNameElement = document.getElementById("user-name");
const logoutButton = document.getElementById("logout-button");

const tabButtons = document.querySelectorAll(".tab-button");
const viewTabs = document.querySelectorAll(".view-tab");
const pageViews = document.querySelectorAll(".page-view");

const USERS_KEY = "expenses_users";
const CURRENT_USER_KEY = "expenses_current_user";

function getUsers() {
  return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function showScreen(screenName) {
  if (screenName === "app") {
    authScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
  } else {
    authScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");
  }
}

function setActiveTab(targetFormId) {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.target === targetFormId);
  });

  loginForm.classList.toggle("active", targetFormId === "login-form");
  registerForm.classList.toggle("active", targetFormId === "register-form");
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

function detectCategory(description) {
  const text = description.toLowerCase();

  const categoryMap = [
    { keywords: ["profi", "lidl", "kaufland", "penny", "mega image", "carrefour", "selgros"], category: "Food" },
    { keywords: ["petrol", "shell", "rompetrol", "omv", "lukoil", "benzina", "motorina"], category: "Transport" },
    { keywords: ["electric", "eon", "digiservice", "vodafone", "orange", "telefon", "internet", "net", "apn", "lte"], category: "Bills" },
    { keywords: ["netflix", "spotify", "cinema", "movie", "playstation", "steam", "youtube", "hbo"], category: "Entertainment" },
    { keywords: ["medic", "farmacie", "pharmacy", "clinic", "doctor"], category: "Other" }
  ];

  for (const item of categoryMap) {
    if (item.keywords.some((keyword) => text.includes(keyword))) {
      return item.category;
    }
  }

  return "Other";
}

function renderExpenses(expenses) {
  expenseList.innerHTML = "";

  let total = 0;

  expenses.forEach((expense) => {
    total += Number(expense.amount);

    const item = document.createElement("li");
    item.classList.add("expense-item");

    const info = document.createElement("div");
    info.classList.add("expense-info");

    const description = document.createElement("span");
    description.textContent = expense.description;

    const category = document.createElement("small");
    category.textContent = ({ "Mâncare": "Food", "Facturi": "Bills", "Divertisment": "Entertainment", "Altele": "Other" })[expense.category] || expense.category;

    info.appendChild(description);
    info.appendChild(category);

    const amount = document.createElement("span");
    amount.textContent = expense.amount + " RON";

    item.appendChild(info);
    item.appendChild(amount);
    expenseList.appendChild(item);
  });

  totalElement.textContent = total + " RON";
}

function showApp(user) {
  userNameElement.textContent = user.name;
  renderExpenses(user.expenses || []);
  showScreen("app");
}

function renderCalendar() {
  const calendarMonthLabel = document.getElementById("calendar-month-label");
  const calendarDates = document.getElementById("calendar-dates");

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayIndex = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  calendarMonthLabel.textContent = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentMonth);

  calendarDates.innerHTML = "";

  for (let i = 0; i < startDayIndex; i++) {
    const day = document.createElement("span");
    day.classList.add("muted");
    day.textContent = prevMonthLastDay - startDayIndex + i + 1;
    calendarDates.appendChild(day);
  }

  for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
    const day = document.createElement("button");
    day.type = "button";
    day.classList.add("calendar-day");
    day.textContent = dayNumber;

    const date = new Date(year, month, dayNumber);
    const isToday = date.toDateString() === today.toDateString();
    const isSelected = date.toDateString() === selectedDate.toDateString();

    if (isToday) day.classList.add("today");
    if (isSelected) day.classList.add("selected");

    day.addEventListener("click", () => {
      selectedDate = new Date(year, month, dayNumber);
      renderCalendar();
    });

    calendarDates.appendChild(day);
  }

  const totalCells = startDayIndex + daysInMonth;
  const nextMonthDays = (7 - (totalCells % 7)) % 7;

  for (let i = 1; i <= nextMonthDays; i++) {
    const day = document.createElement("span");
    day.classList.add("muted");
    day.textContent = i;
    calendarDates.appendChild(day);
  }
}

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.target);
  });
});

viewTabs.forEach((button) => {
  button.addEventListener("click", () => {
    const targetView = button.dataset.view;

    viewTabs.forEach((tab) => tab.classList.toggle("active", tab === button));
    pageViews.forEach((page) => page.classList.toggle("active", page.dataset.view === targetView));
  });
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("register-name").value.trim();
  const email = document.getElementById("register-email").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const users = getUsers();
  const userExists = users.some((user) => user.email === email);

  if (userExists) {
    alert("An account with this email already exists.");
    return;
  }

  users.push({
    name,
    email,
    password,
    expenses: [],
  });

  saveUsers(users);
  alert("Account created successfully!");
  registerForm.reset();
  setActiveTab("login-form");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    alert("Incorrect email or password.");
    return;
  }

  saveCurrentUser(user);
  showApp(user);
});

expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const user = getCurrentUser();
  if (!user) return;

  const description = document.getElementById("description").value.trim();
  const amount = Number(document.getElementById("amount").value);
  let category = document.getElementById("category").value;

  if (!description || !amount) {
    alert("Please fill in all fields.");
    return;
  }

  if (!category || category === "auto") {
    category = detectCategory(description);
  }

  const newExpense = {
    description,
    amount,
    category,
    date: new Date().toISOString(),
  };

  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email === user.email);

  if (userIndex !== -1) {
    users[userIndex].expenses.push(newExpense);
    saveUsers(users);
    saveCurrentUser(users[userIndex]);
    renderExpenses(users[userIndex].expenses);
  }

  expenseForm.reset();
  document.getElementById("category").value = "auto";
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  showScreen("auth");
  loginForm.reset();
  registerForm.reset();
});

const calendarMonthLabel = document.getElementById("calendar-month-label");
const calendarDates = document.getElementById("calendar-dates");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

const today = new Date();
let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

prevMonthButton.addEventListener("click", () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
  renderCalendar();
});

renderCalendar();

const currentUser = getCurrentUser();
if (currentUser) {
  const users = getUsers();
  const user = users.find((u) => u.email === currentUser.email);
  if (user) {
    showApp(user);
  }
}

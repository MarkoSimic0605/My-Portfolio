const STORAGE_KEY = "dashboard_users";
const INITIAL_DATA_KEY = "initial_users";

export function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function loadUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

// func for saving users
export function saveInitialData(users) {
  localStorage.setItem(INITIAL_DATA_KEY, JSON.stringify(users));
}

// func for reading user data
export function loadInitialData() {
  return JSON.parse(localStorage.getItem(INITIAL_DATA_KEY));
}

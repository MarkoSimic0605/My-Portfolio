import { Model } from "./model.js";
import { View } from "./view.js";
import { Controller } from "./controller.js";
import { loadUsers, saveUsers, saveInitialData } from "./storage.js";
import usersData from "../data/users.json";

document.addEventListener("DOMContentLoaded", () => {
  // 1. fetch users
  let users = loadUsers();

  // 2. fetch from locale strorage, or json file
  if (!users || users.length === 0) {
    users = [...usersData].sort((a, b) => a.id - b.id);
    saveUsers(users); // save to LS
    saveInitialData(users); // save init data
  }

  // 3. init lastUserId
  window.lastUserId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) : 0;

  // 4. create and run app
  const model = new Model(users);
  const view = new View();
  const controller = new Controller(model, view);

  controller.init();
});

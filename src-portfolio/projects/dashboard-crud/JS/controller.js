import { saveUsers, loadInitialData } from "./storage.js";

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.initialUsers = loadInitialData();
  }

  init() {
    // Bind view events
    this.view.bindAddUser(this.handleAddUser.bind(this));
    this.view.bindEditUser(this.handleEditUser.bind(this));
    this.view.bindDeleteUser(this.handleDeleteUser.bind(this));
    this.view.bindSearchUser(this.handleSearchUser.bind(this));
    this.view.bindReset(this.handleReset.bind(this));
    this.view.bindPaginate(this.handlePaginate.bind(this));
    this.view.bindCloseModal(this.handleCloseModal.bind(this));
    this.view.bindSubmitForm(this.handleSubmitForm.bind(this));

    // Initial render
    this.render();
  }

  render() {
    const users = this.model.getPaginatedUsers();
    const currentPage = this.model.currentPage;
    const totalPages = this.model.getTotalPages();

    this.view.renderUsers(users, currentPage, totalPages);
  }

  handleAddUser() {
    this.view.showModal();
  }

  handleEditUser(id) {
    const user = this.model.users.find((u) => u.id === id);
    if (user) {
      this.view.showModal(user);
    }
  }

  handleDeleteUser(id) {
    const user = this.model.users.find((u) => u.id === id);
    if (user && confirm(`Are you sure you want to delete ${user.name}?`)) {
      try {
        const currentPageBeforeDelete = this.model.currentPage;
        this.model.deleteUser(id);

        // save changes
        saveUsers(this.model.users);

        const usersOnCurrentPage = this.model.getPaginatedUsers();
        if (usersOnCurrentPage.length === 0 && currentPageBeforeDelete > 1) {
          this.model.setCurrentPage(currentPageBeforeDelete - 1);
        }

        this.view.showToast(
          `User ${user.name} deleted successfully`,
          "success"
        );
        this.render();
      } catch (error) {
        console.error("Error deleting user:", error);
        this.view.showToast("Failed to delete user", "error");
      }
    }
  }

  handleSearchUser(term) {
    this.model.filterUsers(term);
    this.render();
  }

  handleReset() {
    if (confirm("Are you sure you want to reset all changes?")) {
      const initialUsers = loadInitialData();
      this.model.resetToInitial(initialUsers);
      saveUsers(initialUsers); // SAVE CURRENT DATA
      this.view.showToast("Table reset to initial state", "info");
      this.render();
    }
  }

  handleSubmitForm(user) {
    if (user.id) {
      // Update existing user
      if (this.model.updateUser(user)) {
        saveUsers(this.model.users); // Save changes to LocalStorage
        this.view.showToast(
          `User ${user.name} updated successfully`,
          "success"
        );
      }
    } else {
      // Add new user
      const newUser = this.model.addUser(user);
      saveUsers(this.model.users); // Save changes to LocalStorage
      this.view.showToast(`User ${newUser.name} added successfully`, "success");
    }
    this.render();
  }

  handlePaginate(direction) {
    if (direction === "prev" && this.model.currentPage > 1) {
      this.model.setCurrentPage(this.model.currentPage - 1);
    } else if (
      direction === "next" &&
      this.model.currentPage < this.model.getTotalPages()
    ) {
      this.model.setCurrentPage(this.model.currentPage + 1);
    }
    this.render();
  }

  handleCloseModal() {
    this.view.hideModal();
  }
}

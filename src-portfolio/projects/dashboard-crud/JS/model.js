export class Model {
  constructor(users = []) {
    this.users = users;
    this.filteredUsers = [...users];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.searchTerm = "";
  }

  getUsers() {
    return this.users;
  }

  addUser(user) {
    // Generate new ID (max existing ID + 1)
    const newId =
      this.users.length > 0 ? Math.max(...this.users.map((u) => u.id)) + 1 : 1;
    const newUser = { ...user, id: newId };
    this.users.push(newUser);
    this.filterUsers();
    return newUser;
  }

  updateUser(updatedUser) {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.filterUsers();
      return true;
    }
    return false;
  }

  deleteUser(id) {
    this.users = this.users.filter((user) => user.id !== id);
    this.filterUsers(this.searchTerm);

    // check if current page exist after delete
    const totalPages = this.getTotalPages();
    if (this.currentPage > totalPages && totalPages > 0) {
      this.currentPage = totalPages;
    }
  }

  filterUsers(searchTerm = "") {
    // name updated in filterUsers
    this.searchTerm = searchTerm.toLowerCase();
    this.currentPage = 1;

    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm)
    );
  }

  getPaginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  setCurrentPage(page) {
    const totalPages = this.getTotalPages();
    if (page >= 1 && page <= totalPages) {
      this.currentPage = page;
    }
  }

  resetToInitial(initialUsers) {
    this.users = [...initialUsers];
    this.filteredUsers = [...initialUsers];
    this.currentPage = 1;
    this.searchTerm = "";
  }
}

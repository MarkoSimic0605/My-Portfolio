export class View {
  constructor() {
    this.tableBody = document.querySelector("#user-table tbody");
    this.searchInput = document.getElementById("search");
    this.addUserBtn = document.getElementById("add-user");
    this.resetBtn = document.getElementById("reset");
    this.prevPageBtn = document.getElementById("prev-page");
    this.nextPageBtn = document.getElementById("next-page");
    this.pageInfo = document.getElementById("page-info");
    this.modal = document.getElementById("modal");
    this.modalTitle = document.getElementById("modal-title");
    this.userForm = document.getElementById("user-form");
    this.closeBtn = document.querySelector(".close");
    this.modalForm = document.getElementById("user-form");
    this.nameInput = document.getElementById("name");
    this.emailInput = document.getElementById("email");
    this.roleSelect = document.getElementById("role");
    this.userIdInput = document.getElementById("user-id");

    this.toast = document.createElement("div");
    this.toast.className = "toast";
    document.body.appendChild(this.toast);
  }

  showToast(message, type = "info") {
    this.toast.textContent = message;
    this.toast.className = `toast ${type}`;
    this.toast.classList.add("show");

    setTimeout(() => {
      this.toast.classList.remove("show");
    }, 3000);
  }

  renderUsers(users, currentPage, totalPages) {
    this.tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");

      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                   <button class="action-btn edit-btn" data-id="${user.id}" 
                        ${user.role === "admin" ? "disabled" : ""}>
                        Edit
                    </button>
                    <button class="action-btn delete-btn" data-id="${user.id}" 
                        ${user.role === "admin" ? "disabled" : ""}>
                        Delete
                    </button>
                </td>
            `;

      this.tableBody.appendChild(row);
    });

    this.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    this.prevPageBtn.disabled = currentPage === 1;
    this.nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  showModal(user = null) {
    if (user) {
      this.modalTitle.textContent = "Edit User";
      this.userIdInput.value = user.id;
      this.nameInput.value = user.name;
      this.emailInput.value = user.email;
      this.roleSelect.value = user.role;
    } else {
      this.modalTitle.textContent = "Add User";
      this.modalForm.reset();
    }

    this.modal.style.display = "block";
  }

  hideModal() {
    this.modal.style.display = "none";
  }

  bindAddUser(handler) {
    this.addUserBtn.addEventListener("click", () => {
      this.showModal();
    });
  }

  bindEditUser(handler) {
    this.tableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("edit-btn")) {
        const id = parseInt(event.target.getAttribute("data-id"));
        handler(id);
      }
    });
  }

  bindDeleteUser(handler) {
    this.tableBody.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-btn")) {
        const id = parseInt(event.target.getAttribute("data-id"));

        handler(id);
      }
    });
  }

  bindSearchUser(handler) {
    let timeout;
    this.searchInput.addEventListener("input", (event) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        handler(event.target.value);
      }, 300);
    });
  }

  bindReset(handler) {
    this.resetBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      handler();
    });
  }

  bindPaginate(handler) {
    this.prevPageBtn.addEventListener("click", () => {
      handler("prev");
    });

    this.nextPageBtn.addEventListener("click", () => {
      handler("next");
    });
  }

  bindCloseModal(handler) {
    this.closeBtn.addEventListener("click", () => {
      this.hideModal();
    });

    window.addEventListener("click", (event) => {
      if (event.target === this.modal) {
        this.hideModal();
      }
    });
  }

  bindSubmitForm(handler) {
    this.modalForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = {
        id: this.userIdInput.value ? parseInt(this.userIdInput.value) : null,
        name: this.nameInput.value,
        email: this.emailInput.value,
        role: this.roleSelect.value,
      };
      handler(user);
      this.hideModal();
    });
  }
}

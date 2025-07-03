export function throttle(func, limit) {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// pagination functions
export const pagination = {
  getPaginatedItems: (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  },

  getTotalPages: (totalItems, itemsPerPage) => {
    return Math.ceil(totalItems / itemsPerPage);
  },

  createPaginationControls: (
    currentPage,
    totalPages,
    maxVisibleButtons = 3
  ) => {
    let startPage, endPage;

    if (totalPages <= maxVisibleButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
      endPage = startPage + maxVisibleButtons - 1;

      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = endPage - maxVisibleButtons + 1;
      }
    }

    return {
      startPage,
      endPage,
      showStartEllipsis: startPage > 1,
      showEndEllipsis: endPage < totalPages,
      totalPages,
    };
  },

  renderPagination: (
    container,
    prevBtn,
    nextBtn,
    { currentPage, totalPages },
    onPageChange
  ) => {
    if (!container || !prevBtn || !nextBtn) return;

    container.innerHTML = "";

    const { startPage, endPage, showStartEllipsis, showEndEllipsis } =
      pagination.createPaginationControls(currentPage, totalPages);

    // add first page and elipse if needed
    if (showStartEllipsis) {
      pagination.createPageButton(1, currentPage, onPageChange, container);
      if (startPage > 2) {
        pagination.createEllipsis(container);
      }
    }

    // add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pagination.createPageButton(i, currentPage, onPageChange, container);
    }

    // add last page and elipse
    if (showEndEllipsis) {
      if (endPage < totalPages - 1) {
        pagination.createEllipsis(container);
      }
      pagination.createPageButton(
        totalPages,
        currentPage,
        onPageChange,
        container
      );
    }

    if (currentPage === 1) {
      prevBtn.style.display = "none";
    } else {
      prevBtn.style.display = "inline-block";
    }

    if (currentPage === totalPages) {
      nextBtn.style.display = "none";
    } else {
      nextBtn.style.display = "inline-block";
    }
  },

  createPageButton: (pageNumber, currentPage, onPageChange, container) => {
    const btn = document.createElement("button");
    btn.textContent = pageNumber;
    btn.className = `btn-page${pageNumber === currentPage ? " active" : ""}`;
    btn.addEventListener("click", () => onPageChange(pageNumber));
    container.appendChild(btn);
  },

  createEllipsis: (container) => {
    const span = document.createElement("span");
    span.textContent = "...";
    span.className = "pagination-ellipsis";
    container.appendChild(span);
  },
};

export function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast show";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("show");
    toast.remove();
  }, 1500);
}

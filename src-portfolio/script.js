import emailjs from "@emailjs/browser";

const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav-links");

// Smooth scrolling for navigation links
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    document.querySelector(targetId).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// Dark/Light Mode Toggle
const themeToggle = document.getElementById("theme-toggle");
const icon = themeToggle.querySelector("i");

// Check LS
const savedTheme =
  localStorage.getItem("theme") ||
  (window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light");

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  icon.classList.replace("fa-moon", "fa-sun");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const isDark = document.body.classList.contains("dark-mode");

  icon.classList.toggle("fa-moon", !isDark);
  icon.classList.toggle("fa-sun", isDark);

  localStorage.setItem("theme", isDark ? "dark" : "light");
});

burger.addEventListener("click", () => {
  nav.classList.toggle("active");
});

// emailJS
emailjs.init("37dA1rlg7mD-YLSLO");

const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm("service_gh7m5rp", "template_spalu7d", this).then(
      () => {
        alert("Message sent successfully!");
        this.reset();
      },
      (error) => {
        console.error("FAILED...", error);
        alert("Something went wrong. Please try again.");
      }
    );
  });
}

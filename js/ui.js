(() => {
  // Header & Sidebar Logic

  const header = document.getElementById("app-header");
  const sidebar = document.getElementById("app-sidebar");

  const sidebarToggle = document.getElementById("sidebar-toggle");
  const sidebarClose = document.getElementById("sidebar-close");

  const navLinks = document.querySelectorAll("[data-nav]");

  if (header && sidebar) {
    console.log("Header and Sidebar initialized.");
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      navLinks.forEach((navLink) => {
        navLink.dataset.active = "false";
        navLink.removeAttribute("aria-current");

        navLink.classList.remove(
          "bg-primary-hover/10",
          "font-semibold",
          "text-primary-hover",
        );

        navLink.classList.add("text-on-background");
      });

      link.dataset.active = "true";
      link.setAttribute("aria-current", "page");

      link.classList.add(
        "bg-primary-hover/10",
        "font-semibold",
        "text-primary-hover",
      );

      link.classList.remove("text-on-background");
    });
  });

  // Task 7: Toggle Mobile Sidebar

  if (sidebar && sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const isOpen = sidebar.dataset.open === "true";

      sidebar.dataset.open = isOpen ? "false" : "true";
    });
  }

  if (sidebar && sidebarClose) {
    sidebarClose.addEventListener("click", () => {
      sidebar.dataset.open = "false";
    });
  }

  if (sidebar && navLinks.length > 0) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 1024) {
          sidebar.dataset.open = "false";
        }
      });
    });
  }
})();

// Task 8 — Toggle Theme

const themeLight = document.getElementById("theme-light");
const themeDark = document.getElementById("theme-dark");

function updateThemeButtons(theme) {
  if (themeLight) {
    themeLight.classList.toggle("text-muted", theme !== "light");
    themeLight.classList.toggle("text-on-background", theme === "light");
    themeLight.classList.toggle("bg-primary-hover/10", theme === "light");
    themeLight.setAttribute("aria-pressed", String(theme === "light"));
  }

  if (themeDark) {
    themeDark.classList.toggle("text-muted", theme !== "dark");
    themeDark.classList.toggle("text-on-background", theme === "dark");
    themeDark.classList.toggle("bg-primary-hover/10", theme === "dark");
    themeDark.setAttribute("aria-pressed", String(theme === "dark"));
  }
}

function setTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  updateThemeButtons(theme);
  saveTheme(theme);
}

if (themeLight) {
  themeLight.addEventListener("click", () => {
    setTheme("light");
  });
}

if (themeDark) {
  themeDark.addEventListener("click", () => {
    setTheme("dark");
  });
}

setTheme(loadTheme());
//task 9

// Task 9 — Display Current Date

const todayLabel = document.getElementById("today-label");

function updateCurrentDate() {
  if (!todayLabel) return;

  const now = new Date();

  const weekday = new Intl.DateTimeFormat("fa-IR", {
    weekday: "long",
  }).format(now);

  const date = new Intl.DateTimeFormat("fa-IR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(now);

  todayLabel.textContent = `امروز ${weekday}، ${date}`;
}

updateCurrentDate();

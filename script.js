const body = document.body;
const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const authModal = document.getElementById("authModal");
const openTriggers = document.querySelectorAll("[data-open-auth]");
const closeTriggers = document.querySelectorAll("[data-close-auth]");
const switchButtons = document.querySelectorAll("[data-auth-view]");
const authPanels = document.querySelectorAll("[data-auth-panel]");
const scrollSections = document.querySelectorAll(".scroll-section");

function setAuthView(view) {
  switchButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.authView === view);
  });

  authPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.authPanel === view);
  });
}

function openAuth(view) {
  setAuthView(view);
  authModal.classList.add("open");
  authModal.setAttribute("aria-hidden", "false");
  body.style.overflow = "hidden";
}

function closeAuth() {
  authModal.classList.remove("open");
  authModal.setAttribute("aria-hidden", "true");
  body.style.overflow = "";
}

function setNavOpen(isOpen) {
  if (!menuToggle || !navbar) {
    return;
  }

  navbar.classList.toggle("nav-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
}

function updateScrollState() {
  const offset = window.scrollY;

  if (navbar) {
    navbar.classList.toggle("nav-scrolled", offset > 18);
  }
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
        }
      });
    },
    {
      threshold: 0.18,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  scrollSections.forEach((section, index) => {
    section.style.setProperty("--scroll-delay", `${index * 90}ms`);
    sectionObserver.observe(section);
  });
} else {
  scrollSections.forEach((section) => {
    section.classList.add("in-view");
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!expanded);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 860) {
      setNavOpen(false);
    }
  });
});

openTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openAuth(trigger.dataset.openAuth));
});

closeTriggers.forEach((trigger) => {
  trigger.addEventListener("click", closeAuth);
});

switchButtons.forEach((button) => {
  button.addEventListener("click", () => setAuthView(button.dataset.authView));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    setNavOpen(false);
  }

  updateScrollState();
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (authModal.classList.contains("open")) {
      closeAuth();
    }

    if (navbar && navbar.classList.contains("nav-open")) {
      setNavOpen(false);
    }
  }
});

window.addEventListener("scroll", updateScrollState, { passive: true });

updateScrollState();

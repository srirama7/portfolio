"use strict";
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [
  ...parent.querySelectorAll(selector),
];
const projects = JSON.parse($("#project-data").textContent);
const safe = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

// Keep the visitor's appearance preference without making storage a requirement.
const themeButton = $(".theme-toggle");
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeButton.setAttribute(
    "aria-label",
    `Switch to ${dark ? "light" : "dark"} theme`,
  );
  $('meta[name="theme-color"]').content = dark ? "#191d1a" : "#f6f4ee";
}
try {
  setTheme(localStorage.getItem("amogha-portfolio-theme") === "dark");
} catch {
  setTheme(false);
}
themeButton.addEventListener("click", () => {
  const dark = !document.body.classList.contains("dark");
  setTheme(dark);
  try {
    localStorage.setItem("amogha-portfolio-theme", dark ? "dark" : "light");
  } catch {
    /* Appearance still works without storage. */
  }
});

const menuButton = $(".menu-toggle");
const mobileNav = $("#mobile-nav");
function closeMenu() {
  mobileNav.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}
menuButton.addEventListener("click", () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute("aria-expanded", String(opening));
  menuButton.setAttribute(
    "aria-label",
    opening ? "Close navigation" : "Open navigation",
  );
});
$$("a", mobileNav).forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
window.matchMedia("(min-width: 801px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});

// Project filters leave the work readable even when JavaScript is unavailable.
$$(".filter").forEach((button) =>
  button.addEventListener("click", () => {
    const selected = button.dataset.filter;
    $$(".filter").forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    let count = 0;
    $$(".project-card").forEach((card) => {
      card.hidden = selected !== "all" && card.dataset.category !== selected;
      if (!card.hidden) count++;
    });
    $("#filter-status").textContent =
      `Showing ${count} ${count === 1 ? "project" : "projects"}`;
  }),
);

const projectDialog = $("#project-dialog");
const guideDialog = $("#guide-dialog");
function openDialog(dialog) {
  closeMenu();
  dialog.showModal();
  document.body.classList.add("modal-open");
}
$$(".detail-trigger").forEach((button) =>
  button.addEventListener("click", () => {
    const project = projects.find((item) => item.id === button.dataset.project);
    if (!project) return;
    const links = [];
    if (project.live)
      links.push(
        `<a class="text-link" href="${safe(project.live)}" target="_blank" rel="noopener noreferrer">Visit site ↗</a>`,
      );
    if (project.source)
      links.push(
        `<a class="text-link" href="${safe(project.source)}" target="_blank" rel="noopener noreferrer">${safe(project.sourceLabel || "GitHub")} ↗</a>`,
      );
    if (project.store)
      links.push(
        `<a class="text-link" href="${safe(project.store)}" target="_blank" rel="noopener noreferrer">Google Play ↗</a>`,
      );
    $("#dialog-content").innerHTML =
      `<img class="dialog-image" src="assets/${safe(project.image)}.webp" alt="${safe(project.title)} project preview" width="1440" height="960"><div class="dialog-body"><p class="eyebrow">${safe(project.label)}</p><h2 id="dialog-title">${safe(project.title)}</h2><p class="dialog-subtitle">${safe(project.subtitle)}</p><p>${safe(project.desc)}</p><ul>${project.features.map((feature) => `<li>${safe(feature)}</li>`).join("")}</ul><div class="tags">${project.tags.map((tag) => `<span>${safe(tag)}</span>`).join("")}</div>${links.length ? `<div class="project-links">${links.join("")}</div>` : "<p>This project is in local development. A public demo is not available yet.</p>"}</div>`;
    openDialog(projectDialog);
  }),
);
$(".guide-launcher").addEventListener("click", () => openDialog(guideDialog));
$$(".guide-options a").forEach((link) =>
  link.addEventListener("click", () => guideDialog.close()),
);
$$("dialog").forEach((dialog) => {
  $(".dialog-close", dialog).addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () =>
    document.body.classList.remove("modal-open"),
  );
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
});

let toastTimer;
function toast(message) {
  clearTimeout(toastTimer);
  const target = $(".toast");
  target.textContent = message;
  target.classList.add("visible");
  toastTimer = setTimeout(() => target.classList.remove("visible"), 3500);
}
$(".copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("amoghabhat74@gmail.com");
    toast("Email address copied. Let’s make something good.");
  } catch {
    toast("Email me at amoghabhat74@gmail.com");
  }
});
$("#year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const sections = $$("main section[id]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        $$(".desktop-nav a").forEach((link) =>
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`,
          ),
        );
      });
    },
    { rootMargin: "-10% 0px -65% 0px" },
  );
  sections.forEach((section) => observer.observe(section));
}

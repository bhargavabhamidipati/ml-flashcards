import { loadFlashcardData } from "./dataService.js";
import { createRouter } from "./router.js";

const elements = {
  app: document.getElementById("app"),
  breadcrumbs: document.getElementById("breadcrumbs"),
  sidebar: document.getElementById("sidebarList"),
  searchInput: document.getElementById("searchInput"),
  clearSearch: document.getElementById("clearSearch"),
  themeToggle: document.getElementById("themeToggle"),
};

const state = { data: null, query: "" };

initializeTheme();
const router = createRouter({
  app: elements.app,
  breadcrumbs: elements.breadcrumbs,
  sidebar: elements.sidebar,
  getData: () => state.data,
  getQuery: () => state.query,
});

elements.searchInput.addEventListener("input", event => {
  state.query = event.target.value;
  location.hash = "#/";
  router.route();
});

elements.clearSearch.addEventListener("click", () => {
  elements.searchInput.value = "";
  state.query = "";
  router.route();
});

loadFlashcardData()
  .then(data => { state.data = data; router.route(); })
  .catch(error => {
    console.error(error);
    elements.app.innerHTML = `<div class="empty-state"><h2>Could not load flashcards</h2><p>Open through a local server or GitHub Pages, not directly as a file.</p></div>`;
  });

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.dataset.theme = savedTheme;
  elements.themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("theme", nextTheme);
  });
}

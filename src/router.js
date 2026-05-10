import { renderFlashcard, renderHome, renderNotFound, renderSearch, renderSidebar, renderSubtopics } from "./views.js";

export function createRouter({ app, breadcrumbs, sidebar, getData, getQuery }) {
  function route() {
    const data = getData();
    if (!data) return;

    renderSidebar(sidebar, data.headings, location.hash);

    const query = getQuery().trim();
    if (query) return renderSearch({ app, breadcrumbs, data, query });

    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    if (parts[0] === "heading" && renderSubtopics({ app, breadcrumbs, data, headingSlug: parts[1] })) return;
    if (parts[0] === "card" && renderFlashcard({ app, breadcrumbs, data, cardId: parts[1] })) return;
    if (parts.length === 0) return renderHome({ app, breadcrumbs, data });

    renderNotFound(app, breadcrumbs);
  }

  window.addEventListener("hashchange", route);
  return { route };
}

import { escapeHtml, searchableText, slug, trimText } from "./utils.js";

export function renderSidebar(container, headings, currentHash) {
  container.innerHTML = headings.map(heading => {
    const href = `#/heading/${slug(heading.heading)}`;
    return `<a class="side-link ${currentHash === href ? "active" : ""}" href="${href}"><span>${escapeHtml(heading.heading)}</span><small>${heading.count}</small></a>`;
  }).join("");
}

export function renderHome({ app, breadcrumbs, data }) {
  breadcrumbs.innerHTML = `<span>Home</span>`;
  app.innerHTML = `
    <div class="page-title"><div><h2>Choose a heading</h2><p>${data.cards.length} flashcards grouped into ${data.headings.length} learning sections.</p></div></div>
    <div class="grid heading-grid">${data.headings.map(headingCard).join("")}</div>`;
}

export function renderSearch({ app, breadcrumbs, data, query }) {
  const normalized = query.trim().toLowerCase();
  const matches = data.cards.filter(card => searchableText(card).includes(normalized));
  breadcrumbs.innerHTML = `<a href="#/">Home</a><span>›</span><span>Search</span>`;
  app.innerHTML = `
    <div class="page-title"><div><h2>Search results</h2><p>${matches.length} cards matched “${escapeHtml(query)}”.</p></div></div>
    ${matches.length ? `<div class="grid subtopic-grid">${matches.map(searchResultCard).join("")}</div>` : emptyState("No flashcards found", "Try a different search term.")}`;
}

export function renderSubtopics({ app, breadcrumbs, data, headingSlug }) {
  const heading = data.headings.find(item => slug(item.heading) === headingSlug);
  if (!heading) return false;
  const cards = data.cards.filter(card => card.heading === heading.heading);
  breadcrumbs.innerHTML = `<a href="#/">Home</a><span>›</span><span>${escapeHtml(heading.heading)}</span>`;
  app.innerHTML = `
    <div class="page-title"><div><h2>${escapeHtml(heading.heading)}</h2><p>Select a subtopic to open the full flashcard.</p></div><span class="badge">${cards.length} cards</span></div>
    <div class="grid subtopic-grid">${cards.map(subtopicCard).join("")}</div>`;
  return true;
}

export function renderFlashcard({ app, breadcrumbs, data, cardId }) {
  const card = data.cards.find(item => item.id === cardId);
  if (!card) return false;
  const sameHeading = data.cards.filter(item => item.heading === card.heading);
  const currentIndex = sameHeading.findIndex(item => item.id === card.id);
  const previous = sameHeading[currentIndex - 1];
  const next = sameHeading[currentIndex + 1];

  breadcrumbs.innerHTML = `<a href="#/">Home</a><span>›</span><a href="#/heading/${slug(card.heading)}">${escapeHtml(card.heading)}</a><span>›</span><span>${escapeHtml(card.subtopic)}</span>`;
  app.innerHTML = `
    <article class="flash-card">
      <section class="flash-top"><span class="badge">${escapeHtml(card.heading)} · Card ${currentIndex + 1} of ${sameHeading.length}</span><h2>${escapeHtml(card.subtopic)}</h2><p>${escapeHtml(card.what)}</p></section>
      <section class="detail-grid">
        ${detail("Supervised or unsupervised?", card.learningType)}
        ${detail("Task type", card.taskType)}
        ${detail("How it works at a high level", card.highLevel)}
        ${detail("When would I use it?", card.whenUse)}
        ${detail("Limitations", card.limitations)}
      </section>
      <nav class="card-actions" aria-label="Flashcard navigation">
        ${previous ? `<a class="secondary-button" href="#/card/${previous.id}">← ${escapeHtml(previous.subtopic)}</a>` : `<a class="secondary-button" href="#/heading/${slug(card.heading)}">← Back to subtopics</a>`}
        ${next ? `<a class="primary-button" href="#/card/${next.id}">${escapeHtml(next.subtopic)} →</a>` : `<a class="primary-button" href="#/heading/${slug(card.heading)}">Finish section</a>`}
      </nav>
    </article>`;
  return true;
}

export function renderNotFound(app, breadcrumbs) {
  breadcrumbs.innerHTML = `<a href="#/">Home</a><span>›</span><span>Not found</span>`;
  app.innerHTML = emptyState("Flashcard not found", "Use the topic list or search to continue.");
}

function headingCard(item) {
  return `<a class="topic-card" href="#/heading/${slug(item.heading)}"><span class="badge">${item.count} subtopics</span><h2>${escapeHtml(item.heading)}</h2><p>Open this section to review its subtopic flashcards.</p></a>`;
}

function subtopicCard(card) {
  return `<a class="subtopic-card" href="#/card/${card.id}"><span class="badge">#${card.order}</span><h2>${escapeHtml(card.subtopic)}</h2><p>${escapeHtml(trimText(card.what, 150))}</p></a>`;
}

function searchResultCard(card) {
  return `<a class="subtopic-card" href="#/card/${card.id}"><span class="badge">${escapeHtml(card.heading)}</span><h2>${escapeHtml(card.subtopic)}</h2><p>${escapeHtml(trimText(card.what || card.whenUse || card.limitations, 180))}</p></a>`;
}

function detail(title, body) {
  return `<div class="detail-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body || "Not specified.")}</p></div>`;
}

function emptyState(title, body) {
  return `<div class="empty-state"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(body)}</p></div>`;
}

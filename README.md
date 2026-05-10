# Machine Learning Flashcards

A static, responsive GitHub Pages site generated from `ml_topics_detailed_completed.xlsx`. The UI presents the workbook as navigable flashcards:

1. Home page lists all ML headings.
2. Clicking a heading shows its subtopics.
3. Clicking a subtopic opens a flashcard with all remaining workbook columns.
4. Previous/next buttons support navigation inside each heading.
5. Search works across headings, subtopics, descriptions, use cases, and limitations.

## Project structure

```text
.
├── index.html                 # Static entry point
├── data.json                  # Generated flashcard data from the Excel workbook
├── assets/                    # Original Excel workbook for download
├── styles/main.css            # Responsive styling and theme variables
├── src/
│   ├── app.js                 # App bootstrap and event handling
│   ├── dataService.js         # Fetches and validates data.json
│   ├── router.js              # Hash-based routing
│   ├── views.js               # HTML rendering functions
│   └── utils.js               # Small reusable helpers
└── .github/workflows/pages.yml # GitHub Pages deployment workflow
```

## Run locally

Because the app loads `data.json` with `fetch`, run it through a local server:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Commit to the `main` branch.
4. In GitHub, go to **Settings → Pages**.
5. Set **Source** to **GitHub Actions**.
6. Push to `main`; the included workflow deploys the static site.

## Updating the flashcards later

Update the Excel workbook, regenerate `data.json` with the same column names, then commit the new `data.json` and workbook in `assets/`.

Generated cards: **112**
Generated headings: **10**

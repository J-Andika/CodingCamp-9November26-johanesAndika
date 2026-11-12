# Expense & Budget Visualizer — Technical Conventions

## Tech Stack
- **HTML** — Structure only, no templating engines.
- **CSS** — Single stylesheet, CSS variables for theming.
- **Vanilla JavaScript** — No frameworks, no libraries except Chart.js.
- **Chart.js** — Loaded via CDN for pie chart rendering.

## Hard Constraints
- No React, Vue, Angular, or any framework.
- No build step (Webpack, Vite, etc.).
- No backend server or API calls.
- No npm packages or node_modules.

## Persistence
- **localStorage only** — All data lives in the browser.
- No external databases or cloud sync.

## File Rules
- Exactly **one** CSS file: `css/style.css`
- Exactly **one** JS file: `js/app.js`
- No splitting into multiple CSS/JS files.

## Browser Support
- Modern browsers only: Chrome, Firefox, Edge, Safari (latest 2 versions).
- No IE11 support.

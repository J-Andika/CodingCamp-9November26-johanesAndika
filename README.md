# CodingCamp-9November26-johanesAndika

**Expense & Budget Visualizer** — a client-side expense tracker built with HTML, CSS and vanilla JavaScript. No frameworks, no backend, no build step. Everything is stored in the browser's localStorage.

Live site: `https://<your-username>.github.io/CodingCamp-9November26-johanesAndika/`

## Features

**Required**
- Input form (Item, Amount, Category: Food / Transport / Fun) with field validation
- Scrollable transaction list with per-item delete
- Total spent, recalculated on every change
- Doughnut chart of spending by category (Chart.js)

**Optional challenges implemented (3 of 5)**
- Sort transactions by date, amount, or category
- Spending limit with an over-limit warning
- Dark / light mode toggle, persisted

## Project layout

```
.
├── index.html          # markup
├── css/style.css       # all styling (single stylesheet, per constraint)
├── js/app.js           # all logic (single script, per constraint)
├── .kiro/              # Kiro steering docs + feature spec
└── README.md
```

## Run locally

Open `index.html` in a browser. No server required. For a local server instead:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## How it works

`render()` in `js/app.js` is the single source of truth. Every data change (add, delete, sort, limit, theme) writes to localStorage and then calls `render()`, which rebuilds the ledger, the total, and the chart in one pass. That removes the whole class of "list updated but chart didn't" bugs.

Storage keys: `transactions`, `spendingLimit`, `theme`, `sortBy`.

## Notes

- Amounts are formatted as IDR via `Intl.NumberFormat`. Change `LOCALE` / `CURRENCY` at the top of `js/app.js` for other currencies.
- Chart.js is pinned to 4.4.1 and loaded from a CDN.
- Data never leaves the browser.

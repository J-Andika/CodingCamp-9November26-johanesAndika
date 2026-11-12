# Expense & Budget Visualizer — Project Structure

## File/Folder Layout
```
<repo-root>/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── .kiro/
```

## Naming Conventions
- **Files:** lowercase with hyphens (`index.html`, `style.css`).
- **Functions:** camelCase (`handleFormSubmit`, `calculateTotal`).
- **DOM IDs:** lowercase with hyphens (`transaction-list`, `pie-chart`).
- **CSS Classes:** lowercase with hyphens (`sort-btn`, `empty-state`).

## localStorage Schema
- **Key:** `transactions` — JSON array of `{id, name, amount, category, createdAt}`.
- **Key:** `spendingLimit` — Number.
- **Key:** `theme` — `"light"` or `"dark"`.
- **Key:** `sortBy` — `"date"`, `"amount"`, or `"category"`.

## Rendering Pattern
- **Single source of truth:** `render()` function updates all UI.
- Called after every data change (add, delete, sort, limit, theme).
- Updates transaction list, total balance, and pie chart in one pass.

## Code Organization (js/app.js)
1. Constants & State
2. DOM References
3. Data Layer (localStorage read/write)
4. Business Logic (calculations, grouping, sorting)
5. Rendering Functions
6. Event Handlers
7. Initialization

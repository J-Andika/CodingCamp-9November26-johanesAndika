# Expense & Budget Visualizer — Tasks

## Setup & Structure
- [ ] Create project folder structure at repo root: `css/`, `js/`
- [ ] Create `index.html` with complete HTML structure (header, form, sections for balance/list/chart)
- [ ] Add Chart.js CDN script tag to `index.html`
- [ ] Create `css/style.css` with CSS variables for theming
- [ ] Create `js/app.js` with basic file structure (comments for sections)

## Core Functionality (MVP)

### Form & Input
- [ ] Implement form DOM references and event listener for submit
- [ ] Implement form validation (all fields required)
- [ ] Implement `generateId()` function for unique transaction IDs
- [ ] Implement `handleFormSubmit(event)` to create transaction object

### Data Layer
- [ ] Implement `loadTransactions()` — load from localStorage or return empty array
- [ ] Implement `saveTransactions(transactions)` — save to localStorage
- [ ] Implement `addTransaction(transaction)` — append to array and save
- [ ] Implement `deleteTransaction(id)` — remove by ID and save

### Business Logic
- [ ] Implement `calculateTotal(transactions)` — sum all amounts
- [ ] Implement `groupByCategory(transactions)` — aggregate by category

### Rendering
- [ ] Implement `renderTransactionList(transactions)` — build list DOM with delete buttons
- [ ] Implement `renderTotal(total, limit)` — display balance with limit highlight
- [ ] Implement `renderPieChart(transactions)` — create/update Chart.js pie chart
- [ ] Implement master `render()` function — sync all UI components

### Event Handling
- [ ] Implement `handleDelete(id)` — delete transaction and re-render
- [ ] Attach delete button listeners in `renderTransactionList()`

### Initialization
- [ ] Implement initialization logic (IIFE or DOMContentLoaded)
- [ ] Call `render()` on page load to display existing data

## Styling (MVP)
- [ ] Style header and theme toggle button
- [ ] Style total balance section with prominent display
- [ ] Style input form (mobile-friendly, stacked layout)
- [ ] Style transaction list (scrollable, card-style items)
- [ ] Style delete buttons
- [ ] Style pie chart container
- [ ] Add responsive breakpoints for larger screens
- [ ] Add empty state styles for transaction list

## Optional Challenge 1: Sort Transactions
- [ ] Add sort buttons to HTML (Date, Amount, Category)
- [ ] Implement `getSortBy()` / `setSortBy()` for sort preference
- [ ] Implement `sortTransactions(transactions, sortBy)` logic
- [ ] Implement `handleSortChange(sortBy)` event handler
- [ ] Update `render()` to apply sort before rendering list
- [ ] Style sort buttons (active state for current selection)

## Optional Challenge 2: Spending Limit Highlight
- [ ] Add spending limit input to HTML
- [ ] Implement `getSpendingLimit()` / `setSpendingLimit()` functions
- [ ] Implement `handleLimitChange(limit)` event handler
- [ ] Update `renderTotal()` to apply red highlight when limit exceeded
- [ ] Style limit section and highlight state

## Optional Challenge 3: Dark/Light Mode Toggle
- [ ] Add theme toggle button to HTML
- [ ] Implement `getTheme()` / `setTheme()` functions
- [ ] Implement `applyTheme(theme)` to set `data-theme` attribute on `<html>`
- [ ] Implement `handleThemeToggle()` event handler
- [ ] Add dark mode CSS variable overrides
- [ ] Update initialization to load and apply saved theme

## Testing & Polish
- [ ] Test adding transactions with all categories
- [ ] Test deleting transactions
- [ ] Test total balance updates correctly
- [ ] Test pie chart updates correctly
- [ ] Test sort functionality (all three options)
- [ ] Test spending limit highlight (set limit, exceed, clear)
- [ ] Test dark/light mode toggle and persistence
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Test localStorage persistence (close and reopen browser)
- [ ] Test in Chrome, Firefox, Edge, Safari (if available)

## Final Verification
- [ ] Verify only one CSS file exists in `css/`
- [ ] Verify only one JavaScript file exists in `js/`
- [ ] Verify no frameworks or build tools used
- [ ] Verify Chart.js loaded via CDN only
- [ ] Verify all MVP acceptance criteria met
- [ ] Verify all three optional challenges implemented

# Expense & Budget Visualizer — Design

## File Structure
```
<repo-root>/
├── index.html          # Main HTML structure
├── css/
│   └── style.css       # Single CSS file for all styling
├── js/
│   └── app.js          # Single JavaScript file for all logic
└── .kiro/              # Kiro steering + spec docs
```

---

## localStorage Schema

### Transactions
**Key:** `transactions`  
**Value:** JSON array of transaction objects

```json
[
  {
    "id": "uuid-string",
    "name": "Coffee",
    "amount": 5.00,
    "category": "Food",
    "createdAt": "2026-11-12T10:30:00.000Z"
  }
]
```

### Spending Limit
**Key:** `spendingLimit`  
**Value:** Number (e.g., `500`)

### Theme Preference
**Key:** `theme`  
**Value:** String (`"light"` or `"dark"`)

### Sort Preference
**Key:** `sortBy`  
**Value:** String (`"date"` (default), `"amount"`, or `"category"`)

---

## Function Breakdown

### Data Layer
| Function | Description |
|----------|-------------|
| `loadTransactions()` | Retrieves transactions array from localStorage; returns empty array if none exist |
| `saveTransactions(transactions)` | Saves transactions array to localStorage |
| `addTransaction(transaction)` | Adds a new transaction to the array and saves |
| `deleteTransaction(id)` | Removes a transaction by ID and saves |
| `getSpendingLimit()` | Retrieves spending limit from localStorage |
| `setSpendingLimit(limit)` | Saves spending limit to localStorage |
| `getTheme()` | Retrieves theme preference from localStorage |
| `setTheme(theme)` | Saves theme preference to localStorage |
| `getSortBy()` | Retrieves sort preference from localStorage |
| `setSortBy(sortBy)` | Saves sort preference to localStorage |

### Business Logic
| Function | Description |
|----------|-------------|
| `calculateTotal(transactions)` | Returns the sum of all transaction amounts |
| `groupByCategory(transactions)` | Returns an object with categories as keys and total amounts as values |
| `generateId()` | Generates a unique ID for each transaction |
| `sortTransactions(transactions, sortBy)` | Returns sorted copy of transactions based on sort preference |

### Rendering
| Function | Description |
|----------|-------------|
| `render()` | Master render function that syncs list, total, chart, and limit highlight |
| `renderTransactionList(transactions)` | Renders the scrollable transaction list with delete buttons |
| `renderTotal(total, limit)` | Renders total balance with limit highlight if exceeded |
| `renderPieChart(transactions)` | Renders or updates the Chart.js pie chart |
| `renderSortOptions()` | Renders sort dropdown/buttons |
| `applyTheme(theme)` | Applies CSS classes for dark/light mode |

### Event Handlers
| Function | Description |
|----------|-------------|
| `handleFormSubmit(event)` | Validates form, creates transaction, calls `addTransaction()` and `render()` |
| `handleDelete(id)` | Calls `deleteTransaction(id)` and `render()` |
| `handleSortChange(sortBy)` | Updates sort preference and calls `render()` |
| `handleLimitChange(limit)` | Updates spending limit and calls `render()` |
| `handleThemeToggle()` | Toggles theme and calls `applyTheme()` |

---

## The `render()` Function

The `render()` function is the single source of truth for UI synchronization. It ensures the transaction list, total balance, pie chart, and spending limit highlight are always in sync.

### Flow:
```
render()
   │
   ├── Load transactions from localStorage
   │
   ├── Apply current sort preference
   │
   ├── renderTransactionList(transactions)
   │      └── Build DOM elements for each transaction
   │      └── Attach delete event listeners
   │
   ├── calculateTotal(transactions)
   │      └── Sum all amounts
   │
   ├── renderTotal(total, spendingLimit)
   │      └── Display total with highlight if limit exceeded
   │
   ├── groupByCategory(transactions)
   │      └── Aggregate amounts by category
   │
   ├── renderPieChart(groupedData)
   │      └── Update or create Chart.js pie chart
   │
   └── Return (UI is now in sync with data)
```

### Key Principles:
1. **Single Entry Point:** All data changes (add, delete, sort, limit) trigger `render()`.
2. **No Selective Updates:** `render()` always updates all UI components to prevent desync.
3. **Chart.js Instance Management:** Maintain a single chart instance; update data instead of recreating.
4. **DOM Efficiency:** Use `innerHTML` for simplicity (acceptable for MVP scale).

---

## HTML Structure (index.html)

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expense & Budget Visualizer</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body>
    <!-- Theme Toggle -->
    <header>
        <h1>Expense Tracker</h1>
        <button id="theme-toggle">🌙</button>
    </header>

    <!-- Total Balance Section -->
    <section id="balance-section">
        <h2>Total Spending</h2>
        <div id="total-balance">$0.00</div>
        <div id="limit-section">
            <label>Spending Limit: $</label>
            <input type="number" id="spending-limit" placeholder="Set limit">
        </div>
    </section>

    <!-- Input Form -->
    <section id="form-section">
        <form id="transaction-form">
            <input type="text" id="item-name" placeholder="Item Name" required>
            <input type="number" id="amount" placeholder="Amount" step="0.01" required>
            <select id="category" required>
                <option value="">Select Category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Fun">Fun</option>
            </select>
            <button type="submit">Add Transaction</button>
        </form>
    </section>

    <!-- Sort Options -->
    <section id="sort-section">
        <label>Sort by:</label>
        <button class="sort-btn" data-sort="date">Date</button>
        <button class="sort-btn" data-sort="amount">Amount</button>
        <button class="sort-btn" data-sort="category">Category</button>
    </section>

    <!-- Transaction List -->
    <section id="list-section">
        <h2>Transactions</h2>
        <div id="transaction-list">
            <!-- Transactions rendered here -->
        </div>
    </section>

    <!-- Pie Chart -->
    <section id="chart-section">
        <h2>Spending by Category</h2>
        <canvas id="pie-chart"></canvas>
    </section>

    <script src="js/app.js"></script>
</body>
</html>
```

---

## CSS Structure (css/style.css)

### Organization:
1. CSS Variables (for theming)
2. Reset/Base Styles
3. Layout (mobile-first, responsive)
4. Components (header, form, list, chart)
5. States (error, highlight, empty)
6. Dark Mode Overrides

### Key CSS Variables:
```css
:root {
    --bg-color: #f5f5f5;
    --text-color: #333;
    --card-bg: #ffffff;
    --primary-color: #4a90d9;
    --danger-color: #e74c3c;
    --border-color: #ddd;
}

[data-theme="dark"] {
    --bg-color: #1a1a2e;
    --text-color: #eaeaea;
    --card-bg: #16213e;
    --primary-color: #4a90d9;
    --danger-color: #e74c3c;
    --border-color: #333;
}
```

---

## JavaScript Structure (js/app.js)

### Organization:
1. Constants & State
2. DOM Element References
3. Data Layer Functions
4. Business Logic Functions
5. Rendering Functions
6. Event Handlers
7. Initialization (IIFE)

### Chart.js Integration:
```javascript
let pieChart = null;

function renderPieChart(transactions) {
    const grouped = groupByCategory(transactions);
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);
    
    if (pieChart) {
        pieChart.data.labels = labels;
        pieChart.data.datasets[0].data = data;
        pieChart.update();
    } else {
        pieChart = new Chart(document.getElementById('pie-chart'), {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}
```

---

## Data Flow Diagram

```
User Action
     │
     ▼
Event Handler (handleFormSubmit / handleDelete / etc.)
     │
     ├── Validate Input (if applicable)
     │
     ├── Update localStorage (addTransaction / deleteTransaction)
     │
     ▼
render()
     │
     ├── Load fresh data from localStorage
     │
     ├── Update Transaction List
     ├── Update Total Balance (with limit check)
     ├── Update Pie Chart
     │
     ▼
UI Reflects Current State
```

---

## Mobile-First Design Considerations

1. **Viewport Meta Tag:** Ensure proper scaling on mobile devices.
2. **Flexible Layouts:** Use percentages and `max-width` for containers.
3. **Touch-Friendly:** Minimum 44px tap targets for buttons.
4. **Readable Text:** Base font size of 16px to prevent iOS zoom on focus.
5. **Scrollable List:** Fixed height with `overflow-y: auto` for transaction list.
6. **Responsive Chart:** Chart.js configured with `responsive: true`.

---

## Browser Compatibility

| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| localStorage | ✓ | ✓ | ✓ | ✓ |
| ES6+ Syntax | ✓ | ✓ | ✓ | ✓ |
| Chart.js CDN | ✓ | ✓ | ✓ | ✓ |
| CSS Variables | ✓ | ✓ | ✓ | ✓ |
| Flexbox/Grid | ✓ | ✓ | ✓ | ✓ |

---

## Error Handling

1. **Form Validation:** Prevent submission if any field is empty; display inline error messages.
2. **localStorage Failures:** Wrap localStorage calls in try/catch; fallback to in-memory storage if quota exceeded.
3. **Invalid Data:** Filter out malformed entries when loading from localStorage.
4. **Chart Rendering:** Handle empty data gracefully (show empty state).

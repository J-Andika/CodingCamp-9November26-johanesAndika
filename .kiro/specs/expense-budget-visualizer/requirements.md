# Expense & Budget Visualizer — Requirements

## Overview
Mobile-friendly web app to track daily spending with balance tracking, transaction history, and spending visualization via pie chart.

**Tech Constraints:**
- HTML, CSS, Vanilla JavaScript only (no frameworks)
- No backend server, no build step
- Data persistence: browser localStorage only
- Must run in modern browsers (Chrome, Firefox, Edge, Safari)
- Exactly ONE CSS file in `css/`, ONE JavaScript file in `js/`
- Chart library: Chart.js via CDN

---

## MVP Features

### US-1: Add Transaction
**As a user, I want to add a new expense transaction so that I can track my spending.**

**Acceptance Criteria:**
1. When the user views the app, the system shall display an input form with three fields: Item Name (text), Amount (number), and Category (dropdown with options: Food, Transport, Fun).
2. When the user submits the form, the system shall validate that all three fields are filled; if any field is empty, the system shall display an error message and prevent submission.
3. When the user submits a valid form, the system shall create a transaction object with a unique ID, the provided name, amount, category, and a timestamp.
4. When a transaction is created, the system shall save it to localStorage and clear the form fields.
5. When a transaction is added, the system shall immediately update the transaction list, total balance, and pie chart.

### US-2: View Transaction List
**As a user, I want to view a list of all my transactions so that I can review my spending history.**

**Acceptance Criteria:**
1. When the user views the app, the system shall display a scrollable list of all transactions stored in localStorage.
2. When the transaction list is rendered, each item shall display the transaction name, amount, and category.
3. When there are no transactions, the system shall display an empty state message.
4. When a new transaction is added, the system shall append it to the list without a full page reload.
5. When a transaction is deleted, the system shall remove it from the list without a full page reload.

### US-3: Delete Transaction
**As a user, I want to delete a transaction so that I can remove incorrect entries.**

**Acceptance Criteria:**
1. When the user views a transaction in the list, the system shall display a delete button for that transaction.
2. When the user clicks the delete button, the system shall remove the transaction from localStorage.
3. When a transaction is deleted, the system shall immediately update the transaction list, total balance, and pie chart.

### US-4: View Total Balance
**As a user, I want to see my total spending balance so that I know how much I've spent in total.**

**Acceptance Criteria:**
1. When the user views the app, the system shall display the total balance at the top of the page.
2. When there are no transactions, the system shall display a total balance of 0.
3. When the total balance is calculated, the system shall sum the amount of all transactions.
4. When a transaction is added or deleted, the system shall immediately recalculate and display the updated total balance.

### US-5: View Spending Pie Chart
**As a user, I want to see a pie chart of my spending by category so that I can understand my spending distribution.**

**Acceptance Criteria:**
1. When the user views the app, the system shall display a pie chart showing spending distribution by category (Food, Transport, Fun).
2. When there are no transactions, the system shall display the pie chart with empty or zero values.
3. When the pie chart is rendered, the system shall use Chart.js to draw it.
4. When a transaction is added or deleted, the system shall immediately update the pie chart to reflect the new spending distribution.

---

## Optional Challenges

### US-6: Sort Transactions
**As a user, I want to sort my transactions by amount or category so that I can organize my spending view.**

**Acceptance Criteria:**
1. When the user views the transaction list, the system shall display sort options for "Amount" and "Category".
2. When the user selects "Amount", the system shall sort transactions by amount in descending order.
3. When the user selects "Category", the system shall sort transactions alphabetically by category name.
4. When a sort option is selected, the system shall re-render the transaction list in the chosen order.

### US-7: Spending Limit Highlight
**As a user, I want to set a spending limit and see highlights when I exceed it so that I can manage my budget.**

**Acceptance Criteria:**
1. When the user views the app, the system shall display an input field to set a spending limit.
2. When the user sets a spending limit, the system shall save it to localStorage.
3. When the total balance exceeds the spending limit, the system shall highlight the total balance in red.
4. When the total balance is at or below the spending limit, the system shall display the total balance in the default color.

### US-8: Dark/Light Mode Toggle
**As a user, I want to toggle between dark and light mode so that I can use the app comfortably in different lighting conditions.**

**Acceptance Criteria:**
1. When the user views the app, the system shall display a toggle button for dark/light mode.
2. When the user clicks the toggle, the system shall switch the app's color theme.
3. When the theme is changed, the system shall save the preference to localStorage.
4. When the app loads, the system shall apply the saved theme preference; if none exists, the system shall default to light mode.

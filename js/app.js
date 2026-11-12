/* ==========================================================================
   Expense & Budget Visualizer — single script (project constraint)
   Data lives in localStorage. One render() keeps every surface in sync.
   ========================================================================== */
'use strict';

/* --- Config --------------------------------------------------------------- */

const KEYS = {
  tx: 'transactions',
  limit: 'spendingLimit',
  theme: 'theme',
  sort: 'sortBy'
};

const CATEGORIES = ['Food', 'Transport', 'Fun'];

// Change these two lines to switch currency/copy.
const LOCALE = 'id-ID';
const CURRENCY = 'IDR';
const money = new Intl.NumberFormat(LOCALE, {
  style: 'currency',
  currency: CURRENCY,
  maximumFractionDigits: 0
});

/* --- Pure helpers (no DOM, no storage) ------------------------------------ */

function formatMoney(value) {
  return money.format(Number(value) || 0);
}

function calculateTotal(transactions) {
  return transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
}

function groupByCategory(transactions) {
  const out = {};
  for (const t of transactions) {
    const key = String(t.category || 'Other');
    out[key] = (out[key] || 0) + (Number(t.amount) || 0);
  }
  return out;
}

function sortTransactions(transactions, sortBy) {
  const copy = transactions.slice();
  if (sortBy === 'amount') return copy.sort((a, b) => b.amount - a.amount);
  if (sortBy === 'category') {
    return copy.sort((a, b) =>
      a.category.localeCompare(b.category) || b.createdAt.localeCompare(a.createdAt));
  }
  return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function isTransaction(value) {
  return value
    && typeof value.id === 'string'
    && typeof value.name === 'string'
    && Number.isFinite(value.amount) && value.amount > 0
    && CATEGORIES.includes(value.category)
    && typeof value.createdAt === 'string';
}

/* --- App (DOM + storage) -------------------------------------------------- */

function init() {
  const el = {
    total: document.getElementById('total-balance'),
    overNote: document.getElementById('over-note'),
    limitInput: document.getElementById('limit-input'),
    chartFrame: document.querySelector('.chart-frame'),
    chartLegend: document.getElementById('chart-legend'),
    form: document.getElementById('tx-form'),
    name: document.getElementById('item-name'),
    amount: document.getElementById('amount'),
    category: document.getElementById('category'),
    list: document.getElementById('tx-list'),
    empty: document.getElementById('tx-empty'),
    count: document.getElementById('tx-count'),
    sort: document.getElementById('sort-select'),
    themeBtn: document.getElementById('theme-toggle'),
    errors: {
      name: document.getElementById('err-name'),
      amount: document.getElementById('err-amount'),
      category: document.getElementById('err-category')
    }
  };

  let chart = null;

  /* Data layer ------------------------------------------------------------- */

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (err) {
      console.warn('localStorage read failed for', key, err);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn('localStorage write failed for', key, err);
      return false;
    }
  }

  function loadTransactions() {
    const raw = read(KEYS.tx, []);
    if (!Array.isArray(raw)) return [];
    const clean = raw.filter(isTransaction);
    if (clean.length !== raw.length) write(KEYS.tx, clean); // drop malformed rows once
    return clean;
  }

  const loadLimit = () => {
    const value = read(KEYS.limit, null);
    return Number.isFinite(value) && value > 0 ? value : null;
  };
  const loadSort = () => {
    const value = read(KEYS.sort, 'date');
    return ['date', 'amount', 'category'].includes(value) ? value : 'date';
  };
  const loadTheme = () => {
    const value = read(KEYS.theme, null);
    if (value === 'dark' || value === 'light') return value;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  /* Validation ------------------------------------------------------------- */

  function clearErrors() {
    for (const node of Object.values(el.errors)) {
      node.hidden = true;
      node.textContent = '';
    }
    el.name.removeAttribute('aria-invalid');
    el.amount.removeAttribute('aria-invalid');
    el.category.removeAttribute('aria-invalid');
  }

  function setError(field, message) {
    el.errors[field].textContent = message;
    el.errors[field].hidden = false;
    el[field].setAttribute('aria-invalid', 'true');
  }

  function validate(data) {
    clearErrors();
    let ok = true;
    if (!data.name.trim()) { setError('name', 'Item name is required.'); ok = false; }
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      setError('amount', 'Enter an amount greater than 0.'); ok = false;
    }
    if (!CATEGORIES.includes(data.category)) {
      setError('category', 'Pick a category.'); ok = false;
    }
    if (!ok) {
      const firstBad = Object.keys(el.errors)
        .find((key) => !el.errors[key].hidden);
      if (firstBad) el[firstBad].focus();
    }
    return ok;
  }

  /* Theme ------------------------------------------------------------------ */

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    el.themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    el.themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
    if (chart) {
      chart.options.plugins.legend.labels.color = cssVar('--ink-2');
      chart.update('none');
    }
  }

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /* Rendering -------------------------------------------------------------- */

  function renderLedger(transactions, sortBy) {
    const sorted = sortTransactions(transactions, sortBy);

    el.list.textContent = '';
    for (const t of sorted) {
      const li = document.createElement('li');
      li.className = 'tx';
      li.dataset.id = t.id;

      const name = document.createElement('span');
      name.className = 'tx-name';
      name.textContent = t.name;

      const sub = document.createElement('span');
      sub.className = 'tx-sub';

      const cat = document.createElement('span');
      cat.className = 'tx-cat tx-cat-' + t.category.toLowerCase();
      const dot = document.createElement('span');
      dot.className = 'tx-dot';
      dot.setAttribute('aria-hidden', 'true');
      cat.append(dot, document.createTextNode(t.category));

      const when = document.createElement('time');
      when.dateTime = t.createdAt;
      when.textContent = new Date(t.createdAt).toLocaleDateString(LOCALE, {
        day: '2-digit', month: 'short'
      });

      sub.append(cat, document.createTextNode(' \u00b7 '), when);

      const amount = document.createElement('span');
      amount.className = 'tx-amount';
      amount.textContent = formatMoney(t.amount);

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'tx-del';
      del.dataset.action = 'delete';
      del.setAttribute('aria-label', 'Delete ' + t.name);
      del.textContent = '\u00d7';

      li.append(name, sub, amount, del);
      el.list.append(li);
    }

    el.empty.hidden = sorted.length > 0;
    el.count.textContent = sorted.length === 1 ? '1 entry' : sorted.length + ' entries';
  }

  function renderTotal(total, limit) {
    el.total.textContent = formatMoney(total);

    const over = limit !== null && limit > 0 && total > limit;
    el.total.classList.toggle('is-over', over);
    el.overNote.hidden = !over;
    if (over) {
      el.overNote.textContent = 'Over limit by ' + formatMoney(total - limit) + '.';
    }
  }

  /** Legend doubles as the data table: label, amount, share. */
  function renderLegend(labels, data, total) {
    el.chartLegend.textContent = '';
    labels.forEach((label, i) => {
      const li = document.createElement('li');
      li.className = 'legend-row';

      const dot = document.createElement('span');
      dot.className = 'legend-dot tx-cat-' + label.toLowerCase();

      const name = document.createElement('span');
      name.className = 'legend-name';
      name.textContent = label;

      const bar = document.createElement('span');
      bar.className = 'legend-bar';
      const share = document.createElement('span');
      share.className = 'legend-fill tx-cat-bg-' + label.toLowerCase();
      share.style.width = (total > 0 ? (data[i] / total) * 100 : 0) + '%';
      bar.append(share);

      const value = document.createElement('span');
      value.className = 'legend-value';
      value.textContent = formatMoney(data[i]);

      li.append(dot, name, bar, value);
      el.chartLegend.append(li);
    });
  }

  function renderChart(transactions, total) {
    const grouped = groupByCategory(transactions);
    const labels = Object.keys(grouped);
    const data = labels.map((key) => grouped[key]);
    const hasData = data.some((value) => value > 0);

    el.chartFrame.classList.toggle('is-empty', !hasData);
    renderLegend(labels, data, total);

    if (!hasData) {
      if (chart) chart.data.datasets[0].data = [];
      if (chart) chart.update('none');
      return;
    }

    const palette = labels.map((label) => {
      const key = '--cat-' + label.toLowerCase();
      return cssVar(key) || cssVar('--accent');
    });

    if (chart) {
      chart.data.labels = labels;
      chart.data.datasets[0].data = data;
      chart.data.datasets[0].backgroundColor = palette;
      chart.options.plugins.legend.labels.color = cssVar('--ink-2');
      chart.update();
      return;
    }

    chart = new Chart(document.getElementById('pie-chart'), {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: palette,
          borderColor: cssVar('--surface'),
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '62%',
        animation: { duration: 240 },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => ' ' + ctx.label + ': ' + formatMoney(ctx.parsed)
            }
          }
        }
      }
    });
  }

  /** Single source of truth: every data change ends here. */
  function render() {
    const transactions = loadTransactions();
    const total = calculateTotal(transactions);
    renderLedger(transactions, loadSort());
    renderTotal(total, loadLimit());
    renderChart(transactions, total);
  }

  /* Events ----------------------------------------------------------------- */

  el.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = {
      name: el.name.value,
      amount: Number(el.amount.value),
      category: el.category.value
    };
    if (!validate(data)) return;

    const transactions = loadTransactions();
    transactions.push({
      id: newId(),
      name: data.name.trim(),
      amount: data.amount,
      category: data.category,
      createdAt: new Date().toISOString()
    });
    write(KEYS.tx, transactions);

    el.form.reset();
    clearErrors();
    el.name.focus();
    render();
  });

  el.list.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="delete"]');
    if (!button) return;
    const id = button.closest('.tx').dataset.id;
    write(KEYS.tx, loadTransactions().filter((t) => t.id !== id));
    render();
  });

  el.sort.addEventListener('change', () => {
    write(KEYS.sort, el.sort.value);
    render();
  });

  // Accepts "250 000", "250.000", "Rp250000" — stores the bare number.
  function parseLimitInput(raw) {
    const digits = String(raw).replace(/[^0-9]/g, '');
    const value = digits ? Number(digits) : NaN;
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  function paintLimitInput(value) {
    el.limitInput.value = value === null ? '' : new Intl.NumberFormat(LOCALE).format(value);
  }

  el.limitInput.addEventListener('input', () => {
    write(KEYS.limit, parseLimitInput(el.limitInput.value));
    renderTotal(calculateTotal(loadTransactions()), loadLimit());
  });

  el.limitInput.addEventListener('blur', () => paintLimitInput(loadLimit()));

  el.themeBtn.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    write(KEYS.theme, next);
    applyTheme(next);
  });

  // Live-update the chart colours when the OS theme flips and no manual choice is saved.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (read(KEYS.theme, null) === null) applyTheme(loadTheme());
  });

  /* Boot ------------------------------------------------------------------- */

  applyTheme(loadTheme());
  el.sort.value = loadSort();
  paintLimitInput(loadLimit());
  render();
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

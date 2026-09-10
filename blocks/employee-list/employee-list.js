import { toCamelCase } from '../../scripts/aem.js';

const PAGE_SIZE = 10;

/**
 * Fetch the placeholders sheet and return a map keyed by camelCased Key.
 * e.g. a row  Key="load-more"  Text="Load More"  ->  { loadMore: 'Load More' }
 * Mirrors the standard EDS placeholders convention.
 */
async function fetchPlaceholders() {
  try {
    const resp = await fetch('/placeholders.json');
    if (!resp.ok) return {};
    const json = await resp.json();
    const placeholders = {};
    (json.data || [])
      .filter((row) => row.Key)
      .forEach((row) => { placeholders[toCamelCase(row.Key)] = row.Text; });
    return placeholders;
  } catch {
    return {};
  }
}

export default async function decorate(block) {
  // The spreadsheet path is authored inside the block (a link or plain text).
  // Falls back to /data/employees if nothing is authored.
  const link = block.querySelector('a');
  const path = (link ? link.getAttribute('href') : block.textContent.trim()) || '/data/employees';

  block.textContent = '';

  // Fetch the employee data and the placeholders in parallel
  const [placeholders, resp] = await Promise.all([
    fetchPlaceholders(),
    fetch(`${path}.json`),
  ]);

  if (!resp.ok) {
    block.innerHTML = '<p>Unable to load employees.</p>';
    return;
  }

  const json = await resp.json();
  const employees = json.data || [];

  // Container for the rendered employee cards
  const list = document.createElement('ul');
  list.className = 'employee-list-items';
  block.append(list);

  let shown = 0;

  // Render the next PAGE_SIZE employees, appending to the list
  const renderNext = () => {
    employees.slice(shown, shown + PAGE_SIZE).forEach((emp) => {
      const li = document.createElement('li');
      li.className = 'employee-card';

      const name = document.createElement('h3');
      name.className = 'employee-name';
      name.textContent = emp.Name || '';
      li.append(name);

      const dl = document.createElement('dl');
      dl.className = 'employee-meta';
      [
        ['Department', emp.Department],
        ['Experience', emp.Experience],
        ['City', emp.City],
      ].forEach(([label, value]) => {
        const row = document.createElement('div');
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = value || '';
        row.append(dt, dd);
        dl.append(row);
      });
      li.append(dl);

      list.append(li);
    });
    shown += Math.min(PAGE_SIZE, employees.length - shown);
  };

  // "Load more" button — label sourced from the placeholders sheet
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'employee-list-loadmore';
  button.textContent = placeholders.loadMore || 'Load more';
  block.append(button);

  // Hide the button once every employee is shown
  const updateButton = () => {
    if (shown >= employees.length) button.remove();
  };

  button.addEventListener('click', () => {
    renderNext();
    updateButton();
  });

  // Initial page
  renderNext();
  updateButton();
}

import { readBlockConfig } from '../../scripts/aem.js';

/*
 * Page List Block
 * Fetches the site's query-index.json and renders every published page as a
 * card (image + title + description) linking to that page.
 *
 * Because it reads the LIVE index at runtime, publishing a new page makes it
 * appear here automatically — no code change needed.
 *
 * Authoring:
 *   | page-list |
 *   | path | /query-index.json |
 * (the "path" row is optional; it defaults to /query-index.json)
 */
export default async function decorate(block) {
  // Read the authored config (e.g. { path: '/query-index.json' })
  const { path = '/query-index.json' } = readBlockConfig(block);
  block.textContent = '';

  let data = [];
  try {
    const resp = await fetch(path);
    if (!resp.ok) throw new Error(`index fetch failed: ${resp.status}`);
    ({ data } = await resp.json());
  } catch {
    block.innerHTML = '<p>Unable to load the page list.</p>';
    return;
  }

  const list = document.createElement('ul');
  list.className = 'page-list-items';

  data
    // don't list the page the block is currently on
    .filter((page) => page.path !== window.location.pathname)
    .forEach((page) => {
      const li = document.createElement('li');
      li.className = 'page-list-card';

      // Whole card is a link to the page
      const link = document.createElement('a');
      link.href = page.path;
      link.className = 'page-list-link';

      // Image (the index already stores an optimized image path)
      if (page.image) {
        const imgWrap = document.createElement('div');
        imgWrap.className = 'page-list-image';
        const img = document.createElement('img');
        img.src = page.image;
        img.alt = page.title || '';
        img.loading = 'lazy';
        imgWrap.append(img);
        link.append(imgWrap);
      }

      // Text body
      const body = document.createElement('div');
      body.className = 'page-list-body';

      const title = document.createElement('h3');
      title.className = 'page-list-title';
      title.textContent = page.title || page.path;
      body.append(title);

      if (page.description) {
        const desc = document.createElement('p');
        desc.className = 'page-list-desc';
        desc.textContent = page.description;
        body.append(desc);
      }

      link.append(body);
      li.append(link);
      list.append(li);
    });

  block.append(list);
}

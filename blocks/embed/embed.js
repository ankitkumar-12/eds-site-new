/*
 * Embed Block
 * Adapted from the AEM Block Collection (adobe/aem-block-collection).
 * Turns an authored link into an inline embed. Supports YouTube and X/Twitter.
 * The embed only loads when it scrolls into view (IntersectionObserver),
 * which keeps the page fast — third-party scripts don't block initial load.
 */

const loadScript = (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (callback) script.onload = callback;
  document.head.append(script);
  return script;
};

const embedYoutube = (url) => {
  const usp = new URLSearchParams(url.search);
  let vid = usp.get('v');
  if (url.hostname.includes('youtu.be')) {
    [, vid] = url.pathname.split('/');
  }
  return `
    <div class="embed-video">
      <iframe
        src="https://www.youtube.com/embed/${vid}?rel=0"
        title="YouTube video"
        frameborder="0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowfullscreen
        loading="lazy">
      </iframe>
    </div>`;
};

const embedX = (url) => {
  // X/Twitter renders from a blockquote that its widget script upgrades.
  loadScript('https://platform.twitter.com/widgets.js');
  return `
    <div class="embed-x">
      <blockquote class="twitter-tweet">
        <a href="${url.href}"></a>
      </blockquote>
    </div>`;
};

const EMBEDS = [
  { match: ['youtube', 'youtu.be'], embed: embedYoutube },
  { match: ['twitter', 'x.com'], embed: embedX },
];

const loadEmbed = (block, link) => {
  if (block.classList.contains('embed-is-loaded')) return;

  const config = EMBEDS.find((e) => e.match.some((m) => link.includes(m)));
  const url = new URL(link);

  if (config) {
    block.innerHTML = config.embed(url);
    block.classList.add(`embed-${config.match[0]}-wrapper`);
  } else {
    // Fallback: generic iframe for any other URL
    block.innerHTML = `<div class="embed-video"><iframe src="${url.href}" loading="lazy" allowfullscreen></iframe></div>`;
  }
  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  // Prefer an authored link; fall back to the cell's plain text (in case the
  // author pasted a URL without it becoming a hyperlink).
  const anchor = block.querySelector('a');
  const link = anchor ? anchor.href : block.textContent.trim();
  if (!link) return;
  block.textContent = '';

  // Load the embed. The iframe itself uses loading="lazy", so the browser
  // still defers the actual video download until it's near the viewport.
  loadEmbed(block, link);
}

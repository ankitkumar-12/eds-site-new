/*
 * Accordion Block
 * Adapted from the AEM Block Collection (adobe/aem-block-collection).
 * Each authored row becomes one collapsible item:
 *   - cell 1 = the label (summary / clickable heading)
 *   - cell 2 = the body (revealed when open)
 * Uses native <details>/<summary> so it works with keyboard + screen readers
 * for free, with no custom click handlers needed.
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    // First cell = the label the user clicks
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);

    // Second cell = the body revealed on open
    const body = row.children[1];
    body.className = 'accordion-item-body';

    // Wrap both in a native <details> element
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);

    row.replaceWith(details);
  });
}

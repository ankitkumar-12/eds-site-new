export default function decorate(block) {
  const rows = [...block.children];

  // Row 1 = Image
  // Row 2 = Title
  // Row 3 = Optional background color (ignored for the dark variant)

  const imageCell = rows[0]?.querySelector('div');
  const titleCell = rows[1]?.querySelector('div');
  const colorCell = rows[2]?.querySelector('div');

  const title = titleCell?.textContent.trim() || '';
  const authoredColor = colorCell?.textContent.trim();

  // Grab the image (picture preferred, plain img as fallback)
  const picture = imageCell?.querySelector('picture');
  const image = imageCell?.querySelector('img');

  // Rebuild the block markup from scratch
  block.innerHTML = '';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'banner-image';
  if (picture) {
    imageWrapper.append(picture);
  } else if (image) {
    imageWrapper.append(image);
  }

  const titleElement = document.createElement('h2');
  titleElement.className = 'banner-title';
  titleElement.textContent = title;

  block.append(imageWrapper, titleElement);

  // Default banner: apply the authored colour, or fall back to blue.
  // The dark variant (class "dark") is styled entirely in CSS, so skip it here.
  if (!block.classList.contains('dark')) {
    block.style.backgroundColor = authoredColor || '#5e9fc2';
  }
}

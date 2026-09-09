export default function decorate(block) {
  const rows = [...block.children];

  // Row 1 = Image
  // Row 2 = Title
  // Row 3 = Optional background color

  const imageCell = rows[0]?.querySelector('div');
  const titleCell = rows[1]?.querySelector('div');
  const colorCell = rows[2]?.querySelector('div');

  const title = titleCell?.textContent.trim();
  const backgroundColor = colorCell?.textContent.trim() || '#658fa5';

  // Get the image
  const picture = imageCell?.querySelector('picture');
  const image = imageCell?.querySelector('img');

  // Clear original authored content
  block.innerHTML = '';

  // Create image area
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'banner-image';

  if (picture) {
    imageWrapper.append(picture);
  } else if (image) {
    imageWrapper.append(image);
  }

  // Create title
  const titleElement = document.createElement('h2');
  titleElement.className = 'banner-title';
  titleElement.textContent = title;

  // Add content to banner
  block.append(imageWrapper);
  block.append(titleElement);

  // Apply background color
  if (!block.classList.contains('banner')) {
  block.style.backgroundColor = backgroundColor;
}
}
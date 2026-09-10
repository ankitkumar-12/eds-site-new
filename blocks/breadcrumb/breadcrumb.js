export default function decorate(block) {
  const ul = document.createElement('ul');

  // Get the current page path
  const path = window.location.pathname
    .replace(/\/$/, '')
    .split('/')
    .filter(Boolean);

  const trail = [
    {
      text: 'Home',
      link: '/',
    },
  ];

  let currentPath = '';

  path.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Get the page title for the last breadcrumb
    const metaTitle = document.querySelector('meta[property="og:title"]')?.content;
    const text = index === path.length - 1
      ? metaTitle || document.title || segment
      : segment.replace(/-/g, ' ');

    trail.push({
      text,
      link: index === path.length - 1 ? null : currentPath,
    });
  });

  trail.forEach((step) => {
    const li = document.createElement('li');

    let wrapper = li;

    if (step.link) {
      wrapper = document.createElement('a');
      wrapper.href = step.link;
      li.append(wrapper);
    }

    const span = document.createElement('span');
    span.textContent = step.text;
    wrapper.append(span);

    ul.append(li);
  });

  block.append(ul);
}
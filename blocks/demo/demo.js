export default function decorate(block) {
  const picture = block.querySelector('picture');
  const rows = [...block.children];

  const textContent = rows
    .filter((row) => !row.querySelector('picture'))
    .map((row) => row.textContent.trim())
    .filter(Boolean);

  const [title, ...descParts] = textContent;

  const wrapper = document.createElement('div');
  wrapper.className = 'demo-content';

  if (picture) {
    const imageContainer = document.createElement('div');
    imageContainer.className = 'demo-image';
    imageContainer.append(picture);
    wrapper.append(imageContainer);
  }

  const body = document.createElement('div');
  body.className = 'demo-body';

  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title;
    body.append(h2);
  }

  if (descParts.length) {
    const p = document.createElement('p');
    p.textContent = descParts.join(' ');
    body.append(p);
  }

  wrapper.append(body);
  block.replaceChildren(wrapper);
}

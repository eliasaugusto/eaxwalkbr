export default function decorate(block) {
  const rows = [...block.children];

  // Row 0: image (reference + imageAlt collapsed)
  const picture = rows[0]?.querySelector('picture');

  // Row 1: title (text field — plain text, no semantic HTML)
  const titleText = rows[1]?.textContent?.trim();

  // Row 2: description (richtext field — HTML preserved)
  const descriptionDiv = rows[2]?.querySelector('div');

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

  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    body.append(h2);
  }

  if (descriptionDiv?.innerHTML?.trim()) {
    const desc = document.createElement('div');
    desc.className = 'demo-description';
    desc.innerHTML = descriptionDiv.innerHTML;
    body.append(desc);
  }

  wrapper.append(body);
  block.replaceChildren(wrapper);
}

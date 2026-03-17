export default function decorate(block) {
  const picture = block.querySelector('picture');
  const rows = [...block.children];

  const textContent = [];
  rows.forEach((row) => {
    if (!row.querySelector('picture') && row.textContent.trim()) {
      textContent.push(row.textContent.trim());
    }
  });

  const imageDiv = document.createElement('div');
  imageDiv.className = 'demo-image';
  if (picture) imageDiv.append(picture);

  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'demo-body';

  const [title, description] = textContent;

  if (title) {
    const h2 = document.createElement('h2');
    h2.textContent = title;
    bodyDiv.append(h2);
  }

  if (description) {
    const p = document.createElement('p');
    p.textContent = description;
    bodyDiv.append(p);
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'demo-content';
  wrapper.append(imageDiv, bodyDiv);
  block.replaceChildren(wrapper);
}

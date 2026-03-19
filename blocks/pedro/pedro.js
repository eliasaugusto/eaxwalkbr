import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * @param {Element} block The pedro block element
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: image (reference + alt collapsed into one row)
  const picture = rows[0]?.querySelector('picture');

  // Row 1: title (text field — plain text)
  const titleText = rows[1]?.textContent?.trim();

  // Row 2: description (richtext field — HTML preserved)
  const descriptionHTML = rows[2]?.querySelector('div')?.innerHTML;

  // Build semantic structure
  const content = document.createElement('div');
  content.className = 'pedro-content';

  const body = document.createElement('div');
  body.className = 'pedro-body';

  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    body.append(h2);
  }

  if (descriptionHTML) {
    const desc = document.createElement('div');
    desc.className = 'pedro-description';
    desc.innerHTML = descriptionHTML;
    body.append(desc);
  }

  content.append(body);

  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'pedro-image';
    moveInstrumentation(rows[0], imageWrapper);
    imageWrapper.append(picture);
    content.append(imageWrapper);
  }

  block.replaceChildren(content);
}

import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // model field order: image[0], title[1], text[2]
  const [imageRow, titleRow, textRow] = [...block.children];

  const picture = imageRow?.firstElementChild?.querySelector('picture');
  const titleText = titleRow?.firstElementChild?.textContent?.trim();
  const textContent = textRow?.firstElementChild;

  const imageEl = document.createElement('div');
  imageEl.className = 'demo-image';
  moveInstrumentation(imageRow, imageEl);
  if (picture) {
    const img = picture.querySelector('img');
    const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    imageEl.append(optimizedPic);
  }

  const contentEl = document.createElement('div');
  contentEl.className = 'demo-content';

  if (titleText) {
    const h2 = document.createElement('h2');
    moveInstrumentation(titleRow, h2);
    h2.textContent = titleText;
    contentEl.append(h2);
  }

  if (textContent) {
    const textEl = document.createElement('div');
    textEl.className = 'demo-text';
    moveInstrumentation(textRow, textEl);
    textEl.replaceChildren(...textContent.childNodes);
    contentEl.append(textEl);
  }

  block.replaceChildren(imageEl, contentEl);
}

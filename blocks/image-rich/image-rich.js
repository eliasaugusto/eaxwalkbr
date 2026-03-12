import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cols = [...row.children];
    if (!cols.length) return;

    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const imageCol = cols[0];
    const richTextCol = cols[1];
    const textCol = cols[2];

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-rich-image';

    const picture = imageCol.querySelector('picture');
    const img = picture?.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      imageWrapper.append(optimizedPic);
    }

    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'image-rich-content';

    if (richTextCol) {
      const richTextWrapper = document.createElement('div');
      richTextWrapper.className = 'image-rich-richtext';
      while (richTextCol.firstElementChild) {
        richTextWrapper.append(richTextCol.firstElementChild);
      }

      if (!richTextWrapper.textContent.trim()) {
        richTextWrapper.textContent = richTextCol.textContent.trim();
      }

      contentWrapper.append(richTextWrapper);
    }

    if (textCol) {
      const text = document.createElement('p');
      text.className = 'image-rich-text';
      text.textContent = textCol.textContent.trim();

      if (text.textContent) {
        contentWrapper.append(text);
      }
    }

    li.append(imageWrapper, contentWrapper);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

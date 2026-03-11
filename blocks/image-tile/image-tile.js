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
    const titleCol = cols[1] || cols[0];

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-tile-image';

    const picture = imageCol.querySelector('picture');
    const img = picture?.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
      moveInstrumentation(img, optimized.querySelector('img'));
      imageWrapper.append(optimized);
    }

    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'image-tile-title';

    const heading = titleCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      titleWrapper.append(heading);
    } else {
      const title = document.createElement('h3');
      title.textContent = titleCol.textContent.trim();
      titleWrapper.append(title);
    }

    li.append(imageWrapper, titleWrapper);
    ul.append(li);
  });

  block.replaceChildren(ul);
}

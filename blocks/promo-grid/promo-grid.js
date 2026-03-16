import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

const FIELDS_PER_ITEM = 4;

function buildItems(rows) {
  const oneColRows = rows.every((row) => row.children.length <= 1);

  if (oneColRows && rows.length >= FIELDS_PER_ITEM) {
    const items = [];

    for (let i = 0; i < rows.length; i += FIELDS_PER_ITEM) {
      const chunk = rows.slice(i, i + FIELDS_PER_ITEM);
      if (chunk.length < FIELDS_PER_ITEM) break;

      items.push({
        sourceRow: chunk[0],
        cols: chunk.map((row) => row.children[0] || row),
      });
    }

    return items;
  }

  return rows.map((row) => ({
    sourceRow: row,
    cols: [...row.children],
  }));
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  const items = buildItems([...block.children]);

  items.forEach(({ sourceRow, cols }) => {
    const li = document.createElement('li');
    moveInstrumentation(sourceRow, li);

    cols.forEach((col) => li.append(col));

    [...li.children].forEach((col, index) => {
      if (col.children.length === 1 && col.querySelector('picture')) {
        col.className = 'promo-grid-card-image';
      } else {
        col.className = `promo-grid-card-col-${index + 1}`;
      }
    });

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}

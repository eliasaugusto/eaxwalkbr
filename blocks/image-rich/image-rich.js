import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildItems(rows) {
  const oneColRows = rows.every((row) => row.children.length <= 1);

  if (oneColRows && rows.length >= 3) {
    const items = [];

    for (let i = 0; i < rows.length; i += 3) {
      items.push({
        sourceRow: rows[i],
        imageCol: rows[i]?.children[0],
        richTextCol: rows[i + 1]?.children[0],
        textCol: rows[i + 2]?.children[0],
      });
    }

    return items;
  }

  return rows.map((row) => ({
    sourceRow: row,
    imageCol: row.children[0],
    richTextCol: row.children[1],
    textCol: row.children[2],
  }));
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  const rows = [...block.children];
  const items = buildItems(rows);

  items.forEach((item) => {
    const {
      sourceRow, imageCol, richTextCol, textCol,
    } = item;

    const li = document.createElement('li');
    if (sourceRow) moveInstrumentation(sourceRow, li);

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-rich-image';

    const picture = imageCol?.querySelector('picture');
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

    if (imageWrapper.childElementCount || contentWrapper.textContent.trim()) {
      li.append(imageWrapper, contentWrapper);
      ul.append(li);
    }
  });

  block.replaceChildren(ul);
}

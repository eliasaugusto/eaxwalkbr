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
        titleCol: rows[i + 1]?.children[0],
        textCol: rows[i + 2]?.children[0],
      });
    }

    return items;
  }

  return rows.map((row) => ({
    sourceRow: row,
    imageCol: row.children[0],
    titleCol: row.children[1],
    textCol: row.children[2],
  }));
}

function buildMedia(imageCol) {
  const media = document.createElement('div');
  media.className = 'demo-media';

  const picture = imageCol?.querySelector('picture');
  const img = picture?.querySelector('img');

  if (!img) return media;

  const optimizedPic = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1200' }]);
  moveInstrumentation(img, optimizedPic.querySelector('img'));
  media.append(optimizedPic);

  return media;
}

function buildContent(titleCol, textCol) {
  const content = document.createElement('div');
  content.className = 'demo-content';

  if (titleCol) {
    const title = document.createElement('div');
    title.className = 'demo-title';

    while (titleCol.firstElementChild) {
      title.append(titleCol.firstElementChild);
    }

    if (!title.textContent.trim()) {
      title.textContent = titleCol.textContent.trim();
    }

    if (title.textContent.trim()) {
      content.append(title);
    }
  }

  if (textCol) {
    const text = document.createElement('div');
    text.className = 'demo-text';

    while (textCol.firstElementChild) {
      text.append(textCol.firstElementChild);
    }

    if (!text.textContent.trim()) {
      text.textContent = textCol.textContent.trim();
    }

    if (text.textContent.trim()) {
      content.append(text);
    }
  }

  return content;
}

export default function decorate(block) {
  const rows = [...block.children];
  const items = buildItems(rows);

  const builtItems = items.map((item) => {
    const {
      sourceRow, imageCol, titleCol, textCol,
    } = item;

    const article = document.createElement('article');
    article.className = 'demo-item';
    if (sourceRow) moveInstrumentation(sourceRow, article);

    const media = buildMedia(imageCol);
    const content = buildContent(titleCol, textCol);

    if (media.childElementCount) article.append(media);
    if (content.childElementCount) article.append(content);

    return article;
  }).filter((article) => article.childElementCount > 0);

  block.replaceChildren(...builtItems);
}

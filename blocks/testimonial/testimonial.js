import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const li = document.createElement('li');
    const quote = document.createElement('blockquote');

    moveInstrumentation(row, li);

    const quoteCol = cols[0] || row;
    while (quoteCol.firstElementChild) {
      quote.append(quoteCol.firstElementChild);
    }

    if (!quote.textContent.trim()) {
      quote.textContent = quoteCol.textContent.trim();
      quoteCol.textContent = '';
    }

    li.append(quote);

    const authorCol = cols[1];
    if (authorCol) {
      const cite = document.createElement('cite');
      while (authorCol.firstElementChild) {
        cite.append(authorCol.firstElementChild);
      }

      if (!cite.textContent.trim()) {
        cite.textContent = authorCol.textContent.trim();
      }

      if (cite.textContent.trim()) li.append(cite);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}

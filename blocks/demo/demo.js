export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  cols.forEach((col) => {
    if (col.children.length === 1 && col.querySelector('picture')) {
      col.className = 'demo-image';
    } else {
      col.className = 'demo-body';
    }
  });
}

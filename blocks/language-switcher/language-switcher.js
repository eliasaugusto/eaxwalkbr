import { getLanguagePrefix } from '../../scripts/scripts.js';

/**
 * Builds the language URL by replacing the current prefix with the target prefix.
 * @param {string} targetPrefix The target language prefix (e.g., '/en-us')
 * @returns {string} The full URL for the target language
 */
function getLanguageUrl(targetPrefix) {
  const currentPrefix = getLanguagePrefix();
  const { pathname } = window.location;
  const pathWithoutPrefix = currentPrefix
    ? pathname.substring(currentPrefix.length)
    : pathname;
  return `${targetPrefix}${pathWithoutPrefix}`;
}

/**
 * @param {Element} block The language-switcher block element
 */
export default async function decorate(block) {
  // Skip decoration in Universal Editor to preserve authoring instrumentation
  if (window.location.origin.includes('.aem.live/universal-editor')
    || document.querySelector('html[data-aue-edit]')) {
    return;
  }

  const currentPrefix = getLanguagePrefix();
  const items = [...block.children];

  // Parse language items from the block rows
  const languages = items.map((item) => {
    const cols = [...item.children];
    const label = cols[0]?.textContent?.trim();
    const link = cols[1]?.querySelector('a');
    const prefix = link ? new URL(link.href, window.location).pathname.replace(/\/$/, '') : cols[1]?.textContent?.trim();
    return { label, prefix };
  }).filter(({ label, prefix }) => label && prefix);

  // Build dropdown
  const wrapper = document.createElement('div');
  wrapper.className = 'language-switcher-wrapper';

  const button = document.createElement('button');
  button.className = 'language-switcher-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-haspopup', 'listbox');

  // Find current language label
  const currentLang = languages.find((lang) => lang.prefix === currentPrefix);
  button.textContent = currentLang ? currentLang.label : languages[0]?.label || 'Language';

  const list = document.createElement('ul');
  list.className = 'language-switcher-list';
  list.setAttribute('role', 'listbox');

  languages.forEach((lang) => {
    const li = document.createElement('li');
    li.setAttribute('role', 'option');
    const isCurrent = lang.prefix === currentPrefix;
    if (isCurrent) {
      li.setAttribute('aria-selected', 'true');
      li.classList.add('active');
    }
    const a = document.createElement('a');
    a.href = getLanguageUrl(lang.prefix);
    a.textContent = lang.label;
    li.append(a);
    list.append(li);
  });

  // Toggle dropdown
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) {
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape
  wrapper.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      button.setAttribute('aria-expanded', 'false');
      button.focus();
    }
  });

  wrapper.append(button, list);
  block.replaceChildren(wrapper);
}

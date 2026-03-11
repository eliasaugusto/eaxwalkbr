# Build Component Guide

A practical guide to creating a new block in this AEM XWalk/EDS project.

## 1) Prerequisites

- Node.js installed
- Dependencies installed

```sh
npm i
```

## 2) Minimum Block Structure

Each block should include:

- `blocks/<name>/<name>.js` (decorate logic)
- `blocks/<name>/<name>.css` (styles)
- `blocks/<name>/_<name>.json` (definitions/models/filters)

Example:

```text
blocks/
  testimonial/
    _testimonial.json
    testimonial.css
    testimonial.js
```

## 3) Block JS

In `<name>.js`, export `decorate(block)`.

```js
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
```

## 4) Block CSS

Use the block class namespace to avoid global style conflicts.

```css
.testimonial > ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.testimonial > ul > li {
  border: 1px solid #dadada;
  padding: 16px;
  background-color: var(--background-color);
}
```

## 5) Authoring JSON (_<name>.json)

The file should declare:

- `definitions`: items shown in the editor component palette
- `models`: editable fields
- `filters`: internal composition rules (when applicable)

Recommended pattern for item-based blocks (same behavior as cards/testimonial):

```json
{
  "definitions": [
    {
      "title": "Testimonial",
      "id": "testimonial",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Testimonial",
              "filter": "testimonials"
            }
          }
        }
      }
    },
    {
      "title": "Testimonial Item",
      "id": "testimonial-item",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block/item",
            "template": {
              "name": "Testimonial Item",
              "model": "testimonial-item"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "testimonial-item",
      "fields": [
        {
          "component": "richtext",
          "name": "quote",
          "label": "Quote",
          "valueType": "string",
          "value": ""
        },
        {
          "component": "text",
          "name": "author",
          "label": "Author",
          "valueType": "string"
        }
      ]
    }
  ],
  "filters": [
    {
      "id": "testimonials",
      "components": [
        "testimonial-item"
      ]
    }
  ]
}
```

Important rule:

- `section` must reference the block `id` (`testimonial`), not the internal filter id (`testimonials`).

## 6) Update Section Composition

Ensure the block is allowed in the `section` filter in `models/_section.json`:

```json
{
  "id": "section",
  "components": ["text", "image", "button", "title", "hero", "cards", "columns", "fragment", "testimonial"]
}
```

## 7) Generate Consolidated JSON

Edit source files and regenerate consolidated outputs:

```sh
npm run build:json
```

Generated files:

- `component-definition.json`
- `component-models.json`
- `component-filters.json`

## 8) Technical Validation

```sh
npm run lint
```

If needed:

```sh
npm run lint:fix
```

## 9) Functional Validation in EDS

In EDS, the final HTML depends on authoring. Therefore:

- Local validation helps with decorate logic and CSS
- Final validation must happen in Author/Preview

Recommended flow:

1. Run local proxy for quick iteration.
2. Push changes and wait for content/code sync.
3. Open Universal Editor.
4. Insert the block inside a Section.
5. Validate rendering, responsiveness, and accessibility in preview.

## 10) Quick Checklist

- Block folder created in `blocks/<name>`
- `export default function decorate(block)` implemented
- CSS scoped with the block namespace
- `_<name>.json` includes `definitions/models/filters`
- `models/_section.json` allows the block
- `npm run build:json` executed
- `npm run lint` passes without errors
- Block is visible in the editor and can be inserted into a Section

## Common Pitfalls

- Editing `component-*.json` directly (build will overwrite)
- Forgetting to run `npm run build:json`
- Pointing `section` to an internal filter instead of the block id
- ID mismatch across `definitions`, `models`, and `filters`
- Assuming local validation replaces Author/Preview validation
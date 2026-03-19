---
name: crosswalk-development
description: Project-specific skill for AEM Edge Delivery Services crosswalk (xwalk) projects using the Universal Editor. Covers UE component definitions, HTML serialization rules, model-first workflow, and local test content creation for crosswalk projects.
---

# Crosswalk Development

This skill provides project-specific guidance for AEM Edge Delivery Services crosswalk (xwalk) projects that use the Universal Editor (UE) for content authoring.

## How to Detect a Crosswalk Project

Check if `models/_component-definition.json` exists in the project root. If it does, this is a crosswalk project.

## Relationship with CDD (Content Driven Development)

This skill **complements** the Adobe `content-driven-development` (CDD) skill. CDD remains the orchestrator — this skill replaces or supplements specific CDD steps for crosswalk projects.

### CDD Step Mapping

| CDD Step | Crosswalk Behavior |
|---|---|
| **Step 0: Create TodoList** | **Unchanged** — use CDD as-is |
| **Step 1: Start Dev Server** | **Unchanged** — use CDD as-is |
| **Step 2: Analyze & Plan** | **Supplemented** — invoke analyze-and-plan skill as normal, but also use the **Reading Component Model Issues** section below when working from a GitHub issue |
| **Step 3: Design Content Model** | **Replaced** — instead of designing a table structure, follow **Phase 1: Component Definition** below to create the UE `_block.json` file |
| **Step 4: Identify/Create Test Content** | **Replaced** — push model to `main`, create content in the UE, then inspect `.plain.html` for real HTML. Alternatively, create local `.plain.html` test files using the **Creating Local Test Content for Crosswalk** section below |
| **Step 5: Implement** | **Replaced** — instead of invoking building-blocks directly, follow **Phase 2: Block Implementation** below which adapts building-blocks patterns for UE-serialized HTML |
| **Step 6: Lint & Test** | **Unchanged** — use CDD as-is |
| **Step 7: Final Validation** | **Unchanged** — use CDD as-is |
| **Step 8: Ship It** | **Unchanged** — use CDD as-is |

### When to Use This Skill

- **Always** for CDD Steps 3, 4, and 5 in a crosswalk project
- **Optionally** for Step 2 when working from a component model issue
- For Steps 0, 1, 6, 7, 8 — follow CDD directly, no crosswalk-specific changes

---

## Phase 1: Component Definition

This phase replaces **CDD Step 3** (Design Content Model). In crosswalk projects, the content model is a UE component definition JSON file, not a table structure.

### Model-First Workflow

1. **Create the component definition** (`blocks/{block-name}/_{block-name}.json`)
2. **Update section filter** — add the block id to `models/_section.json`
3. **Run `npm run build:json`** to regenerate merged JSON files
4. **Push to `main`** so the UE recognizes the block
5. **Validate in the UE** — add the block, fill fields, inspect the `.plain.html`

> **Note:** Pushing the model to `main` before code means the block appears in UE but renders as raw divs. This is acceptable during development but should be communicated to the team.

### Component Definition File

File: `blocks/{block-name}/_{block-name}.json`

Use an existing block definition as reference (e.g., `blocks/hero/_hero.json`). The file must include:

- **`definitions`** array: block title, id, resourceType (`core/franklin/components/block/v1/block`), and template (with `name` and `model`/`filter`)
- **`models`** array: field definitions for the UE properties panel
- **`filters`** array: child component filters (empty array `[]` for standalone blocks)

### Available Field Types

| Field type | `component` value | Use case |
|---|---|---|
| Text | `text` | Single-line text (titles, labels, alt text) |
| Rich text | `richtext` | Multi-line formatted content (descriptions, body text) |
| Image/Asset | `reference` | Image or asset references |
| AEM Content | `aem-content` | References to other AEM pages/fragments |
| Select | `select` | Dropdown with predefined options |
| Multi-select | `multiselect` | Multiple selection from options |
| Boolean | `boolean` | Toggle/checkbox |
| Number | `number` | Numeric values |
| Date | `date` | Date picker |
| Container | `container` | Section-like grouping of fields |

### After Creating the Definition

1. Add the block id to the section filter in `models/_section.json`
2. Run `npm run build:json` to regenerate merged JSON files
3. Verify the block appears in the generated `component-definition.json`, `component-models.json`, and `component-filters.json`

**Without this step, authors will not be able to add the block in the Universal Editor.**

---

## Phase 2: Block Implementation

This phase replaces **CDD Step 5** (Implement). It adapts the `building-blocks` skill patterns for crosswalk projects where HTML is serialized by the Universal Editor.

### Prerequisites

- ✅ Component definition exists (`_block.json`) — from Phase 1
- ✅ Real HTML available — either from UE `.plain.html` or local test content
- ✅ Dev server running at `http://localhost:3000`

### Implementation Workflow

1. **Fetch the real HTML** to understand the structure
2. **Find similar blocks** for reference patterns
3. **Create block files** (`{block-name}.js` and `{block-name}.css`)
4. **Implement JavaScript decoration**
5. **Add CSS styling**
6. **Test across viewports**

### Step 1: Fetch Real HTML

Before writing any code, inspect the actual HTML delivered by the backend:

```bash
curl http://localhost:3000/{content-path}.plain.html
```

If the content page has multiple blocks, look for the `<div class="{block-name}">` section. This is the HTML your `decorate()` function will receive.

**Why this matters:** UE-serialized HTML has a specific row-per-field structure (standalone blocks) or row-per-item structure (collection blocks). See the **UE HTML Serialization Rules** section below for details.

### Step 2: Find Similar Blocks

Search the codebase and Block Collection for patterns:

```bash
ls blocks/
```

Use the **block-collection-and-party** skill to find reference implementations of similar blocks.

### Step 3: Create Block Files

```bash
mkdir -p blocks/{block-name}
```

Create `blocks/{block-name}/{block-name}.js`:
```javascript
/**
 * decorate the block
 * @param {Element} block the block
 */
export default async function decorate(block) {
  // Decoration logic
}
```

Create `blocks/{block-name}/{block-name}.css`:
```css
main .{block-name} {
  /* Block styles */
}
```

### Step 4: Implement JavaScript Decoration

UE blocks require specific decoration patterns because of how fields are serialized.

#### Standalone blocks (model-based)

Each field becomes a separate row (`<div>` child of the block). Extract content by row position:

```javascript
export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: image (reference + alt collapsed into one row)
  const picture = rows[0]?.querySelector('picture');

  // Row 1: title (text field — plain text, no semantic HTML)
  const titleText = rows[1]?.textContent?.trim();

  // Row 2: description (richtext field — HTML preserved)
  const descriptionHTML = rows[2]?.querySelector('div')?.innerHTML;

  // Build semantic structure
  const content = document.createElement('div');
  content.className = 'block-content';

  if (picture) {
    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'block-image';
    imageWrapper.append(picture);
    content.append(imageWrapper);
  }

  const body = document.createElement('div');
  body.className = 'block-body';

  if (titleText) {
    const h2 = document.createElement('h2');
    h2.textContent = titleText;
    body.append(h2);
  }

  if (descriptionHTML) {
    const desc = document.createElement('div');
    desc.innerHTML = descriptionHTML;
    body.append(desc);
  }

  content.append(body);
  block.replaceChildren(content);
}
```

**Key points for standalone blocks:**
- `text` fields → plain text inside `<div>`, no semantic HTML — you must create `<h2>`, `<p>`, etc.
- `richtext` fields → HTML preserved inside `<div>`, can use `innerHTML`
- `reference` (image) + `text` (alt) → collapsed into one row with `<picture>` element
- Empty/unfilled fields → empty `<div>` rows — handle gracefully

#### Collection blocks (filter-based)

Each item becomes a row, each field a column within the row:

```javascript
export default async function decorate(block) {
  const items = [...block.children];

  items.forEach((item) => {
    const columns = [...item.children];
    // columns[0] = first field (e.g., image)
    // columns[1] = second field (e.g., text content)

    const picture = columns[0]?.querySelector('picture');
    const textContent = columns[1];

    // Decorate each item
    item.className = 'card';
    if (picture) columns[0].className = 'card-image';
    if (textContent) columns[1].className = 'card-body';
  });
}
```

#### Handling variants

Variants are applied as CSS classes on the block element. Check with `block.classList.contains()`:

```javascript
// CSS-only variants (e.g., 'image-right') — no JS needed, handle in CSS
// JS variants (e.g., 'carousel') — need different behavior
if (block.classList.contains('carousel')) {
  setupCarousel(block);
}
```

#### Preserving Universal Editor Instrumentation

When a block's `decorate()` function restructures the DOM (replacing children, creating new elements), the Universal Editor loses its connection to the content — authors can no longer add, edit, or delete items in the UE.

**Rule:** If you move or replace DOM elements that have `data-aue-*` attributes, you **must** use `moveInstrumentation()` from `scripts.js` to transfer those attributes to the new elements.

```javascript
import { moveInstrumentation } from '../../scripts/scripts.js';

export default async function decorate(block) {
  const items = [...block.children];

  const ul = document.createElement('ul');
  items.forEach((item) => {
    const li = document.createElement('li');
    // Transfer UE instrumentation from original div to new li
    moveInstrumentation(item, li);
    li.append(...item.childNodes);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
```

**When to use:**
- `block.replaceChildren(...)` — move instrumentation from block to the new wrapper
- Creating new elements to replace rows/items — move from original row to new element
- Any DOM restructuring that changes the element hierarchy

**When NOT needed:**
- Adding CSS classes to existing elements (no DOM restructuring)
- Appending new child elements without removing originals
- CSS-only changes

**Reference:** See `blocks/cards/cards.js` for a complete example from the boilerplate.

### Step 5: Add CSS Styling

Follow mobile-first responsive design with block-scoped selectors:

```css
/* Mobile-first (default) */
main .{block-name} .block-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

main .{block-name} .block-image img {
  width: 100%;
  height: auto;
}

main .{block-name} .block-body h2 {
  font-family: var(--heading-font-family);
  font-size: var(--heading-font-size-l);
  margin: 0;
}

main .{block-name} .block-body p {
  font-size: var(--body-font-size-m);
  color: var(--dark-color);
}

/* Tablet and up */
@media (width >= 600px) {
  main .{block-name} .block-content {
    padding: 2rem;
  }
}

/* Desktop and up */
@media (width >= 900px) {
  main .{block-name} .block-content {
    flex-direction: row;
    align-items: center;
  }

  main .{block-name} .block-image,
  main .{block-name} .block-body {
    flex: 1;
  }
}

/* Variants — CSS-only handling */
main .{block-name}.image-right .block-content {
  flex-direction: row-reverse;
}
```

**CSS guidelines:**
- All selectors scoped to `main .{block-name}`
- Use CSS custom properties (`var(--*)`) for colors, fonts, spacing
- Mobile-first: default styles = mobile, add complexity with `@media (width >= Npx)`
- Breakpoints: 600px (tablet), 900px (desktop), 1200px (wide)
- Images: always `width: 100%; height: auto` for responsiveness

### Step 6: Test Across Viewports

After implementation, validate at each breakpoint:

1. **Verify in browser** — open `http://localhost:3000/{content-path}` or ask the user to check
2. **Check mobile** (< 600px), **tablet** (600–899px), **desktop** (≥ 900px)
3. **Test variants** — apply each variant class and verify styling
4. **Check empty fields** — ensure block doesn't break with unfilled optional fields
5. **Run lint** — `npm run lint` (eslint + stylelint)

---

## Reading Component Model Issues

When creating a component definition from a GitHub issue (template: "Component Model Definition"), follow this checklist to avoid missing properties:

### Parsing Checklist

1. **Always re-fetch the issue** before starting — never rely on cached/previous reads
2. **Block Name** → used for directory name, file name, definition id, model id, and template name
3. **Block Type** → determines if the block uses `model` (standalone) or `filter` (collection)
4. **Fields** — for each field, extract ALL properties:
   - `name` → `"name"` in JSON
   - `type` → `"component"` in JSON (map: reference, text, richtext, aem-content, select, etc.)
   - `label` → `"label"` in JSON
   - `required` → if `true`, add `"required": true` to the field
   - `default` → if present, add `"value"` to the field
   - For `reference` type: add `"valueType": "string"` and `"multi": false`
   - For `text` type: add `"valueType": "string"`
   - For `richtext` type: add `"valueType": "string"`
5. **Child Item Fields** → only for collection blocks, defines child component model
6. **Variants** — if present, add a `classes` field:
   ```json
   {
     "component": "select",
     "name": "classes",
     "label": "Variant",
     "options": [
       { "name": "Display Name", "value": "" },
       { "name": "Variant Name", "value": "css-class" }
     ]
   }
   ```
   The first option with empty `value` is the default.
7. **Verify** the generated JSON contains every field, every `required`, and every variant from the issue

### Common Mistakes to Avoid

- Missing `required: true` on fields marked as required
- Missing variants when the issue specifies them
- Using cached issue data instead of re-fetching
- Forgetting to add `valueType: "string"` on reference/text/richtext fields

---

## Reference: UE HTML Serialization Rules

The Universal Editor serializes block content differently from document-based authoring. Understanding these rules is critical for writing correct JS decoration and local test content.

### Official Documentation

- **Block creation and serialization:** https://www.aem.live/developer/universal-editor-blocks
- **Content modeling and field types:** https://www.aem.live/developer/component-model-definitions
- **Markup reference:** https://www.aem.live/developer/markup-sections-blocks

Use the **docs-search** skill to search these if you need more detail.

You can verify real HTML output for any CMS page:
```
https://main--{repo}--{owner}.aem.page/{path}.plain.html
```

### Standalone Blocks (model-based)

Each field in the model becomes a **separate row** in the block HTML:

| Model field type | HTML output |
|---|---|
| `reference` (image) + `text` (alt) | `<div><div><picture>...<img alt="Alt Text">...</picture></div></div>` — image and alt combined into one row |
| `text` | `<div><div>plain text value</div></div>` — plain text, **no semantic HTML** |
| `richtext` | `<div><div><p>...</p></div></div>` — HTML content preserved |
| Empty/unfilled field | `<div></div>` — empty row |

**Key insight:** `reference` + `text` (imageAlt) pairs are grouped into a single row via field collapse. Other fields each get their own row.

### Collection Blocks (filter-based)

Each **item** becomes a row, and each field within the item becomes a **column**:

```html
<div class="cards">
  <div>
    <div><picture>...</picture></div>
    <div><p><strong>Title</strong></p><p>Description</p></div>
  </div>
</div>
```

### Field Collapse

The UE automatically collapses related fields using naming conventions:
- `image` + `imageAlt` → single element (alt applied to img tag)
- `link` + `linkText` → single `<a>` element
- `heading` + `headingType` → heading element with specified level

### Decoration Implications

Because UE serializes `text` fields as plain `<div>` content (no semantic HTML), the block's JavaScript is responsible for:
- Creating semantic elements (`<h2>`, `<p>`) from plain text
- Extracting and reorganizing content from the row-per-field structure
- Handling empty rows gracefully

---

## Reference: Creating Local Test Content for Crosswalk

When creating `.plain.html` test files:

1. Read the block's model (`blocks/{block-name}/_{block-name}.json`)
2. Apply the serialization rules above to generate correct HTML
3. **Standalone blocks:** each field = separate row, image+alt grouped
4. **Collection blocks:** each item = row, fields = columns within the row
5. Use plain `<div>` without semantic HTML for `text` fields
6. Preserve HTML for `richtext` fields

### Example

For a block with fields: `reference` (image), `text` (imageAlt), `text` (title), `richtext` (description):

```html
<div>
  <div class="my-block">
    <div><div><picture><img src="/media/image.jpg" alt="Alt text"></picture></div></div>
    <div><div>Title text</div></div>
    <div><div><p>Description text with <strong>formatting</strong>.</p></div></div>
  </div>
</div>
```

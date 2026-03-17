---
name: crosswalk-development
description: Project-specific skill for AEM Edge Delivery Services crosswalk (xwalk) projects using the Universal Editor. Covers UE component definitions, HTML serialization rules, model-first workflow, and local test content creation for crosswalk projects.
---

# Crosswalk Development

This skill provides project-specific guidance for AEM Edge Delivery Services crosswalk (xwalk) projects that use the Universal Editor (UE) for content authoring.

**Use this skill alongside the Adobe skills** (content-driven-development, building-blocks, etc.) — it supplements them with crosswalk-specific steps.

## When to Use This Skill

- Creating or modifying blocks in a crosswalk project
- Creating UE component definitions (`_*.json` files)
- Creating local `.plain.html` test content that matches UE output
- Understanding how the UE serializes content to HTML

## How to Detect a Crosswalk Project

Check if `models/_component-definition.json` exists in the project root. If it does, this is a crosswalk project.

## Model-First Workflow

For crosswalk projects, consider a **model-first** approach:

1. **Create the component definition** (`_block.json`) with fields
2. **Update section filter** and run `npm run build:json`
3. **Push to `main`** so the UE recognizes the block
4. **Validate in the UE** — add the block, fill fields, inspect the `.plain.html`
5. **Implement JS/CSS** on a feature branch with the real HTML structure in hand

> **Note:** Pushing the model to `main` before code means the block appears in UE but renders as raw divs. This is acceptable during development but should be communicated to the team.

## UE Component Definitions

When creating a new block, you **must** create a component definition file for the UE.

### File: `blocks/{block-name}/_{block-name}.json`

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

## UE HTML Serialization Rules

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

## Creating Local Test Content for Crosswalk

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

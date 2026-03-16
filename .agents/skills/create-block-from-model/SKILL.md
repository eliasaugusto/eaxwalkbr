---
name: create-block-from-model
description: Generate a new AEM Edge Delivery block from a model contract with agent-driven architecture decisions and deterministic HTML output contract, without requiring UE HTML validation.
---

# Create Block From Model

This skill creates a block end-to-end from model inputs, with the agent deciding architecture and output HTML contract.

Primary intent:
- Build model + block implementation without requiring manual UE HTML validation as a prerequisite.

## When to Use This Skill

Use this skill when:
- Creating a new block from a field contract
- Rebuilding a block with a cleaner architecture
- You want deterministic output HTML and contract-first implementation

Do NOT use this skill for:
- Minor CSS-only tweaks in existing blocks
- Small JS bug fixes in existing blocks
- Documentation-only tasks

## Inputs

Minimum required input:
- Block name (kebab-case)
- Field contract list:
  - name
  - type (text, richtext, reference, aem-content, select, multiselect)
  - label
  - required/optional
- Placement target (default: section)
- Constraints (optional), for example:
  - no variants
  - no CTA
  - keep model compatible with existing content

If required values are missing, stop and report exactly what is missing.

## Agent Responsibilities

The agent MUST decide automatically:
- Block architecture:
  - single model block, or
  - container + item composition
- Output HTML contract (final decorated structure and classes)
- JS/CSS implementation strategy matching the contract

Ask follow-up questions only when there is a true ambiguity with major trade-offs.

## UE HTML Contract (read this before writing any decorator)

The Universal Editor **always** serializes a block model to HTML using this exact rule:

> model field[n] → `block.children[n]` → `block.children[n].firstElementChild`

### Single model block

Given a model with fields `[a, b, c, d]` the UE generates:

```html
<div class="block-name">
  <div><div><!-- field a value --></div></div>   <!-- index 0 -->
  <div><div><!-- field b value --></div></div>   <!-- index 1 -->
  <div><div><!-- field c value --></div></div>   <!-- index 2 -->
  <div><div><!-- field d value --></div></div>   <!-- index 3 -->
</div>
```

### Container + item block

Given a container `parent` and item model with fields `[a, b, c, d]`:

```html
<div class="parent">
  <div class="parent-item">
    <div><div><!-- field a --></div></div>       <!-- index 0 -->
    <div><div><!-- field b --></div></div>       <!-- index 1 -->
    <div><div><!-- field c --></div></div>       <!-- index 2 -->
    <div><div><!-- field d --></div></div>       <!-- index 3 -->
  </div>
  <div class="parent-item">
    <!-- second authored item, same structure -->
  </div>
</div>
```

### Field type → HTML element mapping

| Field type   | HTML content                              |
|--------------|-------------------------------------------|
| text         | text node                                 |
| richtext     | inline HTML (`<strong>`, `<em>`, `<p>`)   |
| reference    | `<picture>` containing `<img>`            |
| aem-content  | `<a href="...">` with internal path       |
| select       | text node (selected value)                |
| multiselect  | text node (comma-separated selected values)|

### Rules that follow from this contract

1. Never use heuristics or format detection in the decorator — the model defines the contract.
2. Always destructure `block.children` by **index**, aligned to **model field order**.
3. Always read the value from `row.firstElementChild` (the inner `<div>`).
4. For `reference` fields, query `picture` inside `firstElementChild`.
5. For `aem-content` fields, query `a` inside `firstElementChild`.
6. For container+item, each item is a child of `block` with class `{parent}-{item-name}`.

## Decision Heuristics

1. Respect lint constraints first
- If model exceeds current max-cells policy, split into container + item or another valid composition.

2. Prefer simple architecture when possible
- If the block can be represented clearly with one model and <= max-cells, use single model.

3. Prefer container + item when any is true
- Repeating item semantics (grid, list, carousel, tabs, accordion)
- Mixed parent settings + item content
- Cleaner authoring with nested content

4. Never use single model for repeating items
- A single model always produces exactly one instance of the field set.
- If the block needs N cards/items authored by content authors, use container + item.

5. Keep output deterministic
- Same input structure must produce the same output structure.
- The decorator must never branch on "is this UE or doc format" — the model IS the format.

## Mandatory Decorator Patterns

These are the ONLY accepted patterns for reading UE-generated fields in a decorator.
Do NOT use heuristics, `.length` checks, or multi-format detection.

### Single model — positional destructuring

```js
export default function decorate(block) {
  // field order must match the model definition exactly
  const [fieldARow, fieldBRow, fieldCRow, fieldDRow] = [...block.children];

  const fieldA = fieldARow?.firstElementChild;             // text / richtext
  const fieldB = fieldBRow?.firstElementChild;             // text / richtext
  const fieldC = fieldCRow?.firstElementChild?.querySelector('picture'); // reference
  const fieldD = fieldDRow?.firstElementChild?.querySelector('a');       // aem-content

  // build output DOM here
}
```

### Container + item — iterate items, positional destructuring inside each

```js
export default function decorate(block) {
  [...block.children].forEach((item) => {
    // field order must match the item model definition exactly
    const [fieldARow, fieldBRow, fieldCRow, fieldDRow] = [...item.children];

    const fieldA = fieldARow?.firstElementChild;
    const fieldB = fieldBRow?.firstElementChild;
    const fieldC = fieldCRow?.firstElementChild?.querySelector('picture');
    const fieldD = fieldDRow?.firstElementChild?.querySelector('a');

    // build output DOM here
  });
}
```

### Naming rule
- Name destructuring variables after the **model field name**, not generic names like `col` or `row`.
- This creates a 1:1 readable mapping between model definition and decorator code.

### What to NEVER do
- Never use `block.querySelectorAll('div div')` to collect all cells.
- Never detect format by checking `row.children.length`.
- Never assume multi-column rows (UE always generates 1 column per row).
- Never use generic index variable names (`col0`, `c1`, etc.) — use field names.

## Required Outputs

1. Model source files
- `blocks/{block}/_{block}.json`
- Any related filter updates for target containers

2. Block implementation files
- `blocks/{block}/{block}.js`
- `blocks/{block}/{block}.css`

3. Regenerated aggregates
- `component-definition.json`
- `component-models.json`
- `component-filters.json`

4. Output HTML contract (must be returned in response)
- Input structure assumptions
- Output structure with class names
- Edge-case behavior

## Workflow

1. Validate input contract
- Normalize field names and ensure supported types.

2. Choose architecture
- Apply heuristics and document rationale.

3. Create model source
- Add definitions/models/filters in block source JSON.
- Update placement filter source (for example `models/_section.json`) when required.

4. Implement block code
- JS should transform authored structure into deterministic output HTML.
- CSS should be scoped to block and mobile-first.

5. Build and validate
- Run `npm run build:json`
- Run `npm run lint`

6. Verify presence
- Confirm block appears in generated definition/models/filters aggregates.

7. Return implementation report
- Files changed
- Commands executed
- Architecture decision log
- Output HTML contract
- Any manual follow-up actions

## Fail-Fast Rules

Stop and report blockers if:
- Unsupported field type is requested
- Target container mapping is unknown
- Lint constraints cannot be met with a reasonable architecture

## Output Format (required)

Return:
1. Files changed
2. Commands executed
3. Architecture decision (with rationale)
4. Model mapping (field -> model location)
5. Output HTML contract (input -> output)
6. Validation results (`build:json`, `lint`, aggregate presence)
7. Remaining manual actions (if any)

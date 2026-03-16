---
name: create-block
description: Implement a block (JS + CSS) from an existing model. Reads the field contract from the block JSON file already created in Gate 1.
argument-hint: <block-name> [issue-url]
---

# Create Block

Implement a block (JS + CSS) for a block whose model already exists from Gate 1.

## Inputs

- Block name: {{block_name}}
- Design issue URL (optional): {{issue_url}}

## Prompt

You are working in an AEM Edge Delivery Services project.

Using Skill: create-block-from-model

Execute block creation end-to-end using the provided model contract.
The agent must decide architecture and output HTML contract automatically.
Do not require UE HTML validation as a prerequisite for implementation.

### Critical constraint: model-aligned decorator

The UE always generates HTML with one row per field, in the **exact same order as the model fields**.
The decorator MUST use positional destructuring aligned to the model field order.

- `block.children[0]` → model field 0 → named `{field0Name}Row`
- `block.children[1]` → model field 1 → named `{field1Name}Row`
- etc.

Variable names in the decorator must match model field names exactly.
Never use heuristics, format detection, or generic names (`col`, `row0`).
For container+item blocks, apply the same positional rule inside each item.

### Required execution
1. Read AGENTS.md and apply project conventions.
2. Read `blocks/{block_name}/_{block_name}.json` — extract field contract (names, types, order) from the model.
   - If the file does not exist, stop and report: "Model not found. Run /create-model first."
3. If a design issue URL was provided, fetch it and extract layout and design intent.
4. Decide architecture from the model file (single model = `template.model`, container+item = `template.filter`).
5. Generate block JS with positional destructuring exactly aligned to model field order.
6. Generate block CSS, mobile-first, scoped to block.
7. Run lint validation (`npm run lint`).
8. Return output HTML contract and final report.

### Required output format
Return:
1. Files changed
2. Commands executed
3. Architecture decision and rationale
4. Model mapping (field -> model location)
5. Output HTML contract (input -> output)
6. Validation results
7. Remaining manual actions (if any)

## Example Input

- Block name: promo-grid
- Field contract source:
  - title (text, required)
  - description (richtext, optional)
  - image (reference, optional)
  - link (aem-content, optional)
- Placement target: section
- Constraints: no variants, no CTA

---
name: "Block Definition"
about: "Define the design intent for a block whose model was already approved in Gate 1"
title: "BLOCK: <block-name>"
labels: ["block", "design", "gate-3"]
assignees: []
---

## Goal

Provide the design intent for a block so the agent can implement JS and CSS.
The authoring model (fields, types, order) must already exist in `blocks/{block-name}/_{block-name}.json` from Gate 1.
If Gate 1 has not been completed, open a **Model Enablement (Gate 1)** issue first.

## Inputs

- Block name (kebab-case):
- Gate 1 issue (MODEL issue URL):
- Reference URL or inspiration (optional):

## Design

### Layout

Describe the visual layout of the block.

- Desktop layout:
- Mobile layout (default column-stack if not specified):
- Breakpoint for layout change (default 900px if not specified):

### Visual elements

Describe how each field from the model should be rendered visually.

- image: (e.g. full-width hero image, fixed ratio card thumbnail)
- title: (e.g. h2 heading, bold label)
- text: (e.g. body paragraph, caption)
- link: (e.g. button CTA, inline text link)

### Spacing and sizing

- Internal gap between elements:
- Block padding:
- Image max-width or aspect ratio (optional):

### Color and typography

- Background color (default: none):
- Title font size (default: `--heading-font-size-m`):
- Text font size (default: `--body-font-size-m`):

### Variants (optional)

List any style variants authors can apply via block options.

| variant name | description |
|---|---|
| | |

Leave empty if no variants required.

## Implementation Checklist

- [ ] Gate 1 model file confirmed at `blocks/{block}/_{block}.json`
- [ ] Design intent described (layout, elements, spacing)
- [ ] Decorator JS implements positional destructuring aligned to existing model field order
- [ ] CSS is mobile-first and scoped to block
- [ ] Lint passes (`npm run lint`)

## Acceptance Criteria

- [ ] Block renders correctly on mobile (<= 599px)
- [ ] Block renders correctly on desktop (>= 900px)
- [ ] All fields are optional-safe (no crash when a field is empty)
- [ ] Images are optimized via `createOptimizedPicture`
- [ ] Block is visible and insertable in Universal Editor

## Definition of Done

- [ ] JS and CSS files created and committed
- [ ] Lint is green
- [ ] Block renders correctly on preview URL
- [ ] Acceptance criteria met
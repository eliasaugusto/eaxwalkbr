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

## Decision Heuristics

1. Respect lint constraints first
- If model exceeds current max-cells policy, split into container + item or another valid composition.

2. Prefer simple architecture when possible
- If the block can be represented clearly with one model and <= max-cells, use single model.

3. Prefer container + item when any is true
- Repeating item semantics
- Mixed parent settings + item content
- Cleaner authoring with nested content

4. Keep output deterministic
- Same input structure should produce same output structure.

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

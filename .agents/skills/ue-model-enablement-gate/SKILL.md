---
name: ue-model-enablement-gate
description: Enable and validate a new block model in Universal Editor before design and full block implementation. Use when creating a new block or changing authoring fields/structure so the block is available in UE with validated authoring contract and captured HTML evidence.
---

# UE Model Enablement Gate

This skill implements the first phase of a staged block workflow for AEM Edge Delivery Services: make the block available in Universal Editor (UE), validate authoring contract quality, and capture observed HTML before visual/design and full JS/CSS implementation.

Canonical process artifact:
- `.github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md`

Use the issue template above as the single source of truth for:
- Inputs
- Implementation Checklist
- UE Validation Checklist
- Evidence
- Decision
- Definition of Done

Do not create a second checklist with different criteria.

## When to Use This Skill

Use this skill when:
- Creating a new block model for authoring
- Changing existing block authoring fields/structure
- Adding or changing block registration/filter availability (for example section filter)

Do NOT use this skill for:
- Pure styling-only changes
- Pure JavaScript behavior-only changes with no authoring model impact
- Documentation-only changes

## Inputs Required

Before starting, gather the values required by the issue template:
- Block name in kebab-case
- Block title
- Field list with type, label, required/optional, and expected order
- Target availability scope (for example, section)
- Target UE integration environment for validation

## Outputs Required

This skill is done only when all outputs exist:
- Block model source created or updated
- Block availability source updated (filters/section scope)
- Aggregated model files regenerated and verified
- Lint passes
- Issue template sections filled with current status and evidence

## Workflow

First action:
1. Read `.github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md`.
2. Map task data to Inputs and Field Contract sections.
3. Execute technical steps below and update status under the template's checklist sections.

### Step 1: Define Authoring Contract

Confirm the contract before editing files:
- Block ID and display intent
- Field names and data types
- Field order and semantics
- Optional versus required behavior

If contract is unclear, stop and clarify before coding.

### Step 2: Create/Update Model Sources

Typical source updates:
- Block model file in `blocks/{block-name}/_{block-name}.json`
- Availability scope update in `models/_section.json` (or other container model as required)

Guidelines:
- Keep field names predictable and consistent
- Avoid introducing presentational concerns in model definitions
- Keep this phase focused on model enablement only

### Step 3: Regenerate Aggregates

Run:

npm run build:json

This is mandatory when changing any of:
- models/_*.json
- blocks/**/_*.json

### Step 4: Validate Aggregate Presence

Verify expected entries in:
- `component-definition.json`
- `component-models.json`
- `component-filters.json`

Minimum checks:
- Block ID exists in definition/models outputs
- Block is available in intended filter scope (for example section)
- Field names appear exactly as defined in model source

### Step 5: Lint and Fix

Run:

npm run lint

Fix all relevant errors before moving forward.

### Step 6: Open Short Enablement PR

Create a small PR containing only:
- Model source changes
- Filter scope changes
- Generated aggregate updates

Do not include full block JS/CSS implementation in this PR.

### Step 7: Validate in UE and Capture Evidence

After availability is live in the target UE integration environment:
1. Add the component manually to a library/sandbox page
2. Validate authoring experience:
   - Component is selectable
   - Fields are understandable and in correct order
   - Filling fields behaves as expected
3. Capture observed generated HTML
4. Attach evidence to the issue using the template's Evidence section

### Step 8: Approve Gate 1

Set the template Decision section to Approved only when all required checklist items are complete.

If rejected, document gaps and repeat from the appropriate step.

## Definition of Done (Gate 1)

Use the Definition of Done section from `.github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md`.

## Handoff to Next Phase

After Gate 1 approval, hand off to design/development with:
- Final field contract
- Captured real HTML reference
- Known edge cases discovered during authoring validation

This minimizes rework in the implementation phase.

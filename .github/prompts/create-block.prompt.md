---
name: create-block
description: Create a new block from a field contract with agent-decided architecture and deterministic HTML contract.
argument-hint: <block-name> <field-contract-or-issue-url>
---

# Create Block

Create a new AEM Edge Delivery block from the provided field contract.

## Inputs

- Block name: {{block_name}}
- Field contract source: {{field_contract_source}}
- Placement target (optional): {{placement_target}}
- Constraints (optional): {{constraints}}

## Prompt

You are working in an AEM Edge Delivery Services project.

Using Skill: create-block-from-model

Execute block creation end-to-end using the provided model contract.
The agent must decide architecture and output HTML contract automatically.
Do not require UE HTML validation as a prerequisite for implementation.

### Required execution
1. Read AGENTS.md and apply project conventions.
2. Parse and normalize the field contract.
3. Decide architecture (single model or container + item) with rationale.
4. Generate model source and placement filter updates.
5. Generate block JS/CSS with deterministic output structure.
6. Run build and lint validations.
7. Return output HTML contract and final report.

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

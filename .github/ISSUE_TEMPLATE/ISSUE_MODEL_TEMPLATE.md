---
name: "Model Enablement (Gate 1)"
about: "Enable and validate a block model in Universal Editor before design and full implementation"
title: "MODEL: <block-name>"
labels: ["model", "authoring", "gate-1"]
assignees: []
---

## Goal

Enable a new or changed block model in Universal Editor and validate the authoring contract with evidence.

## Inputs

- Block name (kebab-case):
- Block title:
- Scope/container (example: section):
- UE integration environment:

## Field Contract

List all fields in authoring order.

Field type options available in this project (use these names in `type`):

| type | Use when | Example |
|---|---|---|
| `text` | Short plain text value | title, imageAlt, author |
| `richtext` | Formatted text (paragraphs, bold, links) | body text, quote |
| `reference` | Media/content reference (for example image) | image |
| `aem-content` | Internal content link/reference from AEM | reference, link |
| `select` | One option from a fixed list | titleType, linkType |
| `multiselect` | Multiple options from a fixed list | style |

Tip (keep it simple):
- Prefer `text` for labels and small fields
- Use `richtext` only when formatting is needed
- Use `select`/`multiselect` only when options are known in advance

Example field lines:

- name: title
  type: text
  required: yes
  label: Title
- name: text
  type: richtext
  required: no
  label: Text
- name: image
  type: reference
  required: yes
  label: Image

- name:
  type:
  required: yes/no
  label:
- name:
  type:
  required: yes/no
  label:
- name:
  type:
  required: yes/no
  label:

## Implementation Checklist

- [ ] Model source file created or updated in block folder
- [ ] Scope/filter source updated (example: section filter)
- [ ] Aggregates regenerated with `npm run build:json`
- [ ] Presence validated in:
  - [ ] component-definition.json
  - [ ] component-models.json
  - [ ] component-filters.json
- [ ] Lint executed with `npm run lint`
- [ ] Enablement-only changeset prepared (no full visual/behavior implementation)

## UE Validation Checklist

- [ ] Component is visible in UE component picker
- [ ] Component can be inserted on library/sandbox page
- [ ] Field labels are clear and in expected order
- [ ] Required/optional behavior is correct
- [ ] Authoring flow is acceptable for content authors

## Evidence

- Preview URL:
- UE screenshot (component picker):
- UE screenshot (filled fields):
- Observed generated HTML snippet:

## Decision

Gate 1 status:
- [ ] Approved
- [ ] Rejected

If rejected, list blocking gaps:

- 
- 

## Definition of Done

- [ ] Model and availability are implemented and validated
- [ ] Aggregates are synchronized
- [ ] Lint is green
- [ ] UE authoring validation completed with evidence
- [ ] Gate 1 has explicit Approved or Rejected decision

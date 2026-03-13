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
- UE catalog group:
- Allowed containers:
- Allowed child components (optional):
- If target location is unclear: stop and ask before implementing

## Field Contract

List all fields in authoring order.

| order | name | type | required (yes/no) | label |
|---|---|---|---|---|
| 1 | image | reference | yes | Image |
| 2 | title | text | yes | Title |
| 3 | text | richtext | no | Text |

Add or remove rows as needed for your block.

Field type reference:
- See [fields-definition.md](https://github.com/eliasaugusto/eaxwalkbr/blob/main/docks/fields-definition.md)

## Implementation Checklist

- [ ] Model source file created or updated in block folder
- [ ] Container target resolved from issue input
- [ ] Scope/filter source file mapped and updated (example: section -> models/_section.json)
- [ ] Post-edit source validation confirms block id in target filter
- [ ] Aggregates regenerated with `npm run build:json`
- [ ] Presence validated in:
  - [ ] component-definition.json
  - [ ] component-models.json
  - [ ] component-filters.json
- [ ] Post-build aggregate validation confirms block id in expected container filter
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

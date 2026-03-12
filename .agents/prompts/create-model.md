---
title: create-model
description: Run Gate 1 for a new or changed block model in Universal Editor using the ue-model-enablement-gate skill and the canonical ISSUE_MODEL_TEMPLATE.
---

# Create Model (UE Gate 1)

Use this prompt to execute the first project phase (model enablement) with a single source of truth for checklist and DoD.

Canonical template:
- .github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md

## Prompt

You are working in an AEM Edge Delivery Services project.

Using Skill: ue-model-enablement-gate

Use .github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md as the canonical checklist and Definition of Done.
Do not create a parallel checklist. Execute Gate 1 based on the template fields and checklist sections.

### Inputs
- Block name: {{block_name_kebab_case}}
- Block title: {{block_title}}
- Scope/container: {{scope_example_section}}
- Fields:
  - {{field_1_name}} | {{field_1_type}} | {{required_or_optional}} | {{label}}
  - {{field_2_name}} | {{field_2_type}} | {{required_or_optional}} | {{label}}
  - {{field_3_name}} | {{field_3_type}} | {{required_or_optional}} | {{label}}
- Target UE integration environment: {{ue_environment}}

### Required execution
1. Read and follow .github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md.
2. Fill Inputs and Field Contract from the task data.
3. Execute all technical items from Implementation Checklist.
4. Return UE Validation Checklist and Evidence as completed, pending, or blocked.
5. Return final Decision as Approved or Rejected with reason.

### Required output format
Return:
1. Files changed
2. Commands executed
3. Checklist status copied by section name from ISSUE_MODEL_TEMPLATE
4. Remaining manual actions in UE (if any)
5. Final Gate 1 status: Approved or Rejected (with reason)

## Example Input

- Block name: promo-teaser
- Block title: Promo Teaser
- Scope/container: section
- Fields:
  - image | reference | required | Image
  - imageAlt | text | optional | Alt
  - title | text | required | Title
  - text | richtext | optional | Text
- Target UE integration environment: develop

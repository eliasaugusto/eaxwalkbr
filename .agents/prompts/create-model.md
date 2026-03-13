---
title: create-model
description: Run Gate 1 from a GitHub issue URL using the ue-model-enablement-gate skill and the canonical ISSUE_MODEL_TEMPLATE.
---

# Create Model (UE Gate 1)

Use this prompt to execute the first project phase (model enablement) with GitHub issue data as source of truth.

Canonical template:
- .github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md

## Prompt

You are working in an AEM Edge Delivery Services project.

Using Skill: ue-model-enablement-gate

Use .github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md as the canonical checklist and Definition of Done.
Do not create a parallel checklist. Execute Gate 1 based on the template fields and checklist sections.

### Inputs
- GitHub issue URL: {{github_issue_url}}

### Required execution
1. Read .github/ISSUE_TEMPLATE/ISSUE_MODEL_TEMPLATE.md.
2. Read the provided GitHub issue URL and parse Inputs + Field Contract from the issue body.
3. Resolve target container id(s) and insertion point(s) from issue input before editing files.
4. If any required value is missing in the issue, stop and report missing fields clearly.
5. Execute all technical items from Implementation Checklist.
6. Fail fast if block id is not confirmed in both source filter file and component-filters.json after build.
7. Return UE Validation Checklist and Evidence as completed, pending, or blocked.
8. Return final Decision as Approved or Rejected with reason.

### Required output format
Return:
1. Files changed
2. Commands executed
3. Checklist status copied by section name from ISSUE_MODEL_TEMPLATE
4. Parsed values from issue (block name, container ids, insertion points, fields, environment)
5. Insertion decision log (target container -> source file -> validation result)
6. Remaining manual actions in UE (if any)
7. Final Gate 1 status: Approved or Rejected (with reason)

## Example Input

- GitHub issue URL: https://github.com/eliasaugusto/eaxwalkbr/issues/10

---
description: "Create a UE component definition from a GitHub issue"
agent: "agent"
---

# /model — Create Component Definition

You are implementing **Phase 1** of the crosswalk development workflow.

## Input

The user provides a GitHub issue number: `${input:issueNumber:Issue number (e.g. 19)}`

## Instructions

1. **Read the crosswalk-development skill** at `.agents/skills/crosswalk-development/SKILL.md` — specifically the sections:
   - "Reading Component Model Issues" (parsing checklist)
   - "Phase 1: Component Definition" (model-first workflow)

2. **Fetch the issue** from GitHub:
   - Determine repo owner/name from `git remote -v`
   - Fetch `https://github.com/{owner}/{repo}/issues/{issueNumber}`
   - **Always re-fetch** — never rely on cached data

3. **Parse the issue** following the parsing checklist:
   - Block Name → directory name, file name, definition id, model id
   - Block Type → `model` (standalone) or `filter` (collection)
   - Fields → extract ALL properties: name, type, label, required, default, options
   - Child Item Fields → only for collection blocks
   - Variants → add `classes` select field if present

4. **Check if block directory exists** (`blocks/{block-name}/`):
   - If exists: read existing `_{block-name}.json` and update it
   - If new: create `blocks/{block-name}/_{block-name}.json`

5. **Use an existing block definition as reference** (e.g., `blocks/hero/_hero.json`) for the JSON structure

6. **Update section filter** — add the block id to `models/_section.json` (if not already present)

7. **Run `npm run build:json`** to regenerate merged JSON files

8. **Verify** the block appears in the generated `component-definition.json`, `component-models.json`, and `component-filters.json`

9. **Run `npm run lint`** to validate

10. **Report** what was created and remind the user to:
    - Push to `main` so the UE recognizes the block
    - Add the block in the UE, fill fields, and validate

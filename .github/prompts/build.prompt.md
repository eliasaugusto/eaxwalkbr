---
description: "Implement JS/CSS for a block from a GitHub issue"
agent: "agent"
---

# /build — Implement Block

You are implementing **Phase 2** of the crosswalk development workflow.

## Input

The user provides a GitHub issue number: `${input:issueNumber:Issue number (e.g. 20)}`

## Instructions

1. **Read the crosswalk-development skill** at `.agents/skills/crosswalk-development/SKILL.md` — specifically:
   - "Phase 2: Block Implementation" (full implementation workflow)
   - "Reference: UE HTML Serialization Rules" (how UE serializes fields to HTML)

2. **Fetch the issue** from GitHub:
   - Determine repo owner/name from `git remote -v`
   - Fetch `https://github.com/{owner}/{repo}/issues/{issueNumber}`
   - Extract: Block Name, Model Issue, Content URLs, Design/Visual Requirements, Acceptance Criteria

3. **Fetch the model issue** (linked from the implementation issue) to understand the field structure

4. **Ensure dev server is running** at `http://localhost:3000`

5. **Fetch real HTML** from the content URL:
   ```
   curl http://localhost:3000/{content-url}.plain.html
   ```
   Identify the block's HTML structure within the page.

6. **Read the component definition** (`blocks/{block-name}/_{block-name}.json`) to understand field types and order

7. **Create a feature branch**: `feat/{block-name}-impl`

8. **Implement the block** following Phase 2 guidelines:
   - **JS (`{block-name}.js`)**: Extract content by row position, create semantic HTML from text fields, preserve richtext innerHTML, handle variants
   - **CSS (`{block-name}.css`)**: Mobile-first, scoped to `main .{block-name}`, use CSS custom properties, breakpoints at 600px/900px/1200px

9. **Run `npm run lint`** — fix any errors

10. **Commit, push, and create a PR** with:
    - Preview link: `https://feat-{block-name}-impl--{repo}--{owner}.aem.page/{content-path}`
    - Reference to the implementation issue (`Closes #{issueNumber}`)
    - Acceptance criteria checklist from the issue

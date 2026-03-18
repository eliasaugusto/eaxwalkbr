# Language Switcher Block — Analysis

## Task Description
Create a language switcher dropdown block that allows users to navigate to the equivalent page in a different language. Typically placed inside the nav, but can be used anywhere.

## Requirements

### Author Inputs
- **Languages (collection):** Each item has:
  - **Label** (text): Display name (e.g., "Português", "English")
  - **Prefix** (text): URL path prefix (e.g., "/pt-br", "/en-us")

### Behavior
- Renders as a dropdown (button + list)
- Detects the current language from the URL prefix
- Shows the current language label as the button text
- On selecting a different language, navigates to the equivalent page by swapping the prefix
- Current language is visually marked in the dropdown list
- Clicking outside closes the dropdown
- Escape key closes the dropdown
- Accessible: proper ARIA attributes (expanded, role, etc.)

### Fallback
- Navigate directly — if page doesn't exist, the 404 page handles it

### Responsive
- Works on all viewports
- Mobile: same dropdown behavior

## Acceptance Criteria
- [ ] Block renders a dropdown with all authored languages
- [ ] Current language detected from URL and shown as active
- [ ] Clicking a language navigates to equivalent page with swapped prefix
- [ ] Dropdown opens/closes on click
- [ ] Dropdown closes on outside click and Escape key
- [ ] ARIA attributes for accessibility (aria-expanded, role)
- [ ] Works inside nav (header) or standalone
- [ ] Lint passes

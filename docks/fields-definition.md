# Fields Definition

This file is the reference for model field types used in this project.

## Available Field Types

| type | Use when | Example |
|---|---|---|
| text | Short plain text value | title, imageAlt, author |
| richtext | Formatted text such as paragraphs, bold text, and links | body text, quote |
| reference | Media/content reference such as image | image |
| aem-content | Internal content link/reference from AEM | reference, link |
| select | One option from a fixed list | titleType, linkType |
| multiselect | Multiple options from a fixed list | style |

## Quick Rules

- Prefer text for labels and short fields.
- Use richtext only when formatting is required.
- Use select or multiselect only when options are predefined.

## Field Contract Example

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

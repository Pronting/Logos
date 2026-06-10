---
title: Bookshelf Page Configuration Guide
pubDate: 2026-06-10
description: How to add new books, configure covers, fill in metadata and reviews, and an overview of bookshelf features.
category: Blog Configuration
image: ""
draft: false
slugId: momo/bookshelf/config
---

## Overview

The bookshelf page (`/bookshelf/`) is a standalone book showcase accessible from the top navigation bar. It supports:

- **Book grid**: Display all read/reading books in a grid layout
- **Search**: Fuzzy search by title or author
- **Tag filter**: Filter by Psychology, History, Philosophy, Literature, etc.
- **Rating filter**: Filter by Recommended / Neutral / Not Recommended
- **Detail modal**: Click a book card to open an overlay with summary, metadata, and review

---

## Adding a New Book

Create a subdirectory under `src/content/books/` with an English slug name, then add two `.md` files (Chinese and English):

```
src/content/books/
  my-book/                ← directory name = slug
    zh-cn.md
    en.md
```

### Frontmatter Fields

```yaml
---
title: "Book Title"                     # Required
author: "Author Name"                   # Required
tags: ["Philosophy", "Literature"]      # Required, array
rating: "recommended"                   # Required: recommended | neutral | not-recommended
summary: "A short description..."       # Optional, shown in modal
cover: "/covers/cover.jpg"              # Optional, path under public/
readDate: 2025-12-15                    # Optional, shown in modal
readTimeMinutes: 480                    # Optional, minutes
year: 2021                              # Optional, publication year
pinTop: 0                               # Optional, higher = pinned higher
draft: false                            # Optional, hide in production if true
---
```

### Tag Values

`心理学` `历史学` `哲学` `文学` `政治经济学` `社会学` `金融学`

### Rating Values

| Value | Display | Badge Color |
|---|---|---|
| `recommended` | 推荐 / Recommended | Green |
| `neutral` | 中庸 / Neutral | Yellow |
| `not-recommended` | 不行 / Not Recommended | Red |

---

## Review Body

The Markdown content below the frontmatter is your personal book review, displayed as plain text in the detail modal. Rich Markdown rendering will be supported in a future version.

---

## Cover Image

Place cover images under `public/covers/` and reference them in frontmatter:

```yaml
cover: "/covers/my-cover.jpg"
```

If no `cover` is set, a placeholder book icon will be shown.

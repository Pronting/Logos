---
title: How to Create a Column
pubDate: 2024-01-25
draft: false
description: A detailed guide on creating columns, adding articles, and configuring column options.
slugId: column-tutorial
tags:
  - Tutorial
  - Column
  - Blog Feature
pinTop: 1
---

## What is a Column

Columns are series of content independent from regular blog posts. Each column represents a cohesive topic with multiple related articles. Examples:

- **Dev Log** — Recording the blog development process
- **Source Code Reading** — Analysis series of an open-source project
- **Study Notes** — Systematic learning records of a course or technology

Column articles do not appear in the homepage article list — they have their own dedicated timeline page.

## Creating a New Column

### Step 1: Create Column Metadata

Create a new folder under `src/content/columns/`. The folder name becomes the column slug (used in URLs).

```
src/content/columns/
└── my-column/           ← column slug
    ├── zh-cn.md         ← Chinese metadata
    └── en.md            ← English metadata (optional)
```

Edit `zh-cn.md` with the following frontmatter:

```markdown
---
title: My Column
description: A series of articles about xxx
icon: fa6-solid:book-open
pinTop: 0
draft: false
---
```

**Field Reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Column title |
| `description` | ❌ | Column description, shown in sidebar and column page |
| `icon` | ❌ | Icon name in Iconify format, e.g. `fa6-solid:code` |
| `pinTop` | ❌ | Pin weight, higher = more prominent, default 0 |
| `draft` | ❌ | Whether it's a draft (hidden in production) |

### Step 2: Choose an Icon

Icons use [Iconify](https://iconify.design/) format with common prefixes:

- `fa6-solid:` — FontAwesome 6 Solid
- `fluent:` — Fluent UI Icons
- `material-symbols:` — Material Symbols

Search for icons at [Iconify Icon Sets](https://icon-sets.iconify.design/).

Recommended icons:
- `fa6-solid:code` — Code
- `fa6-solid:book-open` — Book
- `fa6-solid:laptop-code` — Laptop with code
- `fa6-solid:lightbulb` — Lightbulb
- `fa6-solid:rocket` — Rocket
- `fa6-solid:pen-nib` — Pen nib

## Adding Articles to a Column

### Step 1: Create Article Directory

Under `src/content/column-articles/`, create a folder named after the column slug, then create subfolders for each article:

```
src/content/column-articles/
└── my-column/                    ← matches column slug
    ├── first-article/
    │   └── zh-cn.md
    ├── second-article/
    │   └── zh-cn.md
    └── third-article/
        ├── zh-cn.md
        └── en.md
```

### Step 2: Write Article Frontmatter

```markdown
---
title: First Article
pubDate: 2024-01-20
draft: false
description: A brief description shown in the timeline card.
columnSlug: my-column
tags:
  - tag1
  - tag2
---

Article content goes here, supporting full Markdown syntax.
```

**Field Reference:**

| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Article title |
| `pubDate` | ✅ | Publication date, used for timeline sorting |
| `draft` | ❌ | Whether it's a draft |
| `description` | ❌ | Article description, shown in timeline card |
| `image` | ❌ | Cover image path |
| `columnSlug` | ✅ | Column slug, must match the column folder name |
| `tags` | ❌ | Array of article tags |

### Step 3: Multi-language Support

Add multilingual versions by creating locale-specific `.md` files in the same directory:

```
first-article/
├── zh-cn.md    ← Chinese (default)
└── en.md       ← English
```

If a locale file doesn't exist, the system automatically falls back to the default language.

## Timeline Display

The column detail page uses a vertical timeline layout:

- **Desktop** — Article cards alternate left and right, dates shown on the opposite side
- **Mobile** — Unified left-aligned layout, dates shown inside cards
- Articles sorted by publication date descending (newest first)
- AOS scroll animations supported

## Configuration Options

### Pinning Columns

Use the `pinTop` field to prioritize important columns:

```yaml
pinTop: 10  # higher number = more prominent
```

### Draft Mode

Set `draft: true` to mark columns or articles as drafts:

- Development: drafts are visible
- Production: drafts are automatically hidden

### Sidebar Display

Column list automatically appears below ProfileCard on the homepage sidebar. If no columns exist, the section is hidden.

## Complete Example

Here's a complete "Dev Log" column example:

**Column Metadata** (`src/content/columns/dev-log/zh-cn.md`):

```markdown
---
title: Dev Log
description: Thoughts and practices during blog development
icon: fa6-solid:code
pinTop: 0
draft: false
---
```

**Column Article** (`src/content/column-articles/dev-log/first-post/zh-cn.md`):

```markdown
---
title: First Day Building the Blog
pubDate: 2024-01-15
draft: false
description: Starting from scratch with Astro as the framework.
columnSlug: dev-log
tags:
  - Astro
  - Blog
---

## Why Astro

Among many static site generators, Astro stands out with its unique island architecture.
```

## Route Structure

| Page | Route | Description |
|------|-------|-------------|
| Homepage Sidebar | `/` | Column list below ProfileCard |
| Column Timeline | `/column/{slug}/` | Timeline of all articles in the column |
| Article Detail | `/column/{slug}/{id}` | Full content of a single article |

## FAQ

### Q: Do column articles appear in the homepage article list?

No. Columns are an independent content system from blog posts — they don't interfere with each other.

### Q: Can I set a cover image for a column?

Columns themselves don't support cover images, but each article within a column can set an `image` field as its cover.

### Q: What's the sorting order for articles?

Articles are sorted by `pubDate` in descending order — the newest article appears at the top of the timeline.

### Q: How do I delete a column?

Simply delete the corresponding folders under `src/content/columns/` and `src/content/column-articles/`.

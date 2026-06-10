---
title: 书籍与书评发布指南
pubDate: 2026-06-10
description: 如何添加书籍到书架、撰写书评文章，并建立两者之间的关联
tags: [指南]
image: ""
draft: false
slugId: momo/intro/book-review
---

## 概述

书架（Bookshelf）和书评（Book Review）是两个独立但互相关联的模块：

- **书架**：展示书籍列表，支持按领域分组、筛选、搜索
- **书评**：独立的长文文章，支持 Markdown 富文本渲染
- **关联**：一本书可以有多篇书评，书架详情页会显示关联的书评链接

## 添加书籍

在 `src/content/books/` 目录下创建文件夹，然后添加语言文件：

```
src/content/books/
  └── 置身事内/
        └── zh-cn.md
```

### 书籍 Frontmatter

```yaml
---
title: "置身事内：中国政府与经济发展"
author: "兰小欢"
cover: "https://img.example.com/cover.jpg"  # 封面图，支持图床链接或本地路径
tags: ["政治经济学"]                          # 领域标签，支持多个
rating: "recommended"                        # 推荐等级：recommended / neutral / not-recommended
summary: "一部理解中国经济发展与政府角色的入门佳作"
readDate: 2025-12-15                         # 阅读日期
readTimeMinutes: 480                         # 阅读时长（分钟）
year: 2021                                   # 出版年份
pinTop: 1                                    # 置顶权重，数字越大越靠前
draft: false                                 # 是否草稿
---
```

### 字段说明

| 字段 | 必填 | 说明 |
| :--- | :---: | :--- |
| `title` | ✅ | 书名 |
| `author` | ✅ | 作者 |
| `cover` | ❌ | 封面图。支持图床链接（`https://...`）或本地相对路径（`./cover.jpg`） |
| `tags` | ✅ | 领域标签数组，用于分组和筛选。**新增领域无需修改代码，自动从数据中统计** |
| `rating` | ✅ | 个人评价：`recommended`（推荐）、`neutral`（中庸）、`not-recommended`（不推荐） |
| `summary` | ❌ | 书籍简介，显示在详情弹窗 |
| `readDate` | ❌ | 阅读时间 |
| `readTimeMinutes` | ❌ | 阅读时长（分钟） |
| `year` | ❌ | 出版年份 |
| `pinTop` | ❌ | 置顶权重，不填或 0 表示不置顶 |
| `draft` | ❌ | 草稿标记，生产环境不显示 |

:::important
- `tags` 是开放字段，直接写中文名称即可（如 `["心理学", "哲学"]`），系统会自动统计并在书架页面展示为筛选标签。
- `cover` 支持任意图片 URL，包括腾讯云 COS、阿里云 OSS、SM.MS 等图床链接。
:::

## 撰写书评

在 `src/content/book-review/` 目录下创建文件夹，然后添加语言文件：

```
src/content/book-review/
  └── 置身事内-读后/
        └── zh-cn.md
```

### 书评 Frontmatter

```yaml
---
title: "置身事内 读后：理解中国经济的底层逻辑"
pubDate: 2026-06-10
description: "一本理解中国经济发展与政府角色的入门佳作"
tags: ["政治经济学", "书评"]
bookSlug: "置身事内"                         # 关联书籍的目录名
rating: "recommended"                        # 可选，对书籍的评价
---
```

### 字段说明

| 字段 | 必填 | 说明 |
| :--- | :---: | :--- |
| `title` | ✅ | 书评标题 |
| `pubDate` | ✅ | 发布日期，格式 `YYYY-MM-DD` |
| `description` | ❌ | 书评摘要 |
| `tags` | ❌ | 标签，用于书评页展示 |
| `bookSlug` | ✅ | **关联字段**，值为书籍目录名（见下方说明） |
| `rating` | ❌ | 可选，对书籍的评价 |

### 关联书籍（bookSlug）

`bookSlug` 是书评与书籍的关联桥梁。它的值应该是 `src/content/books/` 下的**目录名**：

```
src/content/books/置身事内/zh-cn.md    →  bookSlug: "置身事内"
src/content/books/example-book/zh-cn.md  →  bookSlug: "example-book"
```

:::important
- `bookSlug` 必须与书籍的目录名**完全一致**（区分大小写）
- 一本书可以有**多篇书评**，只要多篇书评的 `bookSlug` 相同即可
- 书架详情页会自动展示所有关联的书评链接，支持点击跳转
:::

## 完整示例

### 第一步：添加书籍

创建 `src/content/books/原则/zh-cn.md`：

```yaml
---
title: "原则"
author: "瑞·达利欧"
cover: "https://img.example.com/yuanze.jpg"
tags: ["金融学", "管理学"]
rating: "recommended"
summary: "桥水基金创始人的人生与工作原则"
readDate: 2026-01-10
readTimeMinutes: 600
year: 2017
---
```

### 第二步：撰写书评

创建 `src/content/book-review/原则-读后/zh-cn.md`：

```yaml
---
title: "原则 读后：决策的底层框架"
pubDate: 2026-06-10
description: "瑞·达利欧的原则体系对个人决策的启发"
tags: ["金融学", "书评"]
bookSlug: "原则"
rating: "recommended"
---

## 核心观点

达利欧的原则体系可以概括为...
```

### 第三步：验证

运行 `pnpm build`，确认：
- 书架页面出现《原则》卡片
- 书评页面出现《原则 读后》文章
- 书架详情弹窗的「我的书评」区域显示可点击的书评链接

## 常见问题

**Q: 书评没有关联到书籍？**
A: 检查 `bookSlug` 是否与书籍目录名完全一致，注意大小写和空格。

**Q: 封面图不显示？**
A: 确认图片 URL 可访问。本地图片使用相对于 markdown 文件的路径（如 `./cover.jpg`）。

**Q: 新增领域需要改代码吗？**
A: 不需要。`tags` 是开放字段，直接写即可，系统会自动统计并展示为筛选标签。

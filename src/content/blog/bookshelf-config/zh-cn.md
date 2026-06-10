---
title: 书架页面配置指南
pubDate: 2026-06-10
description: 如何新增书籍、配置封面、填写元信息与书评，以及书架页面的各项功能说明。
category: 博客配置
image: ""
draft: false
slugId: momo/bookshelf/config
---

## 书架页面简介

书架（`/bookshelf/`）是一个独立的书籍展示页面，通过顶部导航栏进入。支持以下功能：

- **书籍列表**：网格布局展示所有已读/在读书籍
- **搜索**：按书名或作者模糊搜索
- **领域筛选**：按心理学、历史学、哲学、文学、政治经济学、社会学、金融学筛选
- **评价筛选**：按推荐 / 中庸 / 不行筛选
- **详情弹窗**：点击书籍卡片弹出浮层，展示简介、元信息与书评

---

## 新增一本书

在 `src/content/books/` 目录下，按书籍名称创建一个子目录，目录名即为英文 slug（随意取名，建议全小写英文+连字符），里面放中英文两个 `.md` 文件：

```
src/content/books/
  置身事内/                ← 目录名 = slug
    zh-cn.md
    en.md
```

### Frontmatter 字段说明

```yaml
---
title: "置身事内：中国政府与经济发展"   # 书籍名称（必填）
author: "兰小欢"                        # 作者（必填）
tags: ["政治经济学"]                     # 领域标签（必填，可多个）
rating: "recommended"                   # 评价（必填）
summary: "一部理解中国经济发展与政府角色的入门佳作。"  # 简介（可选，弹窗展示）
cover: "/covers/example.jpg"            # 封面图路径（可选，放在 public/ 下）
readDate: 2025-12-15                    # 读完日期（可选，弹窗展示）
readTimeMinutes: 480                    # 阅读耗时/分钟（可选，弹窗展示）
year: 2021                              # 书籍出版年份（可选，弹窗展示）
pinTop: 0                               # 置顶权重（可选，数字越大越靠前）
draft: false                            # 草稿（可选，true 则生产环境不显示）
---
```

### 领域可选值

`心理学` `历史学` `哲学` `文学` `政治经济学` `社会学` `金融学`

### 评价可选值

| 值 | 中文显示 | 徽章颜色 |
|---|---|---|
| `recommended` | 推荐 | 绿色 |
| `neutral` | 中庸 | 黄色 |
| `not-recommended` | 不行 | 红色 |

---

## 书评正文

Frontmatter 下方的 Markdown 正文即为**我的书评**。目前书评在弹窗中以纯文本形式展示，后续版本将支持 Markdown 富文本渲染。

```markdown
---
title: "..."
author: "..."
---

非常推荐的一本经济学入门读物。作者为中国经济的运行建立了一个大的框架...

书中对土地财政、地方债务、产业政策等热点问题都有鞭辟入里的分析。
```

---

## 封面图片

将封面图放入 `public/covers/` 目录，然后在 frontmatter 中引用：

```yaml
cover: "/covers/zhi-shen-shi-nei.jpg"
```

如果不设置 `cover` 字段，书籍卡片会显示一个书本占位图标。

---

## 完整示例

以下是 `src/content/books/置身事内/zh-cn.md` 的完整内容：

```markdown
---
title: "置身事内：中国政府与经济发展"
author: "兰小欢"
tags: ["政治经济学"]
rating: "recommended"
summary: "一部理解中国经济发展与政府角色的入门佳作。"
readDate: 2025-12-15
readTimeMinutes: 480
year: 2021
pinTop: 1
---

非常推荐。作者为中国经济的运行建立了一个大的框架...

一套严格的概念框架无疑有助于厘清问题，但也经常让人错把问题当成答案...
```

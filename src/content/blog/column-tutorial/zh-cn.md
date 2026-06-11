---
title: 如何新增一个专栏
pubDate: 2024-01-25
draft: false
description: 详细介绍如何在博客中创建专栏、为专栏添加文章，以及专栏的配置选项。
slugId: column-tutorial
tags:
  - 教程
  - 专栏
  - 博客功能
pinTop: 1
---

## 什么是专栏

专栏是独立于技术文章的系列内容划分。每个专栏代表一个成体系的主题，包含多篇相关文章。例如：

- **开发日志** — 记录博客开发过程
- **源码阅读** — 某个开源项目的源码分析系列
- **学习笔记** — 某门课程或技术的系统学习记录

专栏文章不会出现在首页的技术文章列表中，它们有自己独立的时间线页面。

## 创建一个新专栏

### 第一步：创建专栏元数据

在 `src/content/columns/` 目录下创建一个新的文件夹，文件夹名称就是专栏的 slug（用于 URL）。

```
src/content/columns/
└── my-column/           ← 专栏 slug
    ├── zh-cn.md         ← 中文元数据
    └── en.md            ← 英文元数据（可选）
```

编辑 `zh-cn.md`，填入以下 frontmatter：

```markdown
---
title: 我的专栏
description: 这是一个关于xxx的系列文章
icon: fa6-solid:book-open
pinTop: 0
draft: false
---
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 专栏标题 |
| `description` | ❌ | 专栏描述，显示在侧边栏和专栏首页 |
| `icon` | ❌ | 图标名称，使用 Iconify 格式，如 `fa6-solid:code` |
| `pinTop` | ❌ | 置顶权重，数字越大越靠前，默认 0 |
| `draft` | ❌ | 是否为草稿，生产环境下草稿不会显示 |

### 第二步：选择图标

图标使用 [Iconify](https://iconify.design/) 格式，常用前缀：

- `fa6-solid:` — FontAwesome 6 Solid
- `fluent:` — Fluent UI Icons
- `material-symbols:` — Material Symbols

可以通过 [Iconify 图标搜索](https://icon-sets.iconify.design/) 查找可用图标。

常用推荐：
- `fa6-solid:code` — 代码
- `fa6-solid:book-open` — 书本
- `fa6-solid:laptop-code` — 笔记本代码
- `fa6-solid:lightbulb` — 灯泡
- `fa6-solid:rocket` — 火箭
- `fa6-solid:pen-nib` — 笔尖

## 为专栏添加文章

### 第一步：创建文章目录

在 `src/content/column-articles/` 目录下，以专栏 slug 为名创建文件夹，然后在其中为每篇文章创建子文件夹：

```
src/content/column-articles/
└── my-column/                    ← 与专栏 slug 一致
    ├── first-article/
    │   └── zh-cn.md
    ├── second-article/
    │   └── zh-cn.md
    └── third-article/
        ├── zh-cn.md
        └── en.md
```

### 第二步：编写文章 frontmatter

```markdown
---
title: 第一篇文章
pubDate: 2024-01-20
draft: false
description: 这是文章的简要描述，会显示在时间线卡片中。
columnSlug: my-column
tags:
  - 标签1
  - 标签2
---

这里是文章正文内容，支持完整的 Markdown 语法。
```

**字段说明：**

| 字段 | 必填 | 说明 |
|------|------|------|
| `title` | ✅ | 文章标题 |
| `pubDate` | ✅ | 发布日期，用于时间线排序 |
| `draft` | ❌ | 是否为草稿 |
| `description` | ❌ | 文章描述，显示在时间线卡片中 |
| `image` | ❌ | 封面图路径 |
| `columnSlug` | ✅ | 所属专栏的 slug，必须与专栏文件夹名一致 |
| `tags` | ❌ | 文章标签数组 |

### 第三步：多语言支持

为文章添加多语言版本，只需在同一目录下创建不同语言的 `.md` 文件：

```
first-article/
├── zh-cn.md    ← 中文（默认语言）
└── en.md       ← 英文
```

如果某种语言的文件不存在，系统会自动回退到默认语言（中文）。

## 时间线展示

专栏详情页采用垂直时间线布局：

- **桌面端** — 文章卡片左右交替排列，日期显示在对侧
- **移动端** — 统一左侧排列，日期显示在卡片内部
- 文章按发布日期倒序排列（最新在上）
- 支持 AOS 滚动动画

## 配置选项

### 置顶专栏

通过 `pinTop` 字段可以让重要专栏排在前面：

```yaml
pinTop: 10  # 数字越大越靠前
```

### 草稿模式

设置 `draft: true` 可以将专栏或文章标记为草稿：

- 开发环境：草稿正常显示
- 生产环境：草稿自动隐藏

### 侧边栏显示

专栏列表会自动显示在首页左侧 ProfileCard 下方。如果没有任何专栏，该区域不会显示。

## 完整示例

下面是一个完整的「开发日志」专栏示例：

**专栏元数据** (`src/content/columns/dev-log/zh-cn.md`)：

```markdown
---
title: 开发日志
description: 记录博客开发过程中的思考与实践
icon: fa6-solid:code
pinTop: 0
draft: false
---
```

**专栏文章** (`src/content/column-articles/dev-log/first-post/zh-cn.md`)：

```markdown
---
title: 博客搭建第一天
pubDate: 2024-01-15
draft: false
description: 从零开始搭建个人博客，选择了 Astro 作为框架。
columnSlug: dev-log
tags:
  - Astro
  - 博客
---

## 为什么选择 Astro

在众多静态站点生成器中，Astro 以其独特的岛屿架构脱颖而出。
```

## 路由结构

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页侧边栏 | `/` | 专栏列表显示在 ProfileCard 下方 |
| 专栏时间线 | `/column/{slug}/` | 展示专栏所有文章的时间线 |
| 文章详情 | `/column/{slug}/{id}` | 单篇文章的完整内容 |

## 常见问题

### Q: 专栏文章会出现在首页文章列表中吗？

不会。专栏是独立于博客文章的内容体系，两者互不干扰。

### Q: 可以给专栏设置封面图吗？

目前专栏本身不支持封面图，但专栏内的每篇文章可以设置 `image` 字段作为封面。

### Q: 文章的排序规则是什么？

按 `pubDate` 倒序排列，即最新的文章显示在时间线最上方。

### Q: 如何删除一个专栏？

删除 `src/content/columns/` 和 `src/content/column-articles/` 下对应文件夹即可。

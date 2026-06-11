---
title: 主题系统设计
pubDate: 2024-01-20
draft: false
description: 设计并实现了博客的明暗主题切换系统，支持跟随系统设置。
tags:
  - 博客
---

## 主题系统的设计思路

一个好的主题系统应该让读者无感知地切换明暗模式。

### CSS 变量方案

使用 CSS 自定义属性作为主题令牌：

```css
:root {
  --text-color: #1a1a1a;
  --bg-color: #ffffff;
}

[data-theme="dark"] {
  --text-color: #e0e0e0;
  --bg-color: #1a1a1a;
}
```

### 三种模式

- **浅色模式** - 固定使用浅色主题
- **深色模式** - 固定使用深色主题
- **跟随系统** - 通过 `prefers-color-scheme` 媒体查询自动切换

用户的选择保存在 `localStorage` 中，下次访问时自动恢复。

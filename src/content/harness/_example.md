---
# 这是模板文件（文件名以 _ 开头，不会被收录），复制它来新增条目：
#
#   src/content/harness/<slug>/zh-cn.md   ← 中文
#   src/content/harness/<slug>/en.md      ← 英文（可选，缺失时回退到 zh-cn）
#   或直接 src/content/harness/<slug>.md  ← 单文件，作为默认语言条目
#
title: 条目名称
description: 一句话说明这个技能/命令是做什么的
# skill | command | agent | mcp | prompt | workflow | other（其它值会归到 other）
type: skill
# 外部链接（GitHub、文档等）
link: https://example.com
# 链接按钮上显示的文字，留空时显示「查看」
source: GitHub
author: 作者
version: 1.0.0
# 图标，留空时按 type 自动匹配（如 fa6-solid:wand-magic-sparkles）
icon: fa6-solid:wand-magic-sparkles
tags:
  - 安装
  - 示例
pubDate: 2026-01-01
pinTop: 0
draft: false
---

正文可以写安装、用法、注意事项等。

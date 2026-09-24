---
title: 第一次写 MCP APP，然后接入到 Goose 中
pubDate: 2026-08-03
slugId: mcp-app
description: 简单介绍mcpapp,以及mcpapp 介入到mcp客户端并成功跑通
draft: false
tags: [harness]
---

记录开发了一个能够动态监视北斗和 GPS 在全球任意地点的可视角度的工具，并且能够接入主流的 Agent, 包括但不限于 Claude code, codex 等
为了开拓思维边界，这次尝试使用 [goose](https://github.com/aaif-goose/goose) 。他用rust编写，性能高，拓展性强。可以用 rust sdk + http api 把agent嵌入到业务系统中

<video src="https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260805190223456.mp4" autoplay muted loop playsinline style="width:100%; border-radius:8px;"></video>  

互动效果用 `three.js` 做的
<video src="https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260805191804767.mp4" autoplay muted loop playsinline style="width:100%; border-radius:8px;"></video>  

使用下面的 skybridge 开发, [快速开始](https://docs.skybridge.tech/get-started/introduction), 这个框架也是专门用作 mcp app 的。用 React 提供页面可视化效果(app)
::github{repo="alpic-ai/skybridge"}

这个天桥框架是开源的一个MCP APP框架
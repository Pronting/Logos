---
title: deepseek-harness 尝鲜——框架很好，但瑜不掩瑕
pubDate: 2026-08-14
slugId: deepseek-harness
image: "https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815133808730.png"
description: deepseek-harness / dsh 尝鲜，搭配 deepseek-v4-pro正式版到底工程能力如何？
draft: false
tags: [harness]
---
# 引言

8 月 14 日凌晨，[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) 横空出世。就在前一天 deepseek-v4-pro-0813 正式版刚发布，并没有跃迁式的提升，相当于DeepSeek-V4-plus的提升就显得捉襟见肘

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815121110134.png)

也就是说，相较于原版 flash，正式版的 Agent 和 coding 能力提升了 100%，大约一倍左右，而模型的整体能力提升约 25%~30%  这是相当恐怖的提升了


反观看看 pro
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815121724169.png)

相较于正式版的flash，整体能力只强 10%~12%。相较于原版，它的提升幅度也比 flash 低了不少。

好了让我们步入正题，看看万众瞩目的 dsh 到底实力怎么样？是骡子是马拿出来溜溜


<video src="https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815130347168.mp4" autoplay muted loop playsinline style="width:100%; border-radius:8px;"></video>


# 安装与推荐配置/插件

::github{repo="deepseek-ai/deepseek-harness"}



安装脚本如下
```bash
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```


启动在 3080 端口，打开浏览器
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815132644905.png)

在设置页面支持配置第三方提供方
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815132808016.png)


下面是丰富的插件生态，按需安装



| 插件                                                   | 描述                                           |
|------------------------------------------------------|----------------------------------------------|
| [toolkit](https://github.com/omdsh-dev/dsh-toolkit)  | 时间、编码、JSON、计算器、CSV、正则、Markdown、Diff 等确定性工具合集 |
| [web-ui](https://github.com/zhu1090093659/dsh-web-ui) | 为deepseek-harness提供了一套可替换的皮肤 ui              |
| [modlens](https://github.com/liustack/modlens) | DeepSeek Harness 视觉插件，为 DeepSeek、GLM 等纯文本模型外挂视觉能力，粘贴图片即得结构化 JSON 证据（OCR、版面、语义）             |
| [deepseek-harness-action](https://github.com/Lixiaoyiao/deepseek-harness-action) |  DeepSeek Harness 的 GitHub 自动化工具——AI 代码审查、持续集成诊断、自动修复、问题处理到 Pull Request 提交的全流程自动化处理             |
# 第一印象
第一感觉这不就 Codex 那个味道吗？多项目管理，多线程会话，权限控制，插件还支持宠物


这缓存命中率大的惊人，一般在 99% 甚至到 100 %
![](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815205000111.png)


做plan 的时候也很惊艳
![](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260815210331550.png)

# 工程化能力体现




# 总结








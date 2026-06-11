---
title: ECC(Everything Claude Code) 项目演进过程
pubDate: 2026-06-02
slugId: ecc-harness
image: "title.png"
description: 200k开源项目是如何平地起高楼的，从设计理念开始让你重新了解claude code
draft: false
tags: [harness]
---

今天偶然间发现了一个开源项目:

::github{repo="affaan-m/ECC"}

看完以后我给予了高度评价: _==一个通用的 Harness 框架==_


# 项目介绍
> 来自 Anthropic 黑客马拉松获胜者的完整 Claude Code 配置集合。 
> 不止是配置文件，而是一整套完整系统：技能体系、本能行为、记忆优化、持续学习、安全扫描，以及研究优先的开发模式。 
> 包含可直接用于生产环境的智能体、技能模块、钩子、规则、MCP 配置，以及兼容传统命令的适配层
> 可在 Claude Code、Codex、Cursor、OpenCode、Gemini 及其他 AI 智能体框架中通用。


[安装指南](https://github.com/affaan-m/ECC/blob/main/README.zh-CN.md#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)


安装完成观察Claude Code
* 新增 269 个skills
* 新增 5 个 mcp
* 新增 63 个子代理 subagent
* 新增若干 rules

> 可能有些小伙伴就要问了: 为什么相比而言 mcp 数量如此之少？

这里引用原作者文章的一段话来回复:
> 因为 mcp 对比 cli 太重了，mcp是对cli 的封装，mcp也是一个不错的封装，为了让 CLI 的功能更接近 MCP，但又无需实际使用 MCP（以及随之而来的较小的上下文窗口），可以考虑将功能打包成技能和命令。剥离 MCP 提供的那些简化操作的工具，并将它们转换为命令。



所以看到了为何skills如此庞大了把，本质上都是被打包为 CLI 与 SKILLS 。想必大家都清楚了吧！好,下面来简单看看这个项目

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260611113025659.png)
庞大的技能库与相关mcp占据了 33k 上下文，对于我来说勉强可以接受。但是它带给你的是数不清的技能组合，开发命令。下面简单介绍一下有代表的 skills, agents 帮助大家对这个项目有初步的了解

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260611124554536.png)

可以看到有擅长不同语言的子代理
1. 负责优化harness工程
2. 自我迭代agent, 
3. 负责长任务loop循环的agent
4. 负责网络配置的agent

这些都是无感的，也就是说不需要和命令一样显示声明，claude自动在合适的任务中启动合适的agent来完成专业的任务


skills 略过, 在日常开发中只需要记住常用的命令即可，通过命令即可调用底层标准化skills，在本文末尾我也会介绍我常用的命令以及开发流程






# 设计理念

| [![The Shorthand Guide to Everything Claude Code](https://private-user-images.githubusercontent.com/124439313/537241459-1a471488-59cc-425b-8345-5245c7efbcef.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODExNDg3NTYsIm5iZiI6MTc4MTE0ODQ1NiwicGF0aCI6Ii8xMjQ0MzkzMTMvNTM3MjQxNDU5LTFhNDcxNDg4LTU5Y2MtNDI1Yi04MzQ1LTUyNDVjN2VmYmNlZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwNjExJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDYxMVQwMzI3MzZaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT03YWU5MzBhNWVjOGI0MDljZmY5YzVhZmFkNWZiMTNjNGNkNWE5YWYzMjQ5N2IzMzY0N2NjMzZkMWM3MWUyM2RjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.B-d24ftYxUVs-oYojl2ciHuftMyEN93I_LD5Z-R3WMI)](https://x.com/affaanmustafa/status/2012378465664745795) | [![The Longform Guide to Everything Claude Code](https://private-user-images.githubusercontent.com/124439313/538747339-c9ca43bc-b149-427f-b551-af6840c368f0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODExNDg3NTYsIm5iZiI6MTc4MTE0ODQ1NiwicGF0aCI6Ii8xMjQ0MzkzMTMvNTM4NzQ3MzM5LWM5Y2E0M2JjLWIxNDktNDI3Zi1iNTUxLWFmNjg0MGMzNjhmMC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwNjExJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDYxMVQwMzI3MzZaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hMTFjMWUwZWFiNjc4ZGY3ODZkM2ViMDEzMjI2OTVlNTkwYjIyYTQ0MjJjN2ZmOWZlZDc4ZDNjZjliNTEwMDQyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9aW1hZ2UlMkZwbmcifQ.51codMe3o9SWiIZKw8xK8vIvKsNLRDKLMqjaBR0KCQs)](https://x.com/affaanmustafa/status/2014040193557471352) | [![The Shorthand Guide to Everything Agentic Security](https://github.com/affaan-m/ECC/raw/main/assets/images/security/security-guide-header.png)](https://x.com/affaanmustafa/status/2033263813387223421) |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **精简指南**   设置、基础、理念。 **先读这个。**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | **详细指南**   Token 优化、内存持久化、评估、并行化。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | **安全指南**   攻击向量、沙箱技术、数据净化、CVE漏洞、Agent防护                                                                                                                                                                    |

作者编写了3篇由浅入深的文章简洁了设计理念，下面我将讲述作者的设计理念(参考上面3篇文章)

## 技能与命令的设计：固化重复工作流

在设计技能和命令时，需要聚焦实际开发痛点，例如代码导航或检查点更新。可以创建一个更新codemaps的技能，让AI在关键节点快速定位代码库结构，而不必消耗大量上下文去反复探索。命令的设计原则是按需触发和链式组合，确保AI能高效响应，而不是依赖冗长的提示。

此外，规则文件（`.rules`文件夹或`CLAUDE.md`）定义持久约束，比如要求代码库中不使用表情符号、部署前必须测试、优先采用模块化代码而非巨型文件。这些规则为所有交互提供基础框架，让AI的行为保持一致性和可靠性。

## 钩子的设计：事件驱动的主动干预

钩子是ECC中实现主动管理的关键机制，它基于生命周期事件自动干预上下文和风险管理。常见类型包括PreToolUse（工具执行前进行校验）、PostToolUse（执行后格式化和反馈）、UserPromptSubmit、Stop（会话结束时）和PreCompact（压缩前处理）。

通过这些钩子，可以自动化重复的运维工作，例如在运行长命令前提醒使用tmux，或在会话结束时自动提取有价值的模式并生成新的技能。hookify插件允许用自然语言描述需求即可生成配置，从而将事件驱动的自动化嵌入日常流程，形成自我改进的闭环。

## 子代理与MCP的设计：分治上下文与外部集成

子代理让主代理能将有限范围的任务委托出去，每个子代理只加载必要的工具和技能，避免主上下文迅速膨胀。设计时需为每个子代理明确允许的工具和权限，甚至可以沙箱隔离以提升安全性。

MCP作为prompt驱动的外部服务包装器，例如直接通过Supabase MCP执行SQL操作。设计重点是按需启用，避免同时加载过多MCP导致可用上下文从200k锐减到70k。建议配置20-30个MCP但仅激活少量，并结合git worktrees处理并行任务，从而通过架构手段解决token经济问题。

## 记忆与持续学习的设计：构建自我改进闭环

记忆机制强调跨会话的持久化，通过session logs和钩子自动总结关键信息。可以在技能中加入进度总结逻辑，保存到临时文件供后续会话直接加载。Stop钩子特别适合在会话结束时分析记录、提取可复用模式，并自动存入`~/.claude/skills/learned/`目录。

CLI的系统prompt注入则提供更高优先级的上下文加载，用于严格规则或特定场景的持久记忆，让AI随着使用不断积累知识，成为真正持续学习的助手。

# 常用指令


## 持续学习
先来介绍一个命令 `/continuous-learning-v2`
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260607172903023.png)
这个一个自发的 instinct(本能)， 有着 confidence scoring 可以评估可信度,v2版本减少了大模型的幻觉问题

![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260611113933200.png)

作用可以在项目级 scope 下将 session 确定性行为以文件(文件后缀-instinct)的方式沉淀, 后续会话会加载文件内容。与之相关的还有 `/ecc: learn-eval` 和 `/ecc: save-session` 提炼本次信息与记忆

我们可以通过 `/instinct-status` 查看对于本项目的本能与学习状态

在作者介绍页可以看到 ==持续学习== 成体系的规划为多个命令
> 基于直觉的学习系统自动学习你的模式：完整文档见 [continuous-learning-v2](https://github.com/affaan-m/ECC/tree/main/skills/continuous-learning-v2) 。
```
/instinct-status        # 显示带有置信度的学习直觉
/instinct-import <file> # 从他人导入直觉
/instinct-export        # 导出你的直觉以供分享
/evolve                 # 将相关直觉聚类到技能中
/promote                # 将项目级直觉提升为全局直觉
/projects               # 查看已识别项目与直觉统计
```




## 测试相关命令
在测试方面 ecc 封装了2个常用指令
1. `/ecc:e2e-testing` : 端到端测试,得益于插件内部的 **playwright** mcp,能够让 agent 实现自动化测试流程
2. `/ecc:tdd-testing` : tdd 单元测试


除了以上通用性测试，还有针对不同语言，框架的测试
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260611125541602.png)



## 日常开发流
这是我的开发流程，有了 ecc 以后，开发基本上是通过命令驱动
![image.png](https://pront-base-1318237185.cos.ap-guangzhou.myqcloud.com/20260611115859933.png)
```text
/ecc:multi-plan feat: 优化网站ui 然后 /ecc:e2e-testing 保证 100% 覆盖，设置独立的subagent /ecc:code-review ,提交
  /ecc:pr 最后 /ecc:learn-eval 提炼本次内容
```
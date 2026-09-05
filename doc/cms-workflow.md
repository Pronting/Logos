# CMS Workflow (Issues → Astro content) — 开发期使用手册

> 状态：**开发期**。当前分支 `feat/cms-from-issue`，**不**推 `main`。所有 issue 内容由本地脚本处理。

## 整体流程

```
[写代码]                     [写文章]                          [上线]
开发者在 feat 分支上写代码    开发者开 Issue（填 YAML 围栏）     验证完毕 →
提交 → push 到 feat/cms-*   Action 跑：parse → validate       开发者开 PR
                            → render → commit 到 feat 分支      → merge 到 main
                                                              → 服务器部署
```

## 1. 怎么开一条有效的 issue

在 issue body **第一行**开始贴下面这个模板（按你写的分类替换 `category` 和字段）：

### blog 模板

```markdown
```yaml
category: blog
title: 我的新文章标题
slug: my-new-post
pubDate: 2026-06-14
slugId: my-new-post
description: 一句话描述
tags: [教程, 解决方案]
image: title.png
draft: false
```
## 正文从这里开始
支持完整 Markdown。图片可外链，也可直接粘贴到 issue 评论里（自动下载为 `<slug>.png`）。
```

### book 模板

```markdown
```yaml
category: book
title: 乡土中国
slug: xiangtu-zhongguo
author: 费孝通
cover: https://example.com/cover.jpg
tags: [社会学, 经典]
rating: recommended
summary: 一句话总结
briefComment: 我的短评……
readDate: 2025-01-15
year: 1947
```
## 长正文
…
```

### book-review 模板

```markdown
```yaml
category: book-review
title: 评《乡土中国》
slug: review-xiangtu
pubDate: 2026-06-14
slugId: review-xiangtu
bookSlug: xiangtu-zhongguo
rating: recommended
tags: [书评, 社会学]
```
## 评论正文
…
```

> `bookSlug` 必须是 `src/content/books/<slug>/` 中已存在的目录名（不含 .md）。

### column 模板

```markdown
```yaml
category: column
title: 我的专栏
slug: my-column
description: 专栏简介
icon: 📚
tags: [个人]
```
```

### article 模板

```markdown
```yaml
category: article
title: 转载的好文标题
slug: external-article-1
link: https://example.com/original-article
pubDate: 2026-06-14
description: 简要说明
tags: [好文]
```
```

## 2. 字段规则（必填 / 可选）

| Category | 必填 | 可选 |
|---|---|---|
| **blog** | category, title, slug, pubDate, slugId | description, image, cover, tags, pinTop, draft, body |
| **book** | category, title, slug, author, tags, rating | cover, summary, briefComment, readDate, readTimeHours, year, pinTop, draft, body |
| **book-review** | category, title, slug, pubDate, slugId, bookSlug | rating, description, image, cover, tags, pinTop, draft, body |
| **column** | category, title, slug | description, icon, image, cover, tags, pubDate, pinTop, draft, body |
| **article** | category, title, slug, link, pubDate | description, image, cover, tags, pinTop, draft, body |

规则：
- `slug` 必须 `^[a-z0-9-]+$`（小写字母数字 + 连字符，不能以 `-` 开头/结尾）
- `pubDate` 格式 `YYYY-MM-DD`
- `tags` 是数组（可多选）
- `bookSlug` 必须指向已存在的 books 目录
- `readTimeHours` 以小时填写，支持非负小数，例如 60 分钟填 `1`、90 分钟填 `1.5`、480 分钟填 `8`；未知时省略。

## 3. 怎么本地测试（不开 issue）

```bash
# 在 worktree 目录
cd "C:/Users/22331/Desktop/blog/Logos/.claude/worktrees/feat+cms-from-issue"

# 跑单元测试
pnpm test
# 预期：14 passed

# 手动跑流水线
mkdir -p /tmp/cms-fake/src/content/books/flyd
echo "---\ntitle: t\n---" > /tmp/cms-fake/src/content/books/flyd/zh-cn.md

# 写一个 issue body 到文件
cat > /tmp/issue.json <<'EOF'
{
  "issue": {
    "number": 999,
    "title": "test",
    "user": {"login": "tester"},
    "body": "```yaml\ncategory: book-review\ntitle: 测试\nslug: t-1\npubDate: 2026-06-14\nslugId: t-1\nbookSlug: flyd\n```\n## 正文\n..."
  }
}
EOF

# parse → validate → render
CMS_REPO_ROOT=/tmp/cms-fake node script/cms/parse-issue.mjs /tmp/issue.json
CMS_REPO_ROOT=/tmp/cms-fake node script/cms/validate.mjs .cms-tmp/payload.json
CMS_REPO_ROOT=/tmp/cms-fake node script/cms/render.mjs .cms-tmp/payload.json --out /tmp/cms-fake/src/content

# 看结果
cat /tmp/cms-fake/src/content/book-review/t-1/zh-cn.md
```

## 4. 翻译（en.md）

- 翻译由 `translate.mjs` 调用 OpenAI 兼容 API（默认 DeepSeek）完成
- 配置项（GitHub repo → Settings → Secrets and variables → Actions）：
  - `LLM_BASE_URL`（默认 `https://api.deepseek.com/v1`）
  - `LLM_API_KEY`（必填）
  - `LLM_MODEL`（默认 `deepseek-chat`）
- 翻译失败 → en.md 写 `# TODO: translate` 占位，**zh-cn 正常发布**
- 可后续 PR 改 en.md

## 5. 当前未启用功能

- `.github/ISSUE_TEMPLATE/*.yml` 5+1 个官方模板（Phase 2，未做）
- `.github/workflows/cms-from-issue.yml`（生产，推 main，**不**启用）
- `.github/workflows/cms-from-issue-test.yml`（测试，推 feat 分支，**不**启用）
- `.github/workflows/deploy-server.yml`（服务器部署，**不**启用）

**当前阶段全靠本地脚本手动跑**——验证通过后再决定是否启用 workflows。

## 6. 上线流程

1. 验证完所有功能后，开发者开 PR `feat/cms-from-issue → main`
2. Review + merge
3. 服务器部署由 `.github/workflows/deploy-server.yml` 触发（如已启用）
4. 服务器 build 失败 → 自动回滚到上一个 `logos:prev` 镜像

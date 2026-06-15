# 服务端部署指南（CD）

本文档说明如何从零配置 **GitHub Actions → SSH → Docker 蓝绿部署**，
让 `main` 分支每次 push 自动更新到 `106.53.173.60` 服务器上的 `logos-app` 容器。

---

## 1. 架构总览

```
[git push main]
      │
      ▼
[GitHub Actions: deploy.yml]
      │  (appleboy/ssh-action + password)
      ▼
[SSH 登录 ubuntu@106.53.173.60]
      │
      ▼
[服务器脚本] ── set -euo pipefail
   ├── 1. git fetch + reset --hard origin/main
   ├── 2. docker tag logos-app:latest logos-app:prev        # 备份
   ├── 3. pnpm install --frozen-lockfile && pnpm build
   ├── 4. docker build -t logos-app:new
   ├── 5. docker stop+rm → docker run -d -p 9090:80 logos-app:new
   └── 6. curl http://localhost:9090/  (6×5s)
            ├─ 成功 → docker tag new latest → 部署完成
            └─ 失败 → docker run logos-app:prev  → 回滚
```

**关键约定**：
- 容器名 / 镜像名 = `logos-app`（与你服务器现状一致）
- 端口 = `9090 → 80`（避开 1Panel openresty 占用的 80 端口）
- 健康检查 = `http://localhost:9090/`（测容器本身，绕开反代）

---

## 2. 服务器前置准备（首次部署一次性配置）

> 服务器现状（已确认）：Ubuntu 22.04.4 / docker 27.0.3 / git 2.34.1 / 1Panel-openresty 监听 80

### 2.1 安装缺失工具（pnpm / corepack）

Ubuntu 22.04 默认无 corepack，但项目构建需要 pnpm。**两种方案**：

**方案 A（推荐）**：装 Node.js 22 → corepack 自带 → 一行启用 pnpm
```bash
# 在服务器上
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
sudo corepack enable
corepack prepare pnpm@10 --activate
pnpm --version    # 确认装上
```

**方案 B**：直接装 pnpm（不需要 Node 工具链，但缺 Node 跑不了 Astro 构建）
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

> **强烈建议方案 A**，因为 Dockerfile builder 阶段也是 node:22-alpine + corepack，对齐版本。

### 2.2 准备项目目录 + 首次 git clone

```bash
# 在服务器上
sudo mkdir -p /home/ubuntu/Logos
sudo chown ubuntu:ubuntu /home/ubuntu/Logos
cd /home/ubuntu/Logos

# 克隆仓库
git clone https://github.com/<你的用户名>/Logos.git .

# 切到 main，确认能 fetch
git checkout main
git pull
```

### 2.3 （可选）首次手动跑通一遍构建 + 运行

在配 GitHub Actions 之前，先手动模拟一次完整流程，确认所有工具链 OK：

```bash
cd /home/ubuntu/Logos
pnpm install --frozen-lockfile
pnpm build
docker build -t logos-app:test .
docker stop logos-app 2>/dev/null
docker rm   logos-app 2>/dev/null
docker run -d --name logos-app -p 9090:80 --restart unless-stopped logos-app:test
sleep 3
curl -fsS http://localhost:9090/ | head -20   # 应看到 HTML
```

测试 OK 后：
```bash
# 把 test 镜像打成 latest，作为后续蓝绿部署的 prev 源
docker tag logos-app:test logos-app:latest
```

### 2.4 1Panel OpenResty 反代确认

确认 1Panel 把域名反代到 `127.0.0.1:9090`：

```bash
docker exec 1Panel-openresty-VPyk sh -c 'cat /usr/local/openresty/nginx/conf/nginx.conf' 2>/dev/null \
  | grep -E "server_name|proxy_pass" | head -20
```

应看到 `proxy_pass http://127.0.0.1:9090;` 或类似配置。
**反代是 1Panel 的责任，CD 脚本不动反代**。

---

## 3. GitHub Secrets 配置

进入 GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**。

| Secret Key | 你的值示例 | 必填 | 说明 |
|---|---|---|---|
| `SERVER_HOST` | `106.53.173.60` | ✅ | 服务器 IP 或域名 |
| `SERVER_USER` | `ubuntu` | ✅ | SSH 登录账号 |
| `SERVER_PASSWORD` | （新密码，建议先去服务器改） | ✅ | SSH 登录密码 |
| `DEPLOY_PATH` | `/home/ubuntu/Logos` | ✅ | 服务器上项目目录 |
| `DEPLOY_PORT` | `22` | ⚪ 可选 | SSH 端口，默认 22 |
| `DEPLOY_HEALTH_URL` | `http://localhost:9090/` | ⚪ 可选 | 健康检查 URL，默认同左 |

> **安全提醒**：把明文密码存在 Secret 是 GitHub 官方支持的（运行时加密注入 + 日志脱敏），但**更安全的长期方案**是改用 SSH 公私钥。
> 切换方式：服务器 `ssh-keygen` 生成密钥对 → 公钥追加到 `~/.ssh/authorized_keys` → Secret 改为存私钥 + workflow 中 `appleboy/ssh-action` 的 `key:` 字段替换 `password:` 字段。本次先用密码方案（按你要求），后续可升级。

---

## 4. 触发与回滚

### 4.1 触发条件
`main` 分支 push **且**改动了以下任一路径：
- `src/content/**`（内容）
- `src/pages/**` / `src/components/**` / `src/i18n/**`（代码）
- `src/config.ts` / `astro.config.mjs`（配置）
- `package.json` / `pnpm-lock.yaml`（依赖）
- `Dockerfile` / `nginx.conf`（容器配置）
- `public/**`（静态资源）

> 改 README、`.claude/`、screenshot 等**不会**触发部署，省一次拉包 + 构建。

### 4.2 镜像标签
每次部署成功后，服务器上存在 3 个 tag：
- `logos-app:latest` ← 当前线上版本
- `logos-app:new` ← 同 latest（部署完被 tag 覆盖）
- `logos-app:prev` ← 上一次成功的版本
- `logos-app:YYYYMMDDHHMMSS` ← 历史时间戳（用于事后追查，**只保留当次的**）

### 4.3 手动回滚（紧急情况）
```bash
# SSH 到服务器
ssh ubuntu@106.53.173.60

# 1. 看当前容器状态
docker ps -a | grep logos-app
docker inspect logos-app --format='{{.Config.Labels.commit}}' 2>/dev/null

# 2. 切到 prev
docker stop logos-app
docker rm   logos-app
docker run -d --name logos-app -p 9090:80 --restart unless-stopped logos-app:prev

# 3. 验证
curl -fsS http://localhost:9090/ | head
```

### 4.4 查看历史 commit 标签
```bash
docker inspect logos-app --format='{{.Config.Labels.commit}}'
docker inspect logos-app --format='{{.Config.Labels.deployed_at}}'
```

---

## 5. 演练：故意制造失败 → 验证回滚

### 5.1 演练 A：构建失败（pnpm build 报错）
```bash
# 在本机 main 分支故意改坏
echo "// syntax error" >> src/components/Hero.astro
git add . && git commit -m "test: break build" && git push origin main
```
→ 观察 Actions 标红 → 服务器上**不会有新容器**（脚本在 `pnpm build` 阶段就退了）。
→ 现有 `logos-app` 容器**继续运行旧版**（因为没有 stop+rm）。**这是预期行为**。

> 这是为什么：本脚本的设计是"成功才切流"，避免构建失败的代码直接覆盖生产。
> 如果希望"构建失败也强制更新 + 容器不健康自动回滚"，把脚本改成"先 build → 不论成败都切流"——但风险更高，不推荐。

### 5.2 演练 B：健康检查失败（容器起来但 nginx 没响应）
```bash
# 在本机 main 分支
cat > nginx.conf <<'EOF'
server { listen 9999; server_name _; root /tmp; }
EOF
git add nginx.conf && git commit -m "test: bad nginx" && git push origin main
```
→ 容器被 stop+rm → 新容器跑起来但 80 端口没监听 → 6 次 curl 全失败 → 自动切到 `logos-app:prev` → Actions 标红。
→ 验证回滚生效：
```bash
docker ps -a | grep logos-app    # 应仍在 Up
docker inspect logos-app --format='{{.Config.Image}}'   # 应是 logos-app:prev
curl -fsS http://localhost:9090/ | head   # 应有 HTML
```

演练完记得把 `nginx.conf` 改回原样并 push 一次正确版本。

---

## 6. 常见问题

| 现象 | 原因 | 排查 |
|---|---|---|
| Actions 报 `Permission denied (publickey,password)` | 密码错 / 服务器禁用了密码登录 | 服务器 `sudo cat /etc/ssh/sshd_config \| grep PasswordAuthentication` |
| 报 `port 9090 is already allocated` | 旧 `logos-app` 容器没停干净 | 服务器 `docker ps -a \| grep logos-app && docker rm -f logos-app` |
| 健康检查 6 次都失败 | 容器内 nginx 没起 / 端口不对 | 服务器 `docker logs logos-app` 看启动日志 |
| 部署成功但域名访问 502 | 1Panel openresty 反代目标错了 | 服务器 `docker exec 1Panel-openresty-VPyk sh -c 'cat /usr/local/openresty/nginx/conf/nginx.conf' \| grep proxy_pass` |
| Actions 报 `fatal: not a git repository` | `DEPLOY_PATH` 错 | SSH 上去 `ls /home/ubuntu/Logos/.git` 确认 |
| `corepack` 命令不存在 | Ubuntu 22.04 装的是 Node 18 不带 corepack | 按 §2.1 装 Node 22 |

---

## 7. 不在本文档范围

- HTTPS 证书 / Let's Encrypt（由 1Panel 单独管理）
- 多副本 / 负载均衡（个人博客单容器足够）
- 监控告警（Healthchecks.io / UptimeRobot，后续单独加）
- SSH 公私钥改造（密码方案先用，后续可升级）

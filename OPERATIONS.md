# Logos 运维 SOP

给新 Agent 用。事实型，不讲废话。服务器是 `106.53.173.60`（腾讯云 Ubuntu + 1Panel），博客域名 `pront.site`，GitHub 仓库 `Pronting/Logos`。

---

## 0. SSH 与基本

```bash
ssh -o ServerAliveInterval=30 ubuntu@106.53.173.60
# 反复连 5-7 次会被踢（fail2ban/sshguard），报错 Permission denied / Broken pipe。
# 解决：sleep 30~60 等冷却，或加 NumberOfPasswordPrompts=1。
```

---

## 1. 部署链路（一次 push 触发的所有动作）

代码 push 到 `main` → GitHub Actions `appleboy/ssh-action` 进服务器跑 `script/deploy-reverse-proxy.sh` 周边：

1. `git pull`（worktree 实际是 `Logos` 本机 clone，主分支就是工作分支）
2. `pnpm install --frozen-lockfile && pnpm build`
3. `docker build -t logos-app:new -t logos-app:<ts>`
4. 蓝绿切流：`stop+rm logos-app` → `run -d -p 9090:80 --restart unless-stopped logos-app:new`
5. 健康检查（curl `http://localhost:9090/` 最多 6×5s）
6. `tag logos-app:new = logos-app:latest`（覆盖前一个 latest）
7. 调 `script/deploy-reverse-proxy.sh`（见 §2）

回滚：失败时 `docker run logos-app:prev` 顶回去。

GitHub Secrets 必有：

- `SERVER_HOST` = `106.53.173.60`
- `SERVER_USER` = `ubuntu`
- `SERVER_PASSWORD`
- `DEPLOY_PATH` = `/home/ubuntu/logos`（git 仓库，含 .git）
- `DEPLOY_HEALTH_URL` = `http://localhost:9090/`
- `PUBLIC_DOMAIN` = `pront.site`（**新增**；不设则脚本回退到 `HEALTH_URL` 的 host，再回退到第一张网卡 IP，但证书匹配会失败）

---

## 2. `script/deploy-reverse-proxy.sh`（HTTPS 反代同步）

部署脚本调它，做的事：

1. 删残留静态网站 server 块：`/opt/1panel/apps/openresty/openresty/conf/default/logos.conf`（如存在）
2. 从 1Panel DB 抽证书：`sudo sqlite3 /opt/1panel/db/agent.db "SELECT pem FROM website_ssls WHERE primary_domain LIKE '${DOMAIN}%' ORDER BY id DESC LIMIT 1;"` → 写 `/opt/1panel/www/sites/logos/ssl/cert.pem`；同样抽 `private_key` → `privkey.pem`
3. 证书过期检查：`< 30 天` 在 actions log 打红色告警（不 fail deploy）
4. 渲染 `/opt/1panel/www/conf.d/logos.conf`（HTTP 301→HTTPS + HTTPS 反代 9090）
5. 在 openresty 容器内 `nginx -t && nginx -s reload`
6. 端到端校验：HTTP 301、HTTPS 内容 md5 与 `:9090` 容器一致 → `✅ HTTPS 反代已同步`

脚本里所有路径都是写死的，**任何反代同步异常不 fail deploy**（蓝绿已成功，新容器已 OK）。

---

## 3. 1Panel 关键路径

| 用途 | 路径 |
|---|---|
| openresty 容器名 | 自动发现 `docker ps \| grep -iE openresty`（实际是 `1Panel-openresty-VPyk` 这种带 hash 的） |
| 宿主机 conf.d | `/opt/1panel/www/conf.d/`（自定义反代放这里） |
| 宿主机默认 conf（1Panel 自动生成） | `/opt/1panel/apps/openresty/openresty/conf/default/`（**优先级比 conf.d 高**，会 shadow 你写的反代） |
| 1Panel 网站根 | `/opt/1panel/www/sites/`（子目录如 `logos/`、`ishwe/`） |
| 1Panel DB（证书/网站/Acme/DNS） | `/opt/1panel/db/agent.db`（sqlite3） |
| 1Panel DB（系统用户/操作日志） | `/opt/1panel/db/core.db`、`/opt/1panel/db/1Panel.db` |
| openresty 容器内 nginx | `/usr/local/openresty/nginx/conf/nginx.conf`（宿主机没 `nginx` 命令，必须 `docker exec` 进容器） |

`nginx -t` / `nginx -s reload` 必须在容器内跑：

```bash
docker exec $(docker ps --format '{{.Names}}' | grep -iE openresty | head -1) sh -c 'nginx -t && nginx -s reload'
```

---

## 4. SSL 证书（TrustAsia DV，90 天）

| 字段 | 值 |
|---|---|
| 颁发 | TrustAsia DV TLS RSA CA 2024（腾讯云免费） |
| 域名 | `pront.site` + `www.pront.site`（SAN） |
| 有效期 | 2026-06-16 ~ 2026-09-14（90 天） |
| 落盘 | `/opt/1panel/www/sites/logos/ssl/{cert,privkey}.pem` |
| 权限 | cert 644, key 600, owner root |

**续期流程（手动）**：

1. 腾讯云控制台 → SSL 证书 → 重新申请（DNS 验证，腾讯云可自动加 TXT 记录）
2. 下载 nginx 包（`xxx.pem` + `xxx.key`）
3. 1Panel 后台 → 证书 → 上传证书 → 粘 PEM/key 全文 → 保存（库名 `pront.site`）
4. **不要**在 1Panel 后台建 website 记录（会跟手写 conf 冲突）—— deploy 脚本会从 DB 自动抽到 `cert.pem`，reload openresty
5. 或者不经过 1Panel 后台：直接 `vim /opt/1panel/www/sites/logos/ssl/cert.pem` 替换 PEM 内容，`reload`

证书 < 30 天时下次 deploy log 会自动告警，提示去 1Panel 后台换证书。

---

## 5. 反代配置（`/opt/1panel/www/conf.d/logos.conf`）

```nginx
# Managed by Logos deploy. Do not edit by hand.

# HTTP -> HTTPS
server {
    listen 80;
    server_name 106.53.173.60 pront.site www.pront.site;
    return 301 https://$host$request_uri;
}

# HTTPS reverse proxy
server {
    listen 443 ssl;
    http2 on;
    server_name 106.53.173.60 pront.site www.pront.site;

    ssl_certificate     /www/sites/logos/ssl/cert.pem;
    ssl_certificate_key /www/sites/logos/ssl/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    location / {
        proxy_pass http://127.0.0.1:9090;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_http_version 1.1;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }
}
```

`ishwe.conf` 在 `conf.d/` 里只监听 8080，反代到 `:3000` / `:8000`（别人的项目，与 logos 无关）。

---

## 6. 1Panel 踩过的坑（必读）

### 6.1 静态网站 server 块会 shadow 反代
**症状**：actions 成功、容器新内容正常，但 `http://<ip>/` 还是旧内容。
**根因**：1Panel 的"静态网站"功能在 `conf/default/<name>.conf` 写 server 块，**加载顺序在 `conf.d/` 之前**，会赢。
**判定**：`nginx -t` 时报 `conflicting server name "<domain>" ... ignored` —— 冲突的就是元凶。
**修复**：
```bash
sudo rm -f /opt/1panel/apps/openresty/openresty/conf/default/logos.conf
docker exec <openresty> sh -c 'nginx -t && nginx -s reload'
```
**预防**：deploy 脚本每跑都自动清一遍。

### 6.2 1Panel 后台上传证书 ≠ 网站能用
**症状**：1Panel → 证书显示"正常"，但 `https://<domain>/` 报错。
**根因**：1Panel 把证书存到 `agent.db` 的 `website_ssls` 表，但**没自动写到 nginx conf**。1Panel 自动写 conf 是在你建 website 记录时才发生的。
**修复**：要么走 1Panel 后台建 website（适合纯静态站），要么**手写 conf 直接引用证书文件**（当前做法，deploy 脚本维护）。

### 6.3 `agent.db` 里的证书元数据 ≠ 落盘证书
**症状**：1Panel 后台显示证书已上传，但 `/opt/1panel/apps/openresty/openresty/conf/ssl/` 只有装 1Panel 时的占位证书（`CN=localhost`，有效期 100 年）。
**根因**：1Panel 只在 website 记录被建立且绑定 ssl_id 时才把证书复制到 openresty 的 ssl 目录。手写 conf 路径下永远不会被复制。
**修复**：deploy 脚本自己从 `agent.db` 抽 PEM/key 落到 `/opt/1panel/www/sites/logos/ssl/`。

### 6.4 `agent.db` 里的 `websites` 表是空的
这是当前故意保持的状态（避免 1Panel 自动生成的 conf 跟手写 conf 冲突）。**禁止**在 1Panel 后台建 website 记录，除非先删除手写 `conf.d/logos.conf`。

### 6.5 `00.default.conf` 是 `default_server`
`/opt/1panel/apps/openresty/openresty/conf/default/00.default.conf` 里：
```nginx
server {
    listen 80 default_server;
    server_name _;
    root /usr/share/nginx/html;
    ssl_reject_handshake on;  # 443 也由它占着
}
```
任何 `Host` 头没被其他 server 块匹配的请求都会落到它——返回 nginx 自带的 `404.html`（**HTTP 200, 130 字节, 标题 "404 Not Found"**）。判定"actions 成功网站旧"时一定要带 `Host: <实际域名>` 验证，不能用 `curl http://127.0.0.1/`。

### 6.6 验证用 `Host` 头，不能用 `127.0.0.1`
```bash
# 错：curl http://127.0.0.1/  命中 default_server，给你看的是 1Panel 占位页
# 对：curl -H 'Host: pront.site' http://127.0.0.1/
# 或：curl -H 'Host: 106.53.173.60' http://127.0.0.1/
```

### 6.7 `tee` heredoc 吞 `$`
bash `tee <<EOF ... $host ... EOF`（双引号 heredoc）会先让 shell 展开 `$host` → 残破 `proxy_set_header Host ` → `nginx -t` 报 `invalid number of arguments`。
**解法**：
- 简单配置用单引号 heredoc `<<'EOF'`
- 复杂配置写**独立 .sh 文件**（这就是为什么有 `script/deploy-reverse-proxy.sh`，yml 只 1 行调用）

---

## 7. 容器 / 镜像约定

| 名字 | 用途 |
|---|---|
| `logos-app:new` | 本次构建出的镜像（部署用的） |
| `logos-app:latest` | 当前线上镜像的 stable tag（健康检查通过后才打这个 tag） |
| `logos-app:<YYYYMMDDHHMMSS>` | 历史版本，按时间戳 |
| `logos-app:prev` | 上一版 latest（健康检查失败时回滚用） |

容器名 `logos-app`，端口映射 `9090:80`，`--restart unless-stopped`，label 带 `commit=<sha>` 和 `deployed_at=<iso8601>`。

---

## 8. 1Panel 后台允许做的操作

- ✅ 网站 → 证书 → 上传证书（更新 `pront.site` 证书到 DB）
- ✅ 网站 → 证书 → DNS 账户 / Acme 账户（设置自动续签要用的话）
- ✅ 应用商店 / 容器 / 数据库 / 系统设置（1Panel 自身管理）
- ❌ 网站 → 网站 → 创建 website（建了就跟手写 conf 冲突，要先 `rm conf.d/logos.conf`）
- ❌ 网站 → 网站 → 改 `logos`（如已存在）相关的 conf（手写 conf 不归它管）

---

## 9. 验收清单（任何改动后跑一遍）

```bash
# 1. HTTP 301 -> HTTPS
curl -sI -H 'Host: pront.site' http://106.53.173.60/ | head -3
# 期望：HTTP/1.1 301 Moved Permanently  Location: https://pront.site/

# 2. HTTPS 内容与容器一致
curl -sk -H 'Host: pront.site' https://106.53.173.60/ | md5sum
curl -s   -H 'Host: pront.site' http://106.53.173.60:9090/ | md5sum
# 期望：两个 md5 相同

# 3. TLS 证书正确
echo | openssl s_client -servername pront.site -connect 106.53.173.60:443 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates
# 期望：subject=CN = pront.site  issuer=TrustAsia  notAfter < 90 天内

# 4. 容器健康
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Image}}' | grep logos-app
# 期望：Up X minutes  logos-app:latest
```

任意一步失败：先看 `/var/log/nginx/error.log`（在 openresty 容器内），再看 actions log 的步骤 7 输出。

# 萱萱｜AI 选题研究员

萱萱是一个基于 Hermes 的选题采集与深度研究 Agent。用户给出选题领域或内容方向后，它按 Profile 完成候选发现、信息核验、去重、筛选、排序、入库和已采用选题的资料研究。

- 公开演示：[GitHub Pages](https://selina2025-alt.github.io/xuanxuan-ai-topic-researcher/)
- Hermes Profile：`topicresearchagent`
- 测试环境：Hermes Agent `0.20.0`、lark-cli `1.0.85`

> 公开演示不连接 Hermes、飞书或任何 API；页面中的规模指标是明确标注的演示数据。

## 能力边界

这个 Agent 负责为后续内容创作准备可追溯的选题和研究资料。它不代替人工决定最终采用、不直接发布内容、不在未授权时读写飞书数据，也不会使用本仓库作者的 API Key 或 Token。

## 仓库结构

```text
.
├── index.html / styles.css / app.js   # 无后端的公开展示页
├── agent-docs/                       # 岗位卡、工作流、Profile 备份、日志和说明书
├── hermes-profile/SOUL.md            # 可复制到 Hermes 的脱敏运行 Profile
├── config/                            # 无真实值的配置清单和 Selection Policy 模板
├── sample-data/                       # 合成选题库样例
└── web-app/                           # 可选的 React/vinext 展示站源码
```

## 快速复现

### 1. 克隆仓库

```bash
git clone https://github.com/Selina2025-alt/xuanxuan-ai-topic-researcher.git
cd xuanxuan-ai-topic-researcher
```

### 2. 创建唯一 Hermes Profile

```bash
hermes profile create topicresearchagent \
  --description "发现、核验、去重、筛选并研究候选选题"
hermes profile show topicresearchagent
```

`hermes profile show` 会显示当前安装实际使用的 Profile 目录。仅在确认路径后，将 Profile 复制到其中：

```bash
cp hermes-profile/SOUL.md "$HOME/.hermes/profiles/topicresearchagent/SOUL.md"
hermes profile use topicresearchagent
hermes profile show topicresearchagent
```

不要把 `agent-docs/04-Profile.md` 当成已生效文件；真正生效的是 `hermes profile show` 指向目录中的 `SOUL.md`。

### 3. 配置自己的模型

```bash
hermes setup
hermes model
```

通过 Hermes 交互式配置输入自己的提供商和密钥。不要把密钥写入 Profile、Markdown、Git 历史或截图。

### 4. 创建自己的飞书 Bot

1. 在飞书开放平台创建企业自建应用并启用机器人。
2. 开通消息、云文档、电子表格、多维表格和云空间所需权限。
3. 订阅私聊消息和群聊 `@Bot` 事件，发布应用版本。
4. 用自己的 App ID / App Secret 建立 lark-cli Profile：

```bash
read -rsp "Feishu App Secret: " FEISHU_APP_SECRET
printf '%s' "$FEISHU_APP_SECRET" | lark-cli profile add \
  --name topicresearchagent \
  --app-id YOUR_APP_ID \
  --app-secret-stdin \
  --brand feishu
unset FEISHU_APP_SECRET
lark-cli whoami --profile topicresearchagent
```

5. 运行 `hermes gateway setup`，在交互界面中配置飞书渠道；完成后使用 `hermes gateway status` 验证。

### 5. 准备业务存储

- 创建自己的飞书多维表格，字段参考 `sample-data/选题库示例.csv`。
- 在自己的飞书云盘中创建研究资料文件夹。
- 将 Base URL 和研究资料位置授权给自己的 Bot，再通过私聊告诉 Agent。
- 按 `config/.env.example` 盘点需要的值，但真实 `.env` 只留在本机。

### 6. 配置采集工具

根据自己的信息源安装 RSS / Web Search / Firecrawl 等工具。Firecrawl API Key 必须从使用者自己的账号获取，并通过工具或 Hermes 的本地配置流程保存。

### 7. 完成接通测试

私聊发送：

> 萱萱，请采集过去24小时与企业AI落地相关的候选选题。请完成信息核验、去重、筛选和排序后写入我的选题库。新候选保持“待筛选”，不开展完整深度研究。最后汇报新增数量、去重数量、推荐顺序、来源缺口和写入验证结果。

然后在群聊中 `@Bot` 重复测试。必须检查写入后重读、候选指纹唯一性和权限边界。

### 8. 可选：创建定时任务

```bash
hermes cron create '0 9 * * *' \
  --name '每日企业AI选题采集' \
  --workdir '/ABSOLUTE/PATH/TO/YOUR/PROJECT' \
  '按 SOUL.md 执行每日企业 AI 落地选题采集，写入前去重，写入后重读验证，最后生成日报。'
hermes cron status
```

请先手动运行一轮并确认无重复写入，再启用定时执行。

## 配置和数据安全

- 仓库不包含作者的 App ID、App Secret、API Key、Token、Cookie、真实 Base URL 或 Hermes 运行数据。
- `config/.env.example` 只是配置清单，不是已生效的配置。
- 真实选题库 Excel 未公开，因为其包含第三方分享链接参数；仓库提供合成 CSV 样例。
- 运行日志中的飞书链接已替换为占位符，Profile 中的个人绝对路径已改为通用路径。
- 公开前请运行 `git diff --cached` 和自己的密钥扫描器。

更完整的工作流、MUST / SHOULD / MAY 规则、失败处理、人工兜底和完成前检查清单见 [`agent-docs/04-Profile.md`](agent-docs/04-Profile.md)。

## 展示站开发

根目录是 GitHub Pages 使用的纯静态站点。`web-app/` 是可选的 React/vinext 源码：

```bash
cd web-app
npm ci
npm run dev
```

Node.js 要求 `>=22.13.0`。

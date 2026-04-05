---
title: "OpenCode Go 和 Zen 订阅详细说明"
slug: "opencode-go-zen-guide"
excerpt: "详细介绍 OpenCode Go 和 Zen 两种订阅服务的定价、使用方法、模型列表和价格对比。"
date: "2026-03-15"
tags: ["OpenCode", "AI", "教程", "工具"]
published: true
---

# OpenCode Go 和 Zen 订阅详细说明

## 简介

OpenCode 提供两种主要的订阅服务：

- **OpenCode Go** - 低成本的开放源码模型订阅
- **OpenCode Zen** - 精选验证过的商业模型订阅

两者都是可选的，使用 OpenCode 本身完全免费。

---

## OpenCode Go - 低成本开放模型

### 定价

- **首月**：$5
- **之后**：$10/月

### 使用方法

1. 登录 [OpenCode Zen](https://opencode.ai/auth) 订阅 Go
2. 在 TUI 中运行 `/connect`，选择 `OpenCode Go`，粘贴 API key
3. 运行 `/models` 查看可用模型列表

### 包含模型

| 模型           | 每5小时请求数 | 每周请求数  | 每月请求数   |
| ------------ | ------- | ------ | ------- |
| GLM-5        | 1,150   | 2,880  | 5,750   |
| Kimi K2.5    | 1,850   | 4,630  | 9,250   |
| MiniMax M2.5 | 20,000  | 50,000 | 100,000 |

### 使用限制（按美元计算）

- **5小时限制**：$12 使用量
- **每周限制**：$30 使用量
- **每月限制**：$60 使用量

### API 端点

所有 Go 模型使用统一端点：

```
https://opencode.ai/zen/go/v1/chat/completions
```

### 配置格式

```yaml
# config 中使用格式：opencode-go/<model-id>
model: opencode-go/kimi-k2.5
```

### 超额使用

如有 Zen 余额，可开启 **Use balance** 选项，在达到限制后使用余额继续请求。

---

## OpenCode Zen - 精选商业模型

### 定价

- **按需付费**：预存 $20（含 $1.23 信用卡处理费）
- **零加价**：按成本价收费，仅覆盖处理费
- **自动充值**：余额低于 $5 时自动充值 $20（可设置/禁用）

### 使用方法

1. 登录 [OpenCode Zen](https://opencode.ai/auth)，添加付款信息，复制 API key
2. 在 TUI 中运行 `/connect`，选择 `OpenCode Zen`，粘贴 API key
3. 运行 `/models` 查看可用模型列表

### 模型列表

#### OpenAI 模型（GPT 系列）

| 模型                  | 端点                                     | AI SDK 包         |
| ------------------- | -------------------------------------- | ---------------- |
| GPT 5.4 Pro         | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.4             | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.3 Codex       | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.3 Codex Spark | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.2             | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.2 Codex       | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1             | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex       | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex Max   | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5.1 Codex Mini  | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5               | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 Codex         | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |
| GPT 5 Nano          | `https://opencode.ai/zen/v1/responses` | `@ai-sdk/openai` |

#### Anthropic 模型（Claude 系列）

| 模型                | 端点                                    | AI SDK 包            |
| ----------------- | ------------------------------------- | ------------------- |
| Claude Opus 4.6   | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Opus 4.5   | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Opus 4.1   | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Sonnet 4.6 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Sonnet 4.5 | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Sonnet 4   | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Haiku 4.5  | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |
| Claude Haiku 3.5  | `https://opencode.ai/zen/v1/messages` | `@ai-sdk/anthropic` |

#### Google 模型（Gemini 系列）

| 模型             | 端点                                                 | AI SDK 包         |
| -------------- | -------------------------------------------------- | ---------------- |
| Gemini 3.1 Pro | `https://opencode.ai/zen/v1/models/gemini-3.1-pro` | `@ai-sdk/google` |
| Gemini 3 Pro   | `https://opencode.ai/zen/v1/models/gemini-3-pro`   | `@ai-sdk/google` |
| Gemini 3 Flash | `https://opencode.ai/zen/v1/models/gemini-3-flash` | `@ai-sdk/google` |

#### 开源模型

| 模型                    | 端点                                            | AI SDK 包                    |
| --------------------- | --------------------------------------------- | --------------------------- |
| MiniMax M2.5          | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| MiniMax M2.5 Free     | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| MiniMax M2.1          | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| GLM 5                 | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| GLM 4.7               | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| GLM 4.6               | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2.5             | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2 Thinking      | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Kimi K2               | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Qwen3 Coder 480B      | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Big Pickle            | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| MiMo V2 Flash Free    | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |
| Nemotron 3 Super Free | `https://opencode.ai/zen/v1/chat/completions` | `@ai-sdk/openai-compatible` |

### 完整模型列表 API

```
https://opencode.ai/zen/v1/models
```

### 配置格式

```yaml
# config 中使用格式：opencode/<model-id>
model: opencode/gpt-5.3-codex
```

---

## Zen 模型价格（每百万 token）

### 免费模型

| 模型                    | 输入  | 输出  | 缓存读取 | 缓存写入 |
| --------------------- | --- | --- | ---- | ---- |
| Big Pickle            | 免费  | 免费  | 免费   | -    |
| MiMo V2 Flash Free    | 免费  | 免费  | 免费   | -    |
| Nemotron 3 Super Free | 免费  | 免费  | 免费   | -    |
| MiniMax M2.5 Free     | 免费  | 免费  | 免费   | -    |
| GPT 5 Nano            | 免费  | 免费  | 免费   | -    |

### 开源模型价格

| 模型               | 输入    | 输出    | 缓存读取  | 缓存写入   |
| ---------------- | ----- | ----- | ----- | ------ |
| MiniMax M2.5     | $0.30 | $1.20 | $0.06 | $0.375 |
| MiniMax M2.1     | $0.30 | $1.20 | $0.10 | -      |
| GLM 5            | $1.00 | $3.20 | $0.20 | -      |
| GLM 4.7          | $0.60 | $2.20 | $0.10 | -      |
| GLM 4.6          | $0.60 | $2.20 | $0.10 | -      |
| Kimi K2.5        | $0.60 | $3.00 | $0.10 | -      |
| Kimi K2 Thinking | $0.40 | $2.50 | -     | -      |
| Kimi K2          | $0.40 | $2.50 | -     | -      |
| Qwen3 Coder 480B | $0.45 | $1.50 | -     | -      |

### Claude 模型价格

| 模型                        | 输入     | 输出     | 缓存读取  | 缓存写入   |
| ------------------------- | ------ | ------ | ----- | ------ |
| Claude Opus 4.6 (≤200K)   | $5.00  | $25.00 | $0.50 | $6.25  |
| Claude Opus 4.6 (>200K)   | $10.00 | $37.50 | $1.00 | $12.50 |
| Claude Opus 4.5           | $5.00  | $25.00 | $0.50 | $6.25  |
| Claude Opus 4.1           | $15.00 | $75.00 | $1.50 | $18.75 |
| Claude Sonnet 4.6 (≤200K) | $3.00  | $15.00 | $0.30 | $3.75  |
| Claude Sonnet 4.6 (>200K) | $6.00  | $22.50 | $0.60 | $7.50  |
| Claude Sonnet 4.5 (≤200K) | $3.00  | $15.00 | $0.30 | $3.75  |
| Claude Sonnet 4.5 (>200K) | $6.00  | $22.50 | $0.60 | $7.50  |
| Claude Sonnet 4 (≤200K)   | $3.00  | $15.00 | $0.30 | $3.75  |
| Claude Sonnet 4 (>200K)   | $6.00  | $22.50 | $0.60 | $7.50  |
| Claude Haiku 4.5          | $1.00  | $5.00  | $0.10 | $1.25  |
| Claude Haiku 3.5          | $0.80  | $4.00  | $0.08 | $1.00  |

### Gemini 模型价格

| 模型                     | 输入    | 输出     | 缓存读取  |
| ---------------------- | ----- | ------ | ----- |
| Gemini 3.1 Pro (≤200K) | $2.00 | $12.00 | $0.20 |
| Gemini 3.1 Pro (>200K) | $4.00 | $18.00 | $0.40 |
| Gemini 3 Pro (≤200K)   | $2.00 | $12.00 | $0.20 |
| Gemini 3 Pro (>200K)   | $4.00 | $18.00 | $0.40 |
| Gemini 3 Flash         | $0.50 | $3.00  | $0.05 |

### OpenAI 模型价格

| 模型                  | 输入     | 输出      | 缓存读取   |
| ------------------- | ------ | ------- | ------ |
| GPT 5.4 Pro         | $30.00 | $180.00 | $30.00 |
| GPT 5.4             | $2.50  | $15.00  | $0.25  |
| GPT 5.3 Codex       | $1.75  | $14.00  | $0.175 |
| GPT 5.3 Codex Spark | $1.75  | $14.00  | $0.175 |
| GPT 5.2             | $1.75  | $14.00  | $0.175 |
| GPT 5.2 Codex       | $1.75  | $14.00  | $0.175 |
| GPT 5.1             | $1.07  | $8.50   | $0.107 |
| GPT 5.1 Codex       | $1.07  | $8.50   | $0.107 |
| GPT 5.1 Codex Max   | $1.25  | $10.00  | $0.125 |
| GPT 5.1 Codex Mini  | $0.25  | $2.00   | $0.025 |
| GPT 5               | $1.07  | $8.50   | $0.107 |
| GPT 5 Codex         | $1.07  | $8.50   | $0.107 |

---

## 团队功能

### 角色管理

- **Admin**：管理模型、成员、API key、账单
- **Member**：仅管理自己的 API key

### 功能

- 为每个成员设置月度支出限额
- 管理员可启用/禁用特定模型
- 可使用自己的 OpenAI/Anthropic API key

### 定价

- 团队工作区目前免费（beta 阶段）

---

## 隐私政策

### 数据保留

- 所有模型托管在美国
- 提供商遵循零保留政策，不使用数据进行模型训练

### 例外情况

- **Big Pickle**：免费期间收集的数据可能用于改进模型
- **MiniMax M2.5 Free**：免费期间收集的数据可能用于改进模型
- **Nemotron 3 Super Free**：免费期间收集的数据可能用于改进模型
- **OpenAI APIs**：根据 OpenAI 数据政策保留 30 天
- **Anthropic APIs**：根据 Anthropic 数据政策保留 30 天

---

## 即将弃用模型

| 模型               | 弃用日期       |
| ---------------- | ---------- |
| Qwen3 Coder 480B | 2026年2月6日  |
| Kimi K2 Thinking | 2026年3月6日  |
| Kimi K2          | 2026年3月6日  |
| MiniMax M2.1     | 2026年3月15日 |
| GLM 4.7          | 2026年3月15日 |
| GLM 4.6          | 2026年3月15日 |

---

## 对比总结

| 特性   | OpenCode Go                    | OpenCode Zen                      |
| ---- | ------------------------------ | --------------------------------- |
| 定价   | $5首月，$10/月                     | 按需付费（$20起）                        |
| 模型类型 | 开源模型                           | 商业+开源模型                           |
| 包含模型 | GLM-5, Kimi K2.5, MiniMax M2.5 | GPT, Claude, Gemini, 开源模型         |
| 使用限制 | 固定限制（$12/5小时, $30/周, $60/月）    | 按余额计费                             |
| 免费模型 | 无                              | 有（Big Pickle, MiniMax M2.5 Free等） |
| 团队功能 | 否                              | 是                                 |

---

## 官方链接

- 官网：https://opencode.ai
- 文档：https://opencode.ai/docs
- Go 订阅：https://opencode.ai/go
- Zen 订阅：https://opencode.ai/zen
- GitHub：https://github.com/anomalyco/opencode
- Discord：https://opencode.ai/discord

---

*文档更新时间：2026年3月*

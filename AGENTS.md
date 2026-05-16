# conilab — 协作约束

> conilab.cn 个人博客。Astro + TS + Cloudflare Pages 静态站。
> 内容定位：3000 字以上长文 · 中英对照。
> 视觉来源：lixiaolai.com 编辑式纸面（详见 `~/.Codex/projects/-Users-coni/memory/design-ref-literary-paper.md`），但替换为 conilab 自己的 motif。

## 不变量

1. **每篇文章必须中英双 body**：内容 schema 强制 `body_zh` + `body_en` 两段。允许英文先空（待补），但 schema 字段必须存在。
2. **设计 token 集中**：所有颜色/间距/字号/行高只读 `src/styles/tokens.css` 的 CSS 变量，禁止组件里硬编码颜色或像素。改视觉先改 token。
3. **OKLCH only**：所有颜色用 `oklch()`，混色用 `color-mix(in oklch, ...)`，禁止 hex/rgb 进 token 文件。
4. **1px hairline + 偶尔 2px 标大概念**：分隔线 default 1px，2px 仅用于"年代/章首"级语义。无阴影、无渐变、无大圆角（除了 pill 按钮）。
5. **强调用 italic light + accent-deep**，禁止用 bold + 强调色（反 lixiaolai 已建立的招式）。
6. **§ 段落符、mono uppercase 0.08~0.14em tracking、italic 单字强调** 是这套设计的"基因签名"——保留，不要在某次微调里失手抹掉。
7. **CJK em ≠ italic**：中文段的 `<em>` 用 dotted 下划线（CSS 已声明），不用 italic。

## 项目结构

```
src/
  styles/
    tokens.css     # OKLCH 设计 token（颜色/间距/字号/行高/CJK）
    globals.css    # body/heading/em 基础 + 中英切换 CSS
  layouts/
    Base.astro     # masthead + footer + skip-link
  components/
    Mark.astro          # conilab 品牌标 + 硬币 ampersand SVG
    Masthead.astro
    Footer.astro
    Kicker.astro        # § 段落符 kicker
    ChapterHead.astro   # § 01 · TITLE + 朱砂 bar
    ColophonCard.astro  # 报头牌
  pages/
    index.astro    # 首页 demo
content/
  articles/        # 后续 Markdown/MDX 文章（双 body schema）
content.config.ts  # Astro content collections schema
```

## 工作流

- 改样式：动 `tokens.css` 优先，然后才是组件
- 加文章：在 `content/articles/` 下新建 `YYYY-MM-DD-slug.md`，frontmatter 必须含 `title_zh/title_en/lede_zh/lede_en/published_at`，body 用 `<!-- LANG:EN -->` 分隔双语段，或采用单独的 `body_en.md` 兄弟文件（schema 终选见 `content.config.ts`，本对话先确定一种）
- 部署：Cloudflare Pages（GitHub repo 连接，build cmd `bun run build`，output `dist/`）— **本对话不做部署**

## 拒做

- 不引入 React / Vue / Tailwind。CSS 直接写，组件用原生 Astro。
- 不写过度抽象（早期组件就 5~10 个，文件少于 30 个，避免架构超前）。
- 不在单对话里做"完整版"。本对话目标是**能跑且看到雏形**，articles 列表页 / 单篇文章模板 / Obsidian export 留给下一个对话。

## 视觉决策快查

| 项 | 值 | 备注 |
|---|---|---|
| 主 motif | **⊙ 同心双圆** | conilab signature。`CoinGlyph` 组件 4 变体（ring / dot / slash / stamp），全站替代 lixiaolai 的 § |
| 章节编号 | **罗马数字** Ⅰ / Ⅱ / Ⅲ + 小写 i/ii/iii | 实验簿味道，"lab" 字面联动 |
| 正面强调色 | `oklch(0.42 0.14 240)` `--accent-front` | 深蓝，硬币正面 / 阅读 / 中文 / 主链接 |
| 反面强调色 | `oklch(0.55 0.11 60)` `--accent-back` | 暖铜，硬币反面 / 写作 / 英文 / 印章 / Ⅱ 类章节 |
| serif | Source Serif 4 → ui-serif fallback | 主标题、品牌、quote |
| cjk-serif | Source Han Serif SC → PingFang SC | 中文长文/pullquote |
| sans | Inter | body / 表单 |
| mono | JetBrains Mono | kicker / handle / dl-key |
| 品牌 ampersand | Mark.astro 内嵌硬币 SVG（圆 + 斜线，4.8s tilt 动画）| 仅 logo 处用，章节标记统一用 `CoinGlyph` |
| Hero 版式 | **对联式中英并置** | front/back 双侧 + 中央 hairline + ⊙ 剖面，conilab 招牌版式 |
| 装饰 | Hero 水印 ⊙（5% 透明度大字背景）| 借自 design-ref-editorial 的水印叠底招式 |

## 不抄袭红线

下面这些是 lixiaolai 标志性的元素，**不要重新引入**：
- `§` 段落符（已被 ⊙ 替代）
- `01 / 02 / 03` 阿拉伯章节编号（已被罗马数字替代）
- "Set in 字体名 and 字体名. Built in the open. Licensed permissively..." 风格的 footer colophon 文案
- 单色 vermillion 朱砂强调（已切双色制）
- 城市地图 SVG 在 colophon-card（已替换为左右双枚同心圆 中/en motif）
- 章节大标题旁的整段 italic 副标 `<em>a commonplace book...</em>` 这种 lixiaolai 文学化口吻——保留 italic 强调，但句式要换成 conilab voice

## 不暴露身份

文案中**绝对不出现**：
- 真实姓名（张干）
- 出生年份 / 出生地
- 在校状态 / 学校
- 公众号品牌（夜识AI）
- 微信号
- 城市具体名（绍兴 / 杭州 / 浙江）

允许出现：网名 `@coni` / `coni` / `硬币`、域名 `conilab.cn`、GitHub 用户名 `coni555`、邮箱（如果将来加联系方式）

## 会话卫生（防 image dimension limit）

**症状**：长会话反复触发 `An image in the conversation exceeds the dimension limit for many-image requests (2000px). Start a new session with fewer images.`

**根因**：每个 turn SDK 把整段 image 历史重发给 API；多图请求有 2000px 单边维度上限。Retina 截屏（CF dashboard / 浏览器预览）轻易超阈，会话一旦塞几十张就反复爆。

**对策（按优先级）**：
1. 验证内容/结构用 `preview_snapshot`（DOM 文本），**不要默认 `preview_screenshot`**
2. 视觉效果只在 milestone 末尾截一张给用户看
3. 必须截图先压尺寸：`sips -Z 1500 input.png --out out.png`（长边 1500px 内）
4. CF 控制台 / wrangler 状态用 CLI（`bunx wrangler whoami` / `pages project list` / `pages deployment list`）替代贴 dashboard 截图
5. 一个 milestone（部署成功、commit 推上）完成就 `/clear` 起新会话，用 `HANDOFF.md` 接力

## 跨对话接力

进度看 `HANDOFF.md`。每次大阶段完成更新它。

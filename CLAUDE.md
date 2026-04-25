# conilab — 协作约束

> conilab.cn 个人博客。Astro + TS + Cloudflare Pages 静态站。
> 内容定位：3000 字以上长文 · 中英对照。
> 视觉来源：lixiaolai.com 编辑式纸面（详见 `~/.claude/projects/-Users-coni/memory/design-ref-literary-paper.md`），但替换为 conilab 自己的 motif。

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
| 强调色 | `oklch(0.42 0.14 240)` (`--accent-deep`) | 深蓝，hue 240 避开 lixiaolai 的 255 |
| 强调色（深态） | `oklch(0.32 0.12 240)` (`--accent-deep-ink`) | h1 em / 链接 hover |
| serif | Source Serif 4 → ui-serif fallback | 主标题、品牌、quote |
| cjk-serif | Source Han Serif SC → PingFang SC | 中文长文/pullquote |
| sans | Inter | body / 表单 |
| mono | JetBrains Mono | kicker / handle / dl-key |
| ampersand | 自绘 SVG（圆 + 斜线，硬币 + 中英分隔 motif） | `src/components/Mark.astro` 中嵌入 |

## 跨对话接力

进度看 `HANDOFF.md`。每次大阶段完成更新它。

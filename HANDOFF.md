# conilab — HANDOFF

> 跨对话接力点。每次大阶段完成后更新。
> 协作约束看 `CLAUDE.md`，视觉来源看 `~/.claude/projects/-Users-coni/memory/design-ref-literary-paper.md`。
> conilab 自己的设计语言（脱离 lixiaolai）在下面"创新方向"段。

## 当前状态：M2 部署完成 — https://conilab.cn 已上线

> **2026-04-25 部署阶段**
>
> - GitHub repo：[coni555/conilab](https://github.com/coni555/conilab) (public)
> - Cloudflare Pages 项目：`conilab`（直接上传 `dist/`，未走 Git 集成）
> - 自定义域名：`conilab.cn`（apex，CF CNAME flatten 到 `conilab.pages.dev`，proxy 开）
> - SSL：CF 自动签发（Google CA），首次绑定后约 2 分钟生效
> - 部署 URL：https://conilab.cn ✅ + https://conilab.pages.dev（保留作为 fallback）
> - 工具链：本机 `wrangler` OAuth 登录 → `wrangler pages project create conilab` + `wrangler pages deploy dist` 完成首次发布；apex CNAME 通过 dashboard 创建（OAuth scope 不含 DNS:Edit，wrangler 也没有 dns 子命令，走 dashboard 是最直路径）
> - **未做（M2 后续）**：ICP 备案 — .cn 域名国内稳定访问需要，海外/小圈子先用，备案另起流程
> - **未做（M2 后续）**：将后续部署接通 GitHub Actions 或 CF Pages Git 集成实现 push-to-deploy；当前每次发版需本地 `bun run build && bunx wrangler pages deploy dist --project-name=conilab`

## M1 完成（部署前阶段）— 全栈可见、可读、可订阅

> **本次对话（2026-04-25）累计完成**
>
> **内容 + 模板**
> - 文案按"两次降落 / 翻面才完整 / Coni = coin + 一个 i = 观察者"重写：Hero 标题副、Articles 占位、Principles ii、Footer blurb 都换成新 voice
> - 删除 Principles iii（"不暴露真实身份"那条，列表精简到 i/ii）
> - 首篇文章入库：[content/articles/2026-04-25-honest-notes.md](content/articles/2026-04-25-honest-notes.md)（双语，3120 字 / en_complete: true）；英文版按"两次降落"理念重新落笔
>
> **页面 / 路由**
> - 单篇文章模板 [src/pages/articles/[...slug].astro](src/pages/articles/[...slug].astro)：双 title + 双 lede + zh body + "⊙ TURN IT OVER ⊙" + en body；marked 渲染 `<!-- LANG:ZH/EN -->` 切分；CJK em dotted 蓝、en em italic 铜
>   - 加料：reading-progress 顶部 2px 蓝条 / prev/next 双语导航（仅 ≥ 2 篇文章时显示）/ Pullquote 中英并置组件
> - 列表页 [src/pages/articles/index.astro](src/pages/articles/index.astro) almanac 风：5 列 grid `110/60/1fr/220/60` = date / ZH·EN badge / 中英 title / tags / →；按年分组 + 大年份 + 2px accent-front 粗线分年；mobile 自动 stack
> - About 页 [src/pages/about.astro](src/pages/about.astro)：左 sticky aside TOC（Ⅰ-Ⅵ + 双语 label）+ 右双语 longform（What this is / Why ≥ 3000 字 / Two faces / About the name / About the writer / Colophon）+ 中央 Pullquote
> - 首页 Articles chapter 接通：有文章时显示 5 篇最新 + "View all" 链接，没文章时回落占位
>
> **基础设施**
> - RSS：[src/pages/articles/rss.xml.ts](src/pages/articles/rss.xml.ts) 用 @astrojs/rss，head 里 `<link rel="alternate" type="application/rss+xml">` 注入
> - Sitemap：@astrojs/sitemap 集成，build 时自动生成 sitemap-index.xml
> - astro.config 添加 `site: 'https://conilab.cn'`（RSS / sitemap 必需）
> - favicon：单圆+斜线 SVG（与 Mark.astro 同源），accent-front 浅蓝 oklch(0.7 0.12 240)
>
> **语言切换器联动**
> - 文章页 / about 页所有双语段都加了 `data-lang="zh"` / `data-lang="en"` 属性；masthead 三态切换器（中-EN / 中 / EN）通过 `<html>` 的 `show-zh` / `show-en` class 联动 globals.css 切换显隐；单语模式下 `.article-flip` 翻面分隔自动隐藏
>
> **Components**
> - 新增 [src/components/Pullquote.astro](src/components/Pullquote.astro)：中英并置引用 / 双 side 变体（front 蓝 / back 铜）/ ⊙ 角标 / 可选 cite
>
> **构建**
> - `bun run astro check`：0 errors / 0 warnings
> - `bun run build`：4 页面 + RSS + sitemap，517ms
>
> **视觉打磨第二轮（同对话尾声，2026-04-25 后段）**
> - tokens.css：`--cjk-em-color` 从浅灰统一为 `accent-front` 深蓝 `oklch(0.42 0.14 240)`，全站中文 em dotted 下划线一处改完
> - globals.css：CJK em 选择器去掉 `:lang(zh)`，只匹配 `.cjk em` / `[data-lang="zh"] em`；原选择器配合 `<html lang="zh-CN">` 会误中所有英文 em
> - index.astro hero：`italic` 限定到 `.hero-side--back .hero-title em` / `.hero-side--back .hero-sub em`，中文段 em 不再合成 italic 字形（CLAUDE.md 不变量 7 修正）
> - articles/index.astro：Kicker text 去掉前置 ⊙（Kicker 组件内部已有）；lede 拆 `.almanac-lede` (zh) + `.almanac-lede-en` (en) 两段，CJK em 走蓝 dotted、英文 em italic 铜；dl meta 从 `repeat(3, max-content)` 改为 `max-content 1fr` 两列、限宽 380px，dt-dd 正常对齐
> - about.astro：两处 Kicker text 去掉前置 ⊙；删除未引用的 `CoinGlyph` import
>
> **未做（CLAUDE.md 显式禁止本对话做）**
> - CF Pages 部署：GitHub repo / DNS / 域名 / 备案 — 留下一对话执行

✅ 完成：

- Astro 6 + TS strict + bun + Cloudflare Pages 准备
- 设计 token：`src/styles/tokens.css`
  - 强调色 `--accent-deep: oklch(0.42 0.14 240)`（深蓝，避开 lixiaolai 朱砂 hue 255）
  - 字体栈 Source Serif 4 + Inter + JetBrains Mono + 思源宋体 fallback
  - sp/fs/lh/cjk 全套抄 lixiaolai
- 字体加载：`@fontsource/source-serif-4 + inter + jetbrains-mono` 自托管
- Layout：`src/layouts/Base.astro`（masthead + footer + skip-link）
- 组件：
  - `Mark.astro` — conilab 品牌标 + **硬币 ampersand** SVG（圆 + 斜线，4.8s tilt 动画，respects prefers-reduced-motion）
  - `Masthead.astro` — sticky 1px 描边 + paper-92% backdrop-blur + **三态语言切换器**（CSS-only）
  - `Footer.astro` — 三栏 colophon 风（含 footer-mark + footer-blurb 提到字体名）
  - `Kicker.astro` — § 段落符（mono uppercase 0.12em）
  - `ChapterHead.astro` — § 编号 + accent-deep 40×1px bar + h2 italic em
  - `ColophonCard.astro` — 报头牌（顶部 :before 邮票 + co-head + co-rule § + co-line × N）
- 首页 demo `src/pages/index.astro`：hero 4 行诗化断行 + opsz 72 + dl 元信息表 + ColophonCard + 两个 Chapter（占位 + 双语 about）
- Content schema：`src/content.config.ts`（articles 集合，强制 title/lede 中英双字段）
- 本地 dev: `cd ~/Sites/conilab && bun run dev` → http://localhost:4321/
- 类型检查通过：`bun run astro check` 0 errors

## 下一阶段（M2 — 部署 + 内容生产）

M1 在 2026-04-25 这次对话基本完成。M2 优先级：

1. **CF Pages 部署**（M1.7 顺延）：
   - GitHub repo（ssh remote）`coni555/conilab` 或 conilab.cn 同名
   - CF Pages 连接 repo，build cmd `bun run build`，output `dist/`
   - 域名 `conilab.cn` DNS 到 CF
   - 国内 ICP 备案（.cn 域名走 Cloudflare China Network 或先用 *.pages.dev 子域过渡）
2. **第二篇文章**：积累一篇之后，列表页能看到 prev/next 实际效果；可以借机调 Pullquote 在文章模板内的引入位置
3. **思源宋体 web 子集化**：用 `cn-font-split` 把思源宋体子集成博客可能用到的字符集（中文 ~4500 + 英文 + 数字 + 标点），降到 100KB 内
4. **/notes 页**：短想法登记（masthead 已有 Notes 入口但没建路由）
5. **章节级交错版式实验**：目前文章页是 zh 全文 → flip → en 全文，可以试章节级交错（每章 zh 接 en 接 zh），但需要先有第二篇文章的实际阅读体验做对比再决定

## 已知 / 待办

- [ ] 思源宋体 web 字体子集化（中文 web 字体太大，需要做 subsetting，未来用 `cn-font-split` 或类似工具）
- [ ] `astro check` 报若干 `'z' is deprecated` + `Kicker.astro Props is declared but never used` hint，是 Astro 6 + Zod 过渡及 Astro `interface Props` 约定的 TS 误报，无影响
- [x] favicon → 单圆+斜线浅蓝 SVG（2026-04-25）
- [x] `/articles/rss.xml` 路由建好（2026-04-25）
- [x] `/articles` almanac 列表页 + 首页 Articles chapter 接通（2026-04-25）
- [x] 单篇文章页加料：reading progress / prev-next / pullquote / lang-switch 联动（2026-04-25）
- [x] About 页（2026-04-25）
- [ ] 单篇文章页可继续加：footnote / aside 注 / TOC（如果文章很长）/ 双语章节并排版式（目前是 zh 整段后接 en 整段，下一对话可考虑章节级交错）
- [x] CF Pages 部署（2026-04-25 完成）：repo coni555/conilab + Pages project conilab + apex conilab.cn 绑定
- [ ] ICP 备案：footer 里"备案号待添加"，备案下来后填
- [ ] push-to-deploy：当前手动 `wrangler pages deploy dist`，下一步可接 CF Pages Git 集成或 GitHub Actions
- [ ] 暂未做 darkmode（先不做）
- [ ] Pullquote 组件目前只有 about 页用，单篇文章模板可在第二篇文章时引入实际使用

## 关键决策（敲定，不要再讨论）

- 站名：conilab；域名：conilab.cn
- 内容定位：≥3000 字 + 中英对照
- 内容迁移：A（全新开始，公众号「夜识AI」与博客无关）
- 部署：Cloudflare Pages（不是 Vercel）
- 技术栈：Astro 6 + TS strict + bun + 无 React / 无 Tailwind

## 创新方向（已落地，是 conilab 区别于 lixiaolai 的核心）

**核心 motif：「硬币的两面」/ 双面叙事**

| 维度 | lixiaolai | conilab |
|---|---|---|
| 章节符号 | `§` 段落符 | `⊙` 同心双圆（`CoinGlyph` 组件，硬币最简几何） |
| 章节编号 | `01 / 02 / 03` 阿拉伯 | `Ⅰ / Ⅱ / Ⅲ` 罗马数字（实验簿味，配合 "lab" 字面）|
| 强调色 | 单色 vermillion 朱砂（实为蓝紫） | **双色制**：`--accent-front`（深蓝 240）+ `--accent-back`（暖铜 60），对应硬币正反 / 中英 / 阅读·写作 |
| Hero 版式 | 左 1.4fr 文案 + 右 1fr colophon | **对联式中英并置**：左中文（front 蓝） / 中央 hairline + ⊙ 剖面 / 右英文（back 铜） |
| Colophon | 城市地图 + DISPATCH 字样 | **试验登记卡**：左右两枚同心圆（中/en）+ 中央 ⊙ 分隔 + 右下角铜色 ⊙ 印章（半透明，hover 强化）|
| Footer 文案 | "Set in Newsreader and Inter. Built in the open. Licensed permissively..." | "Long-form notes *read twice* — once in 中文, once in English. Each piece earns its place by being ≥ 3000 字. Built quietly." |
| 装饰 | 无 | Hero 右下角超大水印 ⊙（5% 透明度，借自 design-ref-editorial 的水印叠底招式） |
| 章节 ⅡI 主题 | About / Bio | **Principles**（"What this notebook *refuses*" — 不暴露身份只列原则）|
| Principles 编号 | — | 罗马小写 `i / ii / iii` italic 铜色 |
| `CoinGlyph` 变体 | — | `ring / dot / slash / stamp` 4 种，全站统一 motif |

**身份信息：全部清除**
- 删除：真实姓名、城市、出生年、Bureau 城市列表
- 保留：网名 `@coni`、域名 `conilab.cn`、GitHub `coni555`（公开网名 ID）
- footer-bottom 描述："conilab.cn — a notebook with two faces"（无地理信息）

## 接力上下文

进度看本文件上半部"下一阶段（M2）"。M1 已完成（除部署项）。

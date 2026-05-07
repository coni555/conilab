import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * articles collection
 *
 * 每篇文章 1 个 .md/.mdx 文件，frontmatter 双语 + body 双语段落
 *
 * Body 写作约定（待文章实际开始写时落地，可能调整）：
 *   - 段落 hint：用 HTML <p data-lang="zh"> / <p data-lang="en">，或 markdown :::zh / :::en remark 容器
 *   - frontmatter title/lede 同时给 zh+en
 *   - 字数 ≥ 3000 字（中文计），CI 时校验
 */
const articles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/articles" }),
  schema: z.object({
    slug: z.string().optional(),
    title_zh: z.string(),
    title_en: z.string(),
    lede_zh: z.string(),
    lede_en: z.string(),
    published_at: z.coerce.date(),
    updated_at: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    /** 中文字符数；CI 校验 ≥ 3000 */
    word_count_zh: z.number().int().nonnegative().optional(),
    /** 是否英文已成稿；草稿期允许只有中文 */
    en_complete: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/notes" }),
  schema: z.object({
    slug: z.string().optional(),
    title_zh: z.string().optional(),
    title_en: z.string().optional(),
    published_at: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }).refine(
    (d) => d.title_zh || d.title_en,
    { message: "At least one of title_zh or title_en is required" },
  ),
});

export const collections = { articles, notes };

/**
 * content.ts — 跨页面共用的内容工具函数
 *
 * slugOf: 从 entry 提取 slug（优先 data.slug，回落 id 去扩展名）
 * fmtDate: 日期格式化为 YYYY.MM.DD（欧式点分隔，与 masthead handle 一致）
 *
 * 兼容 articles / notes collection 的 entry 类型（宽松结构类型）。
 */

interface EntryLike {
  id: string;
  data: { slug?: string };
}

export function slugOf(entry: EntryLike): string {
  return entry.data.slug ?? entry.id.replace(/\.(md|mdx)$/, "");
}

export function fmtDate(d: Date | string): string {
  const dt = new Date(d);
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const day = String(dt.getDate()).padStart(2, "0");
  return `${dt.getFullYear()}.${m}.${day}`;
}

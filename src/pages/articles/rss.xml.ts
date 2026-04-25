import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const all = await getCollection("articles");
  const articles = all
    .filter((a) => !a.data.draft)
    .sort(
      (a, b) =>
        new Date(b.data.published_at).getTime() -
        new Date(a.data.published_at).getTime(),
    );

  return rss({
    title: "conilab — a notebook with two faces",
    description:
      "Long-form notes published twice — once in 中文, once in English. ≥ 3000 字 per piece.",
    site: context.site!,
    customData: `<language>zh-CN</language>`,
    items: articles.map((a) => {
      const slug = a.data.slug ?? a.id.replace(/\.(md|mdx)$/, "");
      const description = `${a.data.lede_zh}\n\n— —\n\n${a.data.lede_en}`;
      return {
        title: `${a.data.title_zh} / ${a.data.title_en}`,
        link: `/articles/${slug}/`,
        pubDate: new Date(a.data.published_at),
        description,
        categories: a.data.tags ?? [],
      };
    }),
  });
}

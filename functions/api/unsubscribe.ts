/// <reference types="@cloudflare/workers-types" />
import type { Env } from "./_shared";
import { backToJoin } from "./_shared";

// GET /api/unsubscribe?token=...  （每封 newsletter 底部的退订链接）
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token) return backToJoin(url.origin, "error=invalid_token");

  const row = await env.DB
    .prepare("SELECT id FROM subscribers WHERE token = ?")
    .bind(token)
    .first<{ id: number }>();
  if (!row) return backToJoin(url.origin, "error=invalid_token");

  await env.DB
    .prepare("UPDATE subscribers SET status='unsubscribed', unsubscribed_at=datetime('now') WHERE id=?")
    .bind(row.id)
    .run();
  return backToJoin(url.origin, "unsubscribed=true");
};

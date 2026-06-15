/// <reference types="@cloudflare/workers-types" />
import type { Env, SubscriberRow } from "./_shared";
import { backToJoin } from "./_shared";

// GET /api/confirm?token=...  （确认信里的链接）
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  if (!token) return backToJoin(url.origin, "error=invalid_token");

  const row = await env.DB
    .prepare("SELECT id, status FROM subscribers WHERE token = ?")
    .bind(token)
    .first<SubscriberRow>();
  if (!row) return backToJoin(url.origin, "error=invalid_token");

  if (row.status !== "confirmed") {
    await env.DB
      .prepare("UPDATE subscribers SET status='confirmed', confirmed_at=datetime('now') WHERE id=?")
      .bind(row.id)
      .run();
  }
  return backToJoin(url.origin, "confirmed=true");
};

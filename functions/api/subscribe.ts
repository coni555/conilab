/// <reference types="@cloudflare/workers-types" />
import type { Env, SubscriberRow } from "./_shared";
import { json, isValidEmail, newToken, verifyTurnstile, sendConfirmEmail } from "./_shared";

// POST /api/subscribe  { email, turnstileToken, lang }
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { email?: string; turnstileToken?: string; lang?: string };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "bad_request" }, 400);
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const turnstileToken = String(body.turnstileToken ?? "");
  const lang = body.lang === "en" ? "en" : "zh";

  if (!isValidEmail(email)) return json({ ok: false, error: "invalid_email" }, 400);

  const ip = request.headers.get("CF-Connecting-IP") ?? undefined; // 仅传给 Turnstile，不入库（站点承诺 no tracking）
  if (!(await verifyTurnstile(env.TURNSTILE_SECRET, turnstileToken, ip))) {
    return json({ ok: false, error: "turnstile_failed" }, 403);
  }

  const existing = await env.DB
    .prepare("SELECT id, status FROM subscribers WHERE email = ?")
    .bind(email)
    .first<SubscriberRow>();

  // 已确认 → 静默成功，不重发、不报错（防泄露订阅状态）
  if (existing?.status === "confirmed") {
    return json({ ok: true, mode: "subscribed" });
  }

  const origin = new URL(request.url).origin;
  const token = newToken();
  const confirmUrl = `${origin}/api/confirm?token=${token}`;

  if (!existing) {
    await env.DB
      .prepare("INSERT INTO subscribers (email, status, token, lang) VALUES (?, 'pending', ?, ?)")
      .bind(email, token, lang)
      .run();
  } else {
    // pending / unsubscribed：刷新句柄回到 pending
    await env.DB
      .prepare("UPDATE subscribers SET status='pending', token=?, lang=?, created_at=datetime('now'), unsubscribed_at=NULL WHERE id=?")
      .bind(token, lang, existing.id)
      .run();
  }

  // 有发信商 → 双重确认（发确认信，保持 pending）；没有 → 单次确认（直接 confirmed）
  const sent = await sendConfirmEmail(env, email, confirmUrl);
  if (!sent) {
    await env.DB
      .prepare("UPDATE subscribers SET status='confirmed', confirmed_at=datetime('now') WHERE token=?")
      .bind(token)
      .run();
    return json({ ok: true, mode: "subscribed" });
  }
  return json({ ok: true, mode: "pending" });
};

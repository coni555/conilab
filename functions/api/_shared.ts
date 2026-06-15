/// <reference types="@cloudflare/workers-types" />
// 下划线前缀 → Cloudflare Pages 不当它是路由，仅供其它 function 引用。

export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET?: string; // Turnstile 后端密钥（线上必配，否则订阅一律 fail-closed）
  MAIL_PROVIDER?: string;    // 发信商标识（phase 2 接 SES/Brevo/MailerSend 时启用）；未设 → 单次确认上线
}

export interface SubscriberRow {
  id: number;
  status: "pending" | "confirmed" | "unsubscribed";
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

// 跳回 /join 并带状态参数，前端据此切文案
export function backToJoin(origin: string, query: string): Response {
  return Response.redirect(`${origin}/join?${query}`, 302);
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// 每订阅者一个 128-bit 随机句柄（32 hex）
export function newToken(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 验 Turnstile。无 secret 或无 token → fail-closed（返回 false）。
export async function verifyTurnstile(
  secret: string | undefined,
  token: string,
  ip?: string,
): Promise<boolean> {
  if (!secret || !token) return false;
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);
  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body: form },
  );
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

// 发确认信。返回「是否真的发出去了」。
// 现状：Resend 账号被封、未接替代发信商 → 返回 false，subscribe 据此走「单次确认」（直接 confirmed），
// 表单无需任何发信商即可上线。phase 2 群发 newsletter 时在此接 SES / Brevo / MailerSend：
// 用 confirmEmailHtml(confirmUrl) / confirmEmailText(confirmUrl) 作正文，env 里加对应密钥，成功 return true。
export async function sendConfirmEmail(
  env: Env,
  email: string,
  confirmUrl: string,
): Promise<boolean> {
  if (!env.MAIL_PROVIDER) {
    console.log(`[conilab] 无发信商，${email} 走单次确认（confirm 链接：${confirmUrl}）`);
    return false;
  }
  // TODO(phase 2): 按 env.MAIL_PROVIDER 接具体发信商，发送成功再 return true（→ 双重确认）
  console.log(`[conilab] 发信商 '${env.MAIL_PROVIDER}' 尚未实现（${email}）`);
  return false;
}

// 双语确认信正文（phase 2 接发信商时用；现状未调用，先 export 备用）
export function confirmEmailHtml(confirmUrl: string): string {
  return `<!doctype html>
<html lang="zh"><body style="margin:0;padding:0;background:#faf8f3;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f3;">
    <tr><td align="center" style="padding:40px 20px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border:1px solid #e7e2d8;border-radius:8px;">
        <tr><td style="padding:36px 36px 30px;font-family:Georgia,'Times New Roman',serif;color:#1a1a1a;">
          <div style="font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#9a9384;">conilab &middot; 确认订阅</div>
          <h1 style="margin:18px 0 10px;font-size:24px;font-weight:400;line-height:1.3;">还差一步。<span style="font-style:italic;color:#5a5346;"> One more step.</span></h1>
          <p style="margin:0 0 24px;font-size:16px;line-height:1.65;color:#4a4439;">点下面确认订阅，下一篇 &ge;3000 字落地时，中英两面一起寄到。<br><span style="font-style:italic;color:#7a7263;">Click to confirm. Both sides land in your inbox when the next piece does.</span></p>
          <a href="${confirmUrl}" style="display:inline-block;background:#1a1a1a;color:#ffffff;text-decoration:none;padding:13px 26px;border-radius:999px;font-family:Helvetica,Arial,sans-serif;font-size:15px;">确认订阅 · Confirm &rarr;</a>
          <p style="margin:26px 0 0;font-size:13px;line-height:1.6;color:#9a9384;">不是你本人操作？忽略这封信即可。<br>Didn't request this? Just ignore it.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function confirmEmailText(confirmUrl: string): string {
  return [
    "确认订阅 conilab",
    "",
    "点这个链接确认订阅，下一篇 ≥3000 字落地时中英两面一起寄到：",
    confirmUrl,
    "",
    "不是你本人操作？忽略这封信即可。",
    "",
    "—",
    "Confirm your conilab subscription:",
    confirmUrl,
    "If you didn't request this, ignore this email.",
  ].join("\n");
}

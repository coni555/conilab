const METRICS_KEYS = ["highKnees", "pushups", "plank", "squats", "balance"];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function checkAuth(request, env) {
  const header = request.headers.get("Authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");
  return token && token === env.BODY_TOKEN;
}

export async function onRequestPost(context) {
  if (!checkAuth(context.request, context.env)) {
    return json({ error: "unauthorized" }, 401);
  }

  const { DB } = context.env;
  const body = await context.request.json();

  const metrics = {};
  for (const key of METRICS_KEYS) {
    const v = Number(body.metrics?.[key]);
    if (!Number.isFinite(v) || v < 0) return json({ error: `invalid metric: ${key}` }, 400);
    metrics[key] = v;
  }

  const sleepHours = Number(body.recovery?.sleepHours);
  const soreness = Number(body.recovery?.soreness);
  const fatigue = Number(body.recovery?.fatigue);
  const feeling = body.recovery?.completionFeeling;

  if (!Number.isFinite(sleepHours) || sleepHours < 0 || sleepHours > 24) {
    return json({ error: "invalid sleepHours" }, 400);
  }
  if (!Number.isFinite(soreness) || soreness < 1 || soreness > 5) {
    return json({ error: "invalid soreness" }, 400);
  }
  if (!Number.isFinite(fatigue) || fatigue < 1 || fatigue > 10) {
    return json({ error: "invalid fatigue" }, 400);
  }
  if (!["easy", "steady", "hard"].includes(feeling)) {
    return json({ error: "invalid completionFeeling" }, 400);
  }

  const recovery = { sleepHours, soreness, fatigue, completionFeeling: feeling };

  const now = new Date();
  const timestamp = body.timestamp || formatDateTime(now);

  await DB.prepare(
    "INSERT INTO training_log (logged_at, metrics, recovery) VALUES (?, ?, ?)"
  ).bind(timestamp, JSON.stringify(metrics), JSON.stringify(recovery)).run();

  await DB.prepare(
    "UPDATE body_state SET updated_at = datetime('now') WHERE id = 1"
  ).run();

  return json({ ok: true, timestamp });
}

function formatDateTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

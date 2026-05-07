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
  const targets = {};
  for (const key of METRICS_KEYS) {
    const v = Number(body.metrics?.[key]);
    const t = Number(body.targets?.[key]);
    if (!Number.isFinite(v) || v < 0) return json({ error: `invalid metric: ${key}` }, 400);
    if (!Number.isFinite(t) || t <= 0) return json({ error: `invalid target: ${key}` }, 400);
    metrics[key] = v;
    targets[key] = t;
  }

  const now = new Date();
  const timestamp = body.timestamp || formatDateTime(now);

  await DB.prepare(
    "INSERT INTO test_log (logged_at, metrics, targets) VALUES (?, ?, ?)"
  ).bind(timestamp, JSON.stringify(metrics), JSON.stringify(targets)).run();

  const stateRow = await DB.prepare("SELECT * FROM body_state WHERE id = 1").first();
  const oldBest = stateRow ? JSON.parse(stateRow.best_metrics || "{}") : {};

  const newBest = {};
  let newRecords = 0;
  for (const key of METRICS_KEYS) {
    const prev = Number(oldBest[key]) || 0;
    newBest[key] = Math.max(prev, metrics[key]);
    if (metrics[key] > prev) newRecords++;
  }

  let newLevel = stateRow?.level ?? 1;
  if (newRecords > 0) newLevel++;

  await DB.prepare(
    "UPDATE body_state SET level = ?, targets = ?, best_metrics = ?, updated_at = datetime('now') WHERE id = 1"
  ).bind(newLevel, JSON.stringify(targets), JSON.stringify(newBest)).run();

  return json({ ok: true, timestamp, newRecords, level: newLevel });
}

function formatDateTime(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${hh}:${mm}`;
}

const METRICS_KEYS = ["highKnees", "pushups", "plank", "squats", "balance"];

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function parseMetrics(raw) {
  try { return typeof raw === "string" ? JSON.parse(raw) : raw; }
  catch { return {}; }
}

function calcScore(current, target) {
  if (!target || target <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
}

function getStage(level) {
  return Math.max(1, Math.min(5, Math.floor((level - 1) / 2) + 1));
}

export async function onRequestGet(context) {
  const { DB } = context.env;

  const stateRow = await DB.prepare("SELECT * FROM body_state WHERE id = 1").first();
  const { results: trainingRows } = await DB.prepare(
    "SELECT * FROM training_log ORDER BY logged_at DESC LIMIT 60"
  ).all();
  const { results: testRows } = await DB.prepare(
    "SELECT * FROM test_log ORDER BY logged_at DESC LIMIT 40"
  ).all();

  const targets = parseMetrics(stateRow?.targets);
  const bestMetrics = parseMetrics(stateRow?.best_metrics);
  const level = stateRow?.level ?? 1;

  const trainingLog = trainingRows.map((r) => ({
    id: r.id,
    timestamp: r.logged_at,
    metrics: parseMetrics(r.metrics),
    recovery: parseMetrics(r.recovery),
  }));

  const testLog = testRows.map((r) => ({
    id: r.id,
    timestamp: r.logged_at,
    metrics: parseMetrics(r.metrics),
    targets: parseMetrics(r.targets),
  }));

  const latestTraining = trainingLog[0] ?? null;
  const latestTest = testLog[0] ?? null;

  const abilities = METRICS_KEYS.map((key) => ({
    key,
    score: calcScore(bestMetrics[key] ?? 0, targets[key] ?? 1),
    best: bestMetrics[key] ?? 0,
    target: targets[key] ?? 0,
  }));

  const avgScore = Math.round(abilities.reduce((s, a) => s + a.score, 0) / abilities.length);

  return json({
    level,
    stage: getStage(level),
    avgScore,
    targets,
    bestMetrics,
    latestTraining,
    latestTest,
    trainingLog,
    testLog,
    updatedAt: stateRow?.updated_at,
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

CREATE TABLE IF NOT EXISTS body_state (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  level INTEGER NOT NULL DEFAULT 1,
  targets TEXT NOT NULL DEFAULT '{}',
  best_metrics TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS training_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  logged_at TEXT NOT NULL,
  metrics TEXT NOT NULL,
  recovery TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS test_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  logged_at TEXT NOT NULL,
  metrics TEXT NOT NULL,
  targets TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO body_state (id, level, targets, best_metrics)
VALUES (1, 1, '{"highKnees":120,"pushups":50,"plank":180,"squats":80,"balance":120}', '{"highKnees":0,"pushups":0,"plank":0,"squats":0,"balance":0}');

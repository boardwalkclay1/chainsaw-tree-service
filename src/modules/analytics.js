// ============================================================
// ANALYTICS MODULE
// ============================================================

import { json } from "../utils.js";

export async function analyticsSummary(request, env) {
  const rows = await env.DB.prepare(
    "SELECT type, COUNT(*) as count FROM analytics GROUP BY type"
  ).all();

  const summary = {};
  rows.results.forEach(r => {
    summary[r.type] = r.count;
  });

  return json(summary);
}

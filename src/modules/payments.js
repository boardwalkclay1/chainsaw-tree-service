// ============================================================
// PAYMENTS MODULE
// ============================================================

import { json } from "../utils.js";

export async function listPayments(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM payments").all();
  return json(rows.results);
}

export async function paymentsSummary(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM payments").all();

  const totalRevenue = rows.results.reduce(
    (sum, p) => sum + (p.amount || 0),
    0
  );

  return json({ totalRevenue });
}

// ============================================================
// MESSAGES MODULE
// ============================================================

import { json, body } from "../utils.js";

export async function listMessages(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM messages").all();
  return json(rows.results);
}

export async function sendMessage(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO messages (toType, toId, subject, body) VALUES (?, ?, ?, ?)"
  ).bind(
    data.toType,
    data.toId,
    data.subject,
    data.body
  ).run();

  return json({ ok: true });
}

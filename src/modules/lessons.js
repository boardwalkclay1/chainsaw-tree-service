// ============================================================
// LESSONS MODULE
// ============================================================

import { json, body } from "../utils.js";

export async function listLessons(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM lessons").all();
  return json(rows.results);
}

export async function createLesson(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO lessons (title, description, level) VALUES (?, ?, ?)"
  ).bind(
    data.title,
    data.description,
    data.level
  ).run();

  return json({ ok: true });
}

export async function updateLesson(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE lessons SET title=?, description=?, level=? WHERE id=?"
  ).bind(
    data.title,
    data.description,
    data.level,
    data.id
  ).run();

  return json({ ok: true });
}

export async function deleteLesson(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "DELETE FROM lessons WHERE id=?"
  ).bind(data.id).run();

  return json({ ok: true });
}

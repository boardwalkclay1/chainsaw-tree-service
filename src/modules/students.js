// ============================================================
// STUDENTS MODULE
// ============================================================

import { json, body } from "../utils.js";

export async function listStudents(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM students").all();
  return json(rows.results);
}

export async function createStudent(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO students (name, phone, email, level, notes) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    data.name,
    data.phone,
    data.email,
    data.level,
    data.notes
  ).run();

  return json({ ok: true });
}

export async function updateStudent(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE students SET name=?, phone=?, email=?, level=?, notes=? WHERE id=?"
  ).bind(
    data.name,
    data.phone,
    data.email,
    data.level,
    data.notes,
    data.id
  ).run();

  return json({ ok: true });
}

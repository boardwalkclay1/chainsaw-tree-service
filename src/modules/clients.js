// ============================================================
// CLIENTS MODULE
// ============================================================

import { json, body } from "../utils.js";

export async function listClients(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM clients").all();
  return json(rows.results);
}

export async function createClient(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO clients (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    data.name,
    data.phone,
    data.email,
    data.address,
    data.notes
  ).run();

  return json({ ok: true });
}

export async function updateClient(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE clients SET name=?, phone=?, email=?, address=?, notes=? WHERE id=?"
  ).bind(
    data.name,
    data.phone,
    data.email,
    data.address,
    data.notes,
    data.id
  ).run();

  return json({ ok: true });
}

export async function estimateRequest(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO estimates (name, phone, email, address, description) VALUES (?, ?, ?, ?, ?)"
  ).bind(
    data.name,
    data.phone,
    data.email,
    data.address,
    data.description
  ).run();

  return json({ ok: true });
}

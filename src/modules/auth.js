// ============================================================
// AUTH MODULE
// ============================================================

import { json, body } from "../utils.js";

export async function login(request, env) {
  const data = await body(request);

  const user = await env.DB.prepare(
    "SELECT id, email FROM users WHERE email = ? AND password = ?"
  ).bind(data.email, data.password).first();

  if (!user) return json({ error: "Invalid login" }, 401);

  return json(user);
}

export async function me() {
  return json({
    id: 1,
    email: "admin@chainsawclay.com",
    role: "admin"
  });
}

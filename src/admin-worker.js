export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // AUTH
      if (path === "/api/auth/login") return safe(login, request, env);
      if (path === "/api/auth/me") return safe(me, request, env);

      // ADMIN DASHBOARD
      if (path === "/api/admin/dashboard") return safe(adminDashboard, request, env);

      // ANALYTICS
      if (path === "/api/admin/analytics/summary") return safe(analyticsSummary, request, env);

      // PAYMENTS
      if (path === "/api/admin/payments/list") return safe(listPayments, request, env);
      if (path === "/api/admin/payments/summary") return safe(paymentsSummary, request, env);

      // VIDEOS
      if (path === "/api/admin/videos/upload-url") return safe(getVideoUploadUrl, request, env);
      if (path === "/api/admin/videos/list") return safe(listVideos, request, env);
      if (path === "/api/admin/videos/delete") return safe(deleteVideo, request, env);

      // LESSONS
      if (path === "/api/admin/lessons/list") return safe(listLessons, request, env);
      if (path === "/api/admin/lessons/create") return safe(createLesson, request, env);
      if (path === "/api/admin/lessons/update") return safe(updateLesson, request, env);
      if (path === "/api/admin/lessons/delete") return safe(deleteLesson, request, env);

      // RESERVATIONS
      if (path === "/api/admin/reservations/list") return safe(listReservations, request, env);
      if (path === "/api/admin/reservations/create") return safe(createReservation, request, env);
      if (path === "/api/admin/reservations/update") return safe(updateReservation, request, env);

      // CLIENTS
      if (path === "/api/admin/clients/list") return safe(listClients, request, env);
      if (path === "/api/admin/clients/create") return safe(createClient, request, env);
      if (path === "/api/admin/clients/update") return safe(updateClient, request, env);
      if (path === "/api/admin/clients/estimate") return safe(estimateRequest, request, env);

      // STUDENTS
      if (path === "/api/admin/students/list") return safe(listStudents, request, env);
      if (path === "/api/admin/students/create") return safe(createStudent, request, env);
      if (path === "/api/admin/students/update") return safe(updateStudent, request, env);

      // CITIES
      if (path === "/api/admin/cities/list") return safe(listCities, request, env);
      if (path === "/api/admin/cities/create") return safe(createCity, request, env);

      // MESSAGES
      if (path === "/api/admin/messages/list") return safe(listMessages, request, env);
      if (path === "/api/admin/messages/send") return safe(sendMessage, request, env);

      return json({ error: "Not found" }, 404);

    } catch (err) {
      return json({ error: err.message || "Server error" }, 500);
    }
  }
};

// =========================
// SAFETY WRAPPER
// =========================

async function safe(fn, request, env) {
  try {
    return await fn(request, env);
  } catch (err) {
    if (err.message?.includes("no such table")) {
      return json({
        error: "Missing D1 table",
        detail: err.message,
        fix: "Run your D1 schema to create all required tables."
      }, 500);
    }
    return json({ error: err.message }, 500);
  }
}

// =========================
// HELPERS
// =========================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

async function body(request) {
  if (request.method === "GET") return {};
  return await request.json();
}

// =========================
// AUTH
// =========================

async function login(request, env) {
  const data = await body(request);
  const user = await env.DB.prepare(
    "SELECT id, email FROM users WHERE email = ? AND password = ?"
  ).bind(data.email, data.password).first();

  if (!user) return json({ error: "Invalid login" }, 401);
  return json(user);
}

async function me() {
  return json({ id: 1, email: "admin@chainsawclay.com", role: "admin" });
}

// =========================
// ADMIN DASHBOARD
// =========================

async function adminDashboard(request, env) {
  const [
    videos,
    lessons,
    clients,
    students,
    reservations,
    cities,
    messages,
    analytics,
    payments
  ] = await Promise.all([
    env.DB.prepare("SELECT * FROM videos").all(),
    env.DB.prepare("SELECT * FROM lessons").all(),
    env.DB.prepare("SELECT * FROM clients").all(),
    env.DB.prepare("SELECT * FROM students").all(),
    env.DB.prepare("SELECT * FROM reservations").all(),
    env.DB.prepare("SELECT * FROM cities").all(),
    env.DB.prepare("SELECT * FROM messages").all(),
    env.DB.prepare("SELECT type, COUNT(*) as count FROM analytics GROUP BY type").all(),
    env.DB.prepare("SELECT * FROM payments").all()
  ]);

  const analyticsSummary = {};
  analytics.results.forEach(r => analyticsSummary[r.type] = r.count);

  return json({
    videos: videos.results,
    lessons: lessons.results,
    clients: clients.results,
    students: students.results,
    reservations: reservations.results,
    cities: cities.results,
    messages: messages.results,
    analytics: analyticsSummary,
    payments: payments.results
  });
}

// =========================
// ANALYTICS
// =========================

async function analyticsSummary(request, env) {
  const rows = await env.DB.prepare(
    "SELECT type, COUNT(*) as count FROM analytics GROUP BY type"
  ).all();

  const summary = {};
  rows.results.forEach(r => summary[r.type] = r.count);

  return json(summary);
}

// =========================
// PAYMENTS
// =========================

async function listPayments(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM payments").all();
  return json(rows.results);
}

async function paymentsSummary(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM payments").all();

  const totalRevenue = rows.results.reduce((sum, p) => sum + (p.amount || 0), 0);

  return json({ totalRevenue });
}

// =========================
// VIDEOS (R2)
// =========================

async function getVideoUploadUrl(request, env) {
  const data = await body(request);

  const videoId = crypto.randomUUID();
  const key = `videos/${videoId}.mp4`;

  const uploadUrl = await env.VIDEOS_BUCKET.createPresignedUrl({
    key,
    method: "PUT",
    expiration: 3600
  });

  await env.DB.prepare(
    "INSERT INTO videos (id, title, lessonId, category, key) VALUES (?, ?, ?, ?, ?)"
  ).bind(videoId, data.title, data.lessonId || null, data.category, key).run();

  return json({ uploadUrl, videoId, key });
}

async function listVideos(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM videos").all();
  return json(rows.results);
}

async function deleteVideo(request, env) {
  const data = await body(request);

  const video = await env.DB.prepare(
    "SELECT key FROM videos WHERE id = ?"
  ).bind(data.videoId).first();

  if (video) {
    await env.VIDEOS_BUCKET.delete(video.key);
    await env.DB.prepare("DELETE FROM videos WHERE id = ?").bind(data.videoId).run();
  }

  return json({ ok: true });
}

// =========================
// LESSONS
// =========================

async function listLessons(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM lessons").all();
  return json(rows.results);
}

async function createLesson(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO lessons (title, description, level) VALUES (?, ?, ?)"
  ).bind(data.title, data.description, data.level).run();

  return json({ ok: true });
}

async function updateLesson(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE lessons SET title=?, description=?, level=? WHERE id=?"
  ).bind(data.title, data.description, data.level, data.id).run();

  return json({ ok: true });
}

async function deleteLesson(request, env) {
  const data = await body(request);

  await env.DB.prepare("DELETE FROM lessons WHERE id=?").bind(data.id).run();

  return json({ ok: true });
}

// =========================
// RESERVATIONS
// =========================

async function listReservations(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM reservations").all();
  return json(rows.results);
}

async function createReservation(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO reservations (studentId, classId, date, status) VALUES (?, ?, ?, ?)"
  ).bind(data.studentId, data.classId, data.date, "pending").run();

  return json({ ok: true });
}

async function updateReservation(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE reservations SET status=? WHERE id=?"
  ).bind(data.status, data.id).run();

  return json({ ok: true });
}

// =========================
// CLIENTS
// =========================

async function listClients(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM clients").all();
  return json(rows.results);
}

async function createClient(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO clients (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.name, data.phone, data.email, data.address, data.notes).run();

  return json({ ok: true });
}

async function updateClient(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE clients SET name=?, phone=?, email=?, address=?, notes=? WHERE id=?"
  ).bind(data.name, data.phone, data.email, data.address, data.notes, data.id).run();

  return json({ ok: true });
}

async function estimateRequest(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO estimates (name, phone, email, address, description) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.name, data.phone, data.email, data.address, data.description).run();

  return json({ ok: true });
}

// =========================
// STUDENTS
// =========================

async function listStudents(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM students").all();
  return json(rows.results);
}

async function createStudent(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO students (name, phone, email, level, notes) VALUES (?, ?, ?, ?, ?)"
  ).bind(data.name, data.phone, data.email, data.level, data.notes).run();

  return json({ ok: true });
}

async function updateStudent(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "UPDATE students SET name=?, phone=?, email=?, level=?, notes=? WHERE id=?"
  ).bind(data.name, data.phone, data.email, data.level, data.notes, data.id).run();

  return json({ ok: true });
}

// =========================
// CITIES
// =========================

async function listCities(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM cities").all();
  return json(rows.results);
}

async function createCity(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO cities (name, state, type) VALUES (?, ?, ?)"
  ).bind(data.name, data.state, data.type).run();

  return json({ ok: true });
}

// =========================
// MESSAGES
// =========================

async function listMessages(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM messages").all();
  return json(rows.results);
}

async function sendMessage(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO messages (toType, toId, subject, body) VALUES (?, ?, ?, ?)"
  ).bind(data.toType, data.toId, data.subject, data.body).run();

  return json({ ok: true });
}

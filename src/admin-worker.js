export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // =========================
      // AUTH
      // =========================
      if (path === "/api/auth/login") return login(request, env);
      if (path === "/api/auth/me") return me(request, env);

      // =========================
      // ADMIN DASHBOARD
      // =========================
      if (path === "/api/admin/dashboard") return adminDashboard(request, env);

      // =========================
      // ANALYTICS
      // =========================
      if (path === "/api/analytics/view") return analyticsView(request, env);
      if (path === "/api/analytics/video-play") return analyticsVideoPlay(request, env);
      if (path === "/api/analytics/login") return analyticsLogin(request, env);
      if (path === "/api/analytics/summary") return analyticsSummary(request, env);

      // =========================
      // PAYMENTS / FINANCES
      // =========================
      if (path === "/api/payments/intent") return createPaymentIntent(request, env);
      if (path === "/api/payments/list") return listPayments(request, env);
      if (path === "/api/payments/summary") return paymentsSummary(request, env);

      // =========================
      // VIDEOS (R2 + ADMIN)
      // =========================
      if (path === "/api/videos/upload-url") return getVideoUploadUrl(request, env);
      if (path === "/api/videos/list") return listVideos(request, env);
      if (path === "/api/videos/delete") return deleteVideo(request, env);
      if (path === "/api/videos/admin/list") return adminListVideos(request, env);
      if (path === "/api/videos/admin/get") return adminGetVideo(request, env);

      // =========================
      // LESSONS
      // =========================
      if (path === "/api/lessons/create") return createLesson(request, env);
      if (path === "/api/lessons/update") return updateLesson(request, env);
      if (path === "/api/lessons/delete") return deleteLesson(request, env);
      if (path === "/api/lessons/list") return listLessons(request, env);

      // =========================
      // RESERVATIONS
      // =========================
      if (path === "/api/reservations/create") return createReservation(request, env);
      if (path === "/api/reservations/list") return listReservations(request, env);
      if (path === "/api/reservations/update") return updateReservation(request, env);

      // =========================
      // CLIENTS
      // =========================
      if (path === "/api/clients/list") return listClients(request, env);
      if (path === "/api/clients/create") return createClient(request, env);
      if (path === "/api/clients/update") return updateClient(request, env);
      if (path === "/api/clients/estimate") return estimateRequest(request, env);

      // =========================
      // STUDENTS
      // =========================
      if (path === "/api/students/list") return listStudents(request, env);
      if (path === "/api/students/create") return createStudent(request, env);
      if (path === "/api/students/update") return updateStudent(request, env);

      // =========================
      // CITIES
      // =========================
      if (path === "/api/cities/list") return listCities(request, env);
      if (path === "/api/cities/create") return createCity(request, env);

      // =========================
      // MESSAGES
      // =========================
      if (path === "/api/messages/send") return sendMessage(request, env);
      if (path === "/api/messages/list") return listMessages(request, env);

      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Server error" }, 500);
    }
  }
};

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
  const { email, password } = data;

  const user = await env.DB.prepare(
    "SELECT id, email FROM users WHERE email = ? AND password = ?"
  ).bind(email, password).first();

  if (!user) return json({ error: "Invalid login" }, 401);

  return json({ id: user.id, email: user.email });
}

async function me(request, env) {
  // simple static admin identity for now
  return json({ id: 1, email: "admin@chainsawclay.com", role: "admin" });
}

// =========================
// ADMIN DASHBOARD (ALL DATA)
// =========================

async function adminDashboard(request, env) {
  const [videos, lessons, clients, students, reservations, cities, messages, analytics, payments] =
    await Promise.all([
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

  const totalRevenue = payments.results.reduce((sum, p) => sum + (p.amount || 0), 0);

  return json({
    videos: videos.results,
    lessons: lessons.results,
    clients: clients.results,
    students: students.results,
    reservations: reservations.results,
    cities: cities.results,
    messages: messages.results,
    analytics: analyticsSummary,
    payments: payments.results,
    finances: {
      totalRevenue
    }
  });
}

// =========================
// ANALYTICS
// =========================

async function analyticsView(request, env) {
  const data = await body(request);
  await env.DB.prepare(
    "INSERT INTO analytics (type, meta) VALUES (?, ?)"
  ).bind("view", JSON.stringify(data.meta || {})).run();
  return json({ ok: true });
}

async function analyticsVideoPlay(request, env) {
  const data = await body(request);
  await env.DB.prepare(
    "INSERT INTO analytics (type, meta) VALUES (?, ?)"
  ).bind("video-play", JSON.stringify({ videoId: data.videoId })).run();
  return json({ ok: true });
}

async function analyticsLogin(request, env) {
  const data = await body(request);
  await env.DB.prepare(
    "INSERT INTO analytics (type, meta) VALUES (?, ?)"
  ).bind("login", JSON.stringify({ userId: data.userId })).run();
  return json({ ok: true });
}

async function analyticsSummary(request, env) {
  const rows = await env.DB.prepare(
    "SELECT type, COUNT(*) as count FROM analytics GROUP BY type"
  ).all();

  const summary = {};
  rows.results.forEach(r => summary[r.type] = r.count);

  return json(summary);
}

// =========================
// PAYMENTS / FINANCES
// =========================

async function createPaymentIntent(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO payments (userId, amount, type, source) VALUES (?, ?, ?, ?)"
  ).bind(data.userId, data.amount, data.type, data.source).run();

  return json({ ok: true });
}

async function listPayments(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM payments").all();
  return json(rows.results);
}

async function paymentsSummary(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM payments").all();
  const totalRevenue = rows.results.reduce((sum, p) => sum + (p.amount || 0), 0);

  const byType = {};
  rows.results.forEach(p => {
    const t = p.type || "unknown";
    byType[t] = (byType[t] || 0) + (p.amount || 0);
  });

  return json({
    totalRevenue,
    byType
  });
}

// =========================
// VIDEO UPLOADS (R2)
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
  ).bind(videoId, data.title, data.lessonId, data.category, key).run();

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

// Admin video list with preview URL (assuming public bucket or signed GET)
async function adminListVideos(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM videos").all();

  const videos = rows.results.map(v => ({
    ...v,
    previewUrl: `/api/videos/admin/get?id=${v.id}`
  }));

  return json(videos);
}

async function adminGetVideo(request, env) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  const video = await env.DB.prepare(
    "SELECT key FROM videos WHERE id = ?"
  ).bind(id).first();

  if (!video) return json({ error: "Not found" }, 404);

  const object = await env.VIDEOS_BUCKET.get(video.key);
  if (!object) return json({ error: "Not found" }, 404);

  return new Response(object.body, {
    headers: {
      "Content-Type": "video/mp4"
    }
  });
}

// =========================
// LESSONS
// =========================

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

async function listLessons(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM lessons").all();
  return json(rows.results);
}

// =========================
// RESERVATIONS
// =========================

async function createReservation(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO reservations (studentId, classId, date, status) VALUES (?, ?, ?, ?)"
  ).bind(data.studentId, data.classId, data.date, "pending").run();

  return json({ ok: true });
}

async function listReservations(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM reservations").all();
  return json(rows.results);
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

async function sendMessage(request, env) {
  const data = await body(request);

  await env.DB.prepare(
    "INSERT INTO messages (toType, toId, subject, body) VALUES (?, ?, ?, ?)"
  ).bind(data.toType, data.toId, data.subject, data.body).run();

  return json({ ok: true });
}

async function listMessages(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM messages").all();
  return json(rows.results);
}

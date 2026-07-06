import adminWorker from "./admin-worker.js";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ============================
    // CORS PRE-FLIGHT
    // ============================
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS });
    }

    // ============================
    // ADMIN WORKER DELEGATION
    // ============================
    if (path.startsWith("/api/admin/")) {
      const res = await adminWorker.fetch(request, env, ctx);
      const text = await res.text();

      return new Response(text, {
        status: res.status,
        headers: {
          ...Object.fromEntries(res.headers),
          ...CORS
        }
      });
    }

    try {
      // ============================
      // AUTH
      // ============================
      if (path === "/api/auth/login") return json(await login(request, env));
      if (path === "/api/auth/me") return json(await me(request, env));

      // ============================
      // ANALYTICS
      // ============================
      if (path === "/api/analytics/view") return json(await analyticsView(request, env));
      if (path === "/api/analytics/video-play") return json(await analyticsVideoPlay(request, env));
      if (path === "/api/analytics/login") return json(await analyticsLogin(request, env));
      if (path === "/api/analytics/summary") return json(await analyticsSummary(request, env));

      // ============================
      // PAYMENTS
      // ============================
      if (path === "/api/payments/intent") return json(await createPaymentIntent(request, env));
      if (path === "/api/payments/list") return json(await listPayments(request, env));

      // ============================
      // VIDEOS
      // ============================
      if (path === "/api/videos/upload-url") return json(await getVideoUploadUrl(request, env));
      if (path === "/api/videos/list") return json(await listVideos(request, env));
      if (path === "/api/videos/delete") return json(await deleteVideo(request, env));

      // ============================
      // LESSONS
      // ============================
      if (path === "/api/lessons/create") return json(await createLesson(request, env));
      if (path === "/api/lessons/update") return json(await updateLesson(request, env));
      if (path === "/api/lessons/delete") return json(await deleteLesson(request, env));
      if (path === "/api/lessons/list") return json(await listLessons(request, env));

      // ============================
      // RESERVATIONS
      // ============================
      if (path === "/api/reservations/create") return json(await createReservation(request, env));
      if (path === "/api/reservations/list") return json(await listReservations(request, env));
      if (path === "/api/reservations/update") return json(await updateReservation(request, env));

      // ============================
      // CLIENTS
      // ============================
      if (path === "/api/clients/list") return json(await listClients(request, env));
      if (path === "/api/clients/create") return json(await createClient(request, env));
      if (path === "/api/clients/update") return json(await updateClient(request, env));
      if (path === "/api/clients/estimate") return json(await estimateRequest(request, env));

      // ============================
      // STUDENTS
      // ============================
      if (path === "/api/students/list") return json(await listStudents(request, env));
      if (path === "/api/students/create") return json(await createStudent(request, env));
      if (path === "/api/students/update") return json(await updateStudent(request, env));

      // ============================
      // CITIES
      // ============================
      if (path === "/api/cities/list") return json(await listCities(request, env));
      if (path === "/api/cities/create") return json(await createCity(request, env));

      // ============================
      // MESSAGES
      // ============================
      if (path === "/api/messages/send") return json(await sendMessage(request, env));
      if (path === "/api/messages/list") return json(await listMessages(request, env));

      // ============================
      // PAYWALL ACCESS SYSTEM
      // ============================
      if (path === "/api/access/check") return json(await checkAccess(request, env));
      if (path === "/api/access/unlock") return json(await unlockAccess(request, env));

      return json({ error: "Not found" }, 404);

    } catch (err) {
      return json({ error: err.message || "Server error" }, 500);
    }
  }
};

// ============================
// HELPERS
// ============================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS
    }
  });
}

async function body(request) {
  if (request.method === "GET") return {};
  return await request.json();
}

// ============================
// PAYWALL ACCESS HANDLERS
// ============================

async function checkAccess(request, env) {
  const { user_id, item_key } = await request.json();

  const full = await env.DB_chainsaw
    .prepare("SELECT * FROM access WHERE user_id = ? AND item_key = ?")
    .bind(user_id, "throwball_full")
    .first();

  if (full) return { access: true };

  const item = await env.DB_chainsaw
    .prepare("SELECT * FROM access WHERE user_id = ? AND item_key = ?")
    .bind(user_id, item_key)
    .first();

  return { access: !!item };
}

async function unlockAccess(request, env) {
  const { user_id, item_key } = await request.json();

  await env.DB_chainsaw
    .prepare("INSERT INTO access (user_id, item_key) VALUES (?, ?)")
    .bind(user_id, item_key)
    .run();

  return { success: true };
}

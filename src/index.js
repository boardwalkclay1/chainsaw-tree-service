import { login, me } from "./modules/auth.js";

import { adminDashboard } from "./modules/dashboard.js";

import { analyticsSummary } from "./modules/analytics.js";

import { listPayments, paymentsSummary } from "./modules/payments.js";

import { getVideoUploadUrl, listVideos, deleteVideo } from "./modules/videos.js";

import { listLessons, createLesson, updateLesson, deleteLesson } from "./modules/lessons.js";

import { listReservations, createReservation, updateReservation } from "./modules/reservations.js";

import { listClients, createClient, updateClient, estimateRequest } from "./modules/clients.js";

import { listStudents, createStudent, updateStudent } from "./modules/students.js";

import { listCities, createCity } from "./modules/cities.js";

import { listMessages, sendMessage } from "./modules/messages.js";

import { json, body } from "./utils.js";


// ============================================================
// GLOBAL CORS — FIXES ALL ADMIN ERRORS
// ============================================================

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, x-rtg-admin, x-client-id, x-treeguy-id, X-RTG-User, X-RTG-Email, X-RTG-Type",
    "Access-Control-Max-Age": "86400"
  };
}


// ============================================================
// MAIN WORKER
// ============================================================

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // ------------------------------------------------------------
    // HANDLE PRE-FLIGHT OPTIONS REQUESTS
    // ------------------------------------------------------------
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders()
      });
    }

    try {

      // =========================
      // AUTH
      // =========================
      if (path === "/api/auth/login") return safe(login, request, env);
      if (path === "/api/auth/me") return safe(me, request, env);

      // =========================
      // ADMIN DASHBOARD
      // =========================
      if (path === "/api/admin/dashboard") return safe(adminDashboard, request, env);

      // =========================
      // ANALYTICS
      // =========================
      if (path === "/api/admin/analytics/summary") return safe(analyticsSummary, request, env);

      // =========================
      // PAYMENTS
      // =========================
      if (path === "/api/admin/payments/list") return safe(listPayments, request, env);
      if (path === "/api/admin/payments/summary") return safe(paymentsSummary, request, env);

      // =========================
      // VIDEOS
      // =========================
      if (path === "/api/admin/videos/upload-url") return safe(getVideoUploadUrl, request, env);
      if (path === "/api/admin/videos/list") return safe(listVideos, request, env);
      if (path === "/api/admin/videos/delete") return safe(deleteVideo, request, env);

      // =========================
      // LESSONS
      // =========================
      if (path === "/api/admin/lessons/list") return safe(listLessons, request, env);
      if (path === "/api/admin/lessons/create") return safe(createLesson, request, env);
      if (path === "/api/admin/lessons/update") return safe(updateLesson, request, env);
      if (path === "/api/admin/lessons/delete") return safe(deleteLesson, request, env);

      // =========================
      // RESERVATIONS
      // =========================
      if (path === "/api/admin/reservations/list") return safe(listReservations, request, env);
      if (path === "/api/admin/reservations/create") return safe(createReservation, request, env);
      if (path === "/api/admin/reservations/update") return safe(updateReservation, request, env);

      // =========================
      // CLIENTS
      // =========================
      if (path === "/api/admin/clients/list") return safe(listClients, request, env);
      if (path === "/api/admin/clients/create") return safe(createClient, request, env);
      if (path === "/api/admin/clients/update") return safe(updateClient, request, env);
      if (path === "/api/admin/clients/estimate") return safe(estimateRequest, request, env);

      // =========================
      // STUDENTS
      // =========================
      if (path === "/api/admin/students/list") return safe(listStudents, request, env);
      if (path === "/api/admin/students/create") return safe(createStudent, request, env);
      if (path === "/api/admin/students/update") return safe(updateStudent, request, env);

      // =========================
      // CITIES
      // =========================
      if (path === "/api/admin/cities/list") return safe(listCities, request, env);
      if (path === "/api/admin/cities/create") return safe(createCity, request, env);

      // =========================
      // MESSAGES
      // =========================
      if (path === "/api/admin/messages/list") return safe(listMessages, request, env);
      if (path === "/api/admin/messages/send") return safe(sendMessage, request, env);

      return json({ error: "Not found" }, 404);

    } catch (err) {
      return json({ error: err.message || "Server error" }, 500);
    }
  }
};


// ============================================================
// SAFETY WRAPPER
// ============================================================

async function safe(fn, request, env) {
  try {
    const result = await fn(request, env);

    // Inject CORS into every JSON response
    const res = new Response(result.body, {
      status: result.status,
      headers: {
        ...result.headers,
        ...corsHeaders()
      }
    });

    return res;

  } catch (err) {
    return json({ error: err.message }, 500);
  }
}

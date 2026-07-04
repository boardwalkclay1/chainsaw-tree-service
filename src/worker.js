import adminWorker from "./admin-worker.js";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Delegate all /api/admin/* to admin-worker.js
    if (path.startsWith("/api/admin/")) {
      return adminWorker.fetch(request, env, ctx);
    }

    try {
      // AUTH
      if (path === "/api/auth/login") return login(request, env);
      if (path === "/api/auth/me") return me(request, env);

      // ANALYTICS
      if (path === "/api/analytics/view") return analyticsView(request, env);
      if (path === "/api/analytics/video-play") return analyticsVideoPlay(request, env);
      if (path === "/api/analytics/login") return analyticsLogin(request, env);
      if (path === "/api/analytics/summary") return analyticsSummary(request, env);

      // PAYMENTS
      if (path === "/api/payments/intent") return createPaymentIntent(request, env);
      if (path === "/api/payments/list") return listPayments(request, env);

      // VIDEOS
      if (path === "/api/videos/upload-url") return getVideoUploadUrl(request, env);
      if (path === "/api/videos/list") return listVideos(request, env);
      if (path === "/api/videos/delete") return deleteVideo(request, env);

      // LESSONS
      if (path === "/api/lessons/create") return createLesson(request, env);
      if (path === "/api/lessons/update") return updateLesson(request, env);
      if (path === "/api/lessons/delete") return deleteLesson(request, env);
      if (path === "/api/lessons/list") return listLessons(request, env);

      // RESERVATIONS
      if (path === "/api/reservations/create") return createReservation(request, env);
      if (path === "/api/reservations/list") return listReservations(request, env);
      if (path === "/api/reservations/update") return updateReservation(request, env);

      // CLIENTS
      if (path === "/api/clients/list") return listClients(request, env);
      if (path === "/api/clients/create") return createClient(request, env);
      if (path === "/api/clients/update") return updateClient(request, env);
      if (path === "/api/clients/estimate") return estimateRequest(request, env);

      // STUDENTS
      if (path === "/api/students/list") return listStudents(request, env);
      if (path === "/api/students/create") return createStudent(request, env);
      if (path === "/api/students/update") return updateStudent(request, env);

      // CITIES
      if (path === "/api/cities/list") return listCities(request, env);
      if (path === "/api/cities/create") return createCity(request, env);

      // MESSAGES
      if (path === "/api/messages/send") return sendMessage(request, env);
      if (path === "/api/messages/list") return listMessages(request, env);

      return json({ error: "Not found" }, 404);
    } catch (err) {
      return json({ error: err.message || "Server error" }, 500);
    }
  }
};

// keep all your existing helper + route functions here (json, body, login, etc.)

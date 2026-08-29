// ============================================================
// ADMIN DASHBOARD MODULE
// ============================================================

import { json } from "../utils.js";

export async function adminDashboard(request, env) {
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
  analytics.results.forEach(r => {
    analyticsSummary[r.type] = r.count;
  });

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

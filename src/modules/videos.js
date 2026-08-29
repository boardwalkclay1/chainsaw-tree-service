// ============================================================
// VIDEOS MODULE (R2)
// ============================================================

import { json, body } from "../utils.js";

export async function getVideoUploadUrl(request, env) {
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
  ).bind(
    videoId,
    data.title,
    data.lessonId || null,
    data.category,
    key
  ).run();

  return json({ uploadUrl, videoId, key });
}

export async function listVideos(request, env) {
  const rows = await env.DB.prepare("SELECT * FROM videos").all();
  return json(rows.results);
}

export async function deleteVideo(request, env) {
  const data = await body(request);

  const video = await env.DB.prepare(
    "SELECT key FROM videos WHERE id = ?"
  ).bind(data.videoId).first();

  if (video) {
    await env.VIDEOS_BUCKET.delete(video.key);
    await env.DB.prepare(
      "DELETE FROM videos WHERE id = ?"
    ).bind(data.videoId).run();
  }

  return json({ ok: true });
}

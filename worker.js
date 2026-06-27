export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method !== "POST") {
      return new Response("Use POST to upload.", { status: 405 });
    }

    const contentType = request.headers.get("Content-Type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response("Invalid upload format.", { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("video");

    if (!file) {
      return new Response("No video found.", { status: 400 });
    }

    const fileName = `${Date.now()}_${file.name}`;
    const arrayBuffer = await file.arrayBuffer();

    await env.VIDEOS.put(fileName, arrayBuffer);

    const publicUrl = `${env.PUBLIC_URL}/${fileName}`;

    return new Response(
      JSON.stringify({
        status: "ok",
        file: fileName,
        url: publicUrl,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  },
};

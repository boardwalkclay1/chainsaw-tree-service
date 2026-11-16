const CONTACT_ORIGINS = new Set([
  "https://chainsawclay.com",
  "https://www.chainsawclay.com"
]);

function contactHeaders(origin) {
  const headers = {
    "Content-Type": "application/json",
    "Vary": "Origin"
  };

  if (origin && CONTACT_ORIGINS.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "Content-Type";
    headers["Access-Control-Max-Age"] = "86400";
  }

  return headers;
}

function contactResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: contactHeaders(origin)
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/estimate") {
      const origin = request.headers.get("Origin");

      if (origin && !CONTACT_ORIGINS.has(origin)) {
        return contactResponse({ error: "Origin not allowed." }, 403, origin);
      }

      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: contactHeaders(origin)
        });
      }

      if (request.method !== "POST") {
        return contactResponse({ error: "Method not allowed." }, 405, origin);
      }
    }

    /* ============================================================
       GET REVIEWS (Tree Service)
       ============================================================ */
    if (url.pathname === "/api/reviews" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM reviews ORDER BY id DESC"
      ).all();

      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    /* ============================================================
       POST REVIEW (Tree Service)
       ============================================================ */
    if (url.pathname === "/api/reviews" && request.method === "POST") {
      const form = await request.formData();

      const name = form.get("name");
      const email = form.get("email");
      const stars = parseInt(form.get("stars"));
      const text = form.get("text");
      const photoFile = form.get("photo");

      let photoUrl = null;

      // Upload photo to R2 if provided
      if (photoFile && typeof photoFile === "object") {
        const fileName = `review-${Date.now()}-${photoFile.name}`;
        await env.REVIEWS_BUCKET.put(fileName, photoFile.stream());
        photoUrl = `${env.REVIEWS_PUBLIC_URL}/${fileName}`;
      }

      await env.DB.prepare(
        "INSERT INTO reviews (name, email, stars, text, photo) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(name, email, stars, text, photoUrl)
        .run();

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    /* ============================================================
       TREE SERVICE ESTIMATE → EMAIL (with photo)
       ============================================================ */
    if (url.pathname === "/api/estimate" && request.method === "POST") {
      const form = await request.formData();

      const readField = (field, maxLength) => {
        const value = form.get(field);
        if (typeof value !== "string") return null;

        const trimmedValue = value.trim();
        return trimmedValue.length <= maxLength ? trimmedValue : null;
      };

      const name = readField("name", 120);
      const phone = readField("phone", 40);
      const email = readField("email", 254);
      const address = readField("address", 300);
      const service = readField("service", 80);
      const description = readField("description", 3000);
      const photoFile = form.get("photo");

      const validServices = new Set([
        "Tree Removal",
        "Pruning",
        "Storm Cleanup",
        "General Cleanup",
        "Planting / Layout"
      ]);

      if (
        !name ||
        !phone ||
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !address ||
        !service ||
        !validServices.has(service) ||
        description === null
      ) {
        return contactResponse(
          { error: "Please provide valid contact details and service information." },
          400,
          request.headers.get("Origin")
        );
      }

      let photoUrl = null;

      // Upload photo to R2 if provided
      if (photoFile && typeof photoFile === "object") {
        const fileName = `estimate-${Date.now()}-${photoFile.name}`;
        await env.REVIEWS_BUCKET.put(fileName, photoFile.stream());
        photoUrl = `${env.REVIEWS_PUBLIC_URL}/${fileName}`;
      }

      /* ============================================================
         SEND EMAIL TO CLAY
         ============================================================ */
      const emailBody = `
New Tree Service Estimate Request

Name: ${name}
Phone: ${phone}
Email: ${email}
Address: ${address}
Service Type: ${service}

Description:
${description}

Photo:
${photoUrl ? photoUrl : "No photo uploaded"}
      `.trim();

      await env.EMAIL.send({
        from: env.MAIL_FROM,
        to: "support@chainsawclay.com",
        replyTo: email,
        subject: "New Tree Service Estimate Request",
        text: emailBody
      });

      return contactResponse({ success: true }, 200, request.headers.get("Origin"));
    }

    /* ============================================================
       NOT FOUND
       ============================================================ */
    return new Response("Not found", { status: 404 });
  }
};

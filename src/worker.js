export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

      const name = form.get("name");
      const phone = form.get("phone");
      const email = form.get("email");
      const address = form.get("address");
      const service = form.get("service");
      const description = form.get("description");
      const photoFile = form.get("photo");

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
        from: "noreply@chainsawclay.com",
        to: "support@chainsawclay.com",
        subject: `New Estimate Request from ${name}`,
        text: emailBody
      });

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    /* ============================================================
       NOT FOUND
       ============================================================ */
    return new Response("Not found", { status: 404 });
  }
};

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    const path = url.pathname;

    const method = request.method;

    // =====================================================
    // CLASSES
    // =====================================================

    if (
      path === "/api/classes" &&
      method === "GET"
    ) {
      return handleClasses(env);
    }

    // =====================================================
    // USER
    // =====================================================

    if (
      path === "/api/user/upsert" &&
      method === "POST"
    ) {
      return handleUserUpsert(
        request,
        env
      );
    }

    // =====================================================
    // ENROLLMENT
    // =====================================================

    if (
      path === "/api/class-signup" &&
      method === "POST"
    ) {
      return handleClassSignup(
        request,
        env
      );
    }

    // =====================================================
    // PAYMENTS
    // =====================================================

    if (
      path === "/api/payment/create" &&
      method === "POST"
    ) {
      return handlePayment(
        request,
        env
      );
    }

    // =====================================================
    // LESSONS
    // =====================================================

    if (
      path === "/api/lesson/complete" &&
      method === "POST"
    ) {
      return handleLessonComplete(
        request,
        env
      );
    }

    // =====================================================
    // DASHBOARD
    // =====================================================

    if (
      path === "/api/student/dashboard" &&
      method === "POST"
    ) {
      return handleDashboard(
        request,
        env
      );
    }

    if (
      path === "/api/student/courses" &&
      method === "POST"
    ) {
      return handleCourses(
        request,
        env
      );
    }

    if (
      path === "/api/student/progress" &&
      method === "POST"
    ) {
      return handleProgress(
        request,
        env
      );
    }

    if (
      path === "/api/student/certificates" &&
      method === "POST"
    ) {
      return handleCertificates(
        request,
        env
      );
    }

    return json(
      {
        error: "Not Found"
      },
      404
    );

  }

};

// =====================================================
// JSON RESPONSE
// =====================================================

function json(
  data,
  status = 200
){

  return new Response(

    JSON.stringify(data),

    {
      status,

      headers:{
        "Content-Type":
        "application/json"
      }
    }

  );

}

// =====================================================
// CLASSES
// =====================================================

async function handleClasses(env){

  const classes = await env.DB.prepare(
    `
    SELECT *
    FROM classes
    ORDER BY class_date ASC
    `
  ).all();

  return json(
    classes.results || []
  );

}

// =====================================================
// USER UPSERT
// =====================================================

async function handleUserUpsert(
  request,
  env
){

  const body =
  await request.json();

  const {
    email,
    name
  } = body;

  if(!email){

    return json(
      {
        error:
        "Email required"
      },
      400
    );

  }

  const existing =

  await env.DB.prepare(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `
  )
  .bind(email)
  .first();

  if(existing){

    await env.DB.prepare(
      `
      UPDATE users
      SET name = ?
      WHERE id = ?
      `
    )
    .bind(
      name,
      existing.id
    )
    .run();

    return json({

      success:true,

      userId:
      existing.id

    });

  }

  const result =

  await env.DB.prepare(
    `
    INSERT INTO users
    (
      email,
      name,
      created_at
    )
    VALUES
    (
      ?,
      ?,
      datetime('now')
    )
    `
  )
  .bind(
    email,
    name
  )
  .run();

  return json({

    success:true,

    userId:
    result.lastRowId

  });

}

// =====================================================
// CLASS SIGNUP
// =====================================================

async function handleClassSignup(
  request,
  env
){

  const body =
  await request.json();

  const {
    classId,
    name,
    email
  } = body;

  if(
    !classId ||
    !email
  ){

    return json(
      {
        error:
        "Missing required fields"
      },
      400
    );

  }

  let user =

  await env.DB.prepare(
    `
    SELECT *
    FROM users
    WHERE email = ?
    `
  )
  .bind(email)
  .first();

  let userId;

  if(!user){

    const created =

    await env.DB.prepare(
      `
      INSERT INTO users
      (
        email,
        name,
        created_at
      )
      VALUES
      (
        ?,
        ?,
        datetime('now')
      )
      `
    )
    .bind(
      email,
      name
    )
    .run();

    userId =
    created.lastRowId;

  } else {

    userId =
    user.id;

  }

  const rewards =

  await env.DB.prepare(
    `
    SELECT *
    FROM rewards
    WHERE user_id = ?
    AND used = 0
    `
  )
  .bind(userId)
  .all();

  const availableRewards =
  rewards.results || [];

  let discount =

  Math.min(
    availableRewards.length * 10,
    20
  );

  for(
    let i = 0;
    i < discount / 10;
    i++
  ){

    await env.DB.prepare(
      `
      UPDATE rewards
      SET used = 1
      WHERE id = ?
      `
    )
    .bind(
      availableRewards[i].id
    )
    .run();

  }

  await env.DB.prepare(
    `
    INSERT INTO class_signups
    (
      user_id,
      class_id,
      discount_used,
      created_at
    )
    VALUES
    (
      ?,
      ?,
      ?,
      datetime('now')
    )
    `
  )
  .bind(
    userId,
    classId,
    discount
  )
  .run();

  return json({

    success:true,

    discountApplied:
    discount,

    message:
    `Reservation successful. ${discount}% discount applied.`

  });

}

// =====================================================
// PAYMENT
// =====================================================

async function handlePayment(
  request,
  env
){

  const body =
  await request.json();

  const {
    email,
    amount,
    classId
  } = body;

  await env.DB.prepare(
    `
    INSERT INTO payments
    (
      email,
      amount,
      class_id,
      status,
      created_at
    )
    VALUES
    (
      ?,
      ?,
      ?,
      'pending',
      datetime('now')
    )
    `
  )
  .bind(
    email,
    amount,
    classId
  )
  .run();

  return json({

    success:true,

    status:"pending"

  });

}

// =====================================================
// LESSON COMPLETE
// =====================================================

async function handleLessonComplete(
  request,
  env
){

  const body =
  await request.json();

  const {
    email,
    lessonId
  } = body;

  const user =

  await env.DB.prepare(
    `
    SELECT id
    FROM users
    WHERE email = ?
    `
  )
  .bind(email)
  .first();

  if(!user){

    return json(
      {
        error:
        "User not found"
      },
      404
    );

  }

  const userId =
  user.id;

  await env.DB.prepare(
    `
    INSERT INTO lesson_progress
    (
      user_id,
      lesson_id,
      completed,
      completed_at
    )
    VALUES
    (
      ?,
      ?,
      1,
      datetime('now')
    )
    `
  )
  .bind(
    userId,
    lessonId
  )
  .run();

  const countRes =

  await env.DB.prepare(
    `
    SELECT COUNT(*) as count
    FROM lesson_progress
    WHERE user_id = ?
    `
  )
  .bind(userId)
  .first();

  const completedCount =
  countRes.count;

  let rewardGranted =
  false;

  if(
    completedCount > 0 &&
    completedCount % 5 === 0
  ){

    rewardGranted =
    true;

    await env.DB.prepare(
      `
      INSERT INTO rewards
      (
        user_id,
        value,
        used,
        created_at
      )
      VALUES
      (
        ?,
        10,
        0,
        datetime('now')
      )
      `
    )
    .bind(userId)
    .run();

  }

  return json({

    success:true,

    completedCount,

    rewardGranted

  });

}

// =====================================================
// DASHBOARD
// =====================================================

async function handleDashboard(
  request,
  env
){

  const {
    email
  } = await request.json();

  const signups =

  await env.DB.prepare(
    `
    SELECT *
    FROM class_signups
    WHERE user_id =
    (
      SELECT id
      FROM users
      WHERE email = ?
    )
    `
  )
  .bind(email)
  .all();

  return json({

    signups:
    signups.results || []

  });

}

// =====================================================
// COURSES
// =====================================================

async function handleCourses(
  request,
  env
){

  const {
    email
  } = await request.json();

  const courses =

  await env.DB.prepare(
    `
    SELECT *
    FROM class_signups
    WHERE user_id =
    (
      SELECT id
      FROM users
      WHERE email = ?
    )
    `
  )
  .bind(email)
  .all();

  return json(

    courses.results || []

  );

}

// =====================================================
// PROGRESS
// =====================================================

async function handleProgress(
  request,
  env
){

  const {
    email
  } = await request.json();

  const progress =

  await env.DB.prepare(
    `
    SELECT COUNT(*) as complete
    FROM lesson_progress
    WHERE user_id =
    (
      SELECT id
      FROM users
      WHERE email = ?
    )
    `
  )
  .bind(email)
  .first();

  return json({

    completed:
    progress.complete || 0

  });

}

// =====================================================
// CERTIFICATES
// =====================================================

async function handleCertificates(
  request,
  env
){

  const {
    email
  } = await request.json();

  const certificates =

  await env.DB.prepare(
    `
    SELECT *
    FROM certificates
    WHERE user_id =
    (
      SELECT id
      FROM users
      WHERE email = ?
    )
    `
  )
  .bind(email)
  .all();

  return json(

    certificates.results || []

  );

}

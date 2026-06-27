// admin.js
// Chainsaw Clay Admin — Tree Service + Climbing Class
// Single front-end controller talking to Cloudflare Worker + D1

const API_BASE = '/api';

// =========================
// UTIL
// =========================

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

function qs(sel) {
  return document.querySelector(sel);
}

function qsa(sel) {
  return Array.from(document.querySelectorAll(sel));
}

// =========================
// AUTH + USERS
// =========================

async function loginAdmin(email, password) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

async function getCurrentUser() {
  return apiRequest('/auth/me', { method: 'GET' });
}

// =========================
// ANALYTICS
// =========================

async function trackView(type, meta = {}) {
  return apiRequest('/analytics/view', {
    method: 'POST',
    body: { type, meta },
  });
}

async function trackVideoPlay(videoId) {
  return apiRequest('/analytics/video-play', {
    method: 'POST',
    body: { videoId },
  });
}

async function trackLogin(userId) {
  return apiRequest('/analytics/login', {
    method: 'POST',
    body: { userId },
  });
}

async function loadAnalyticsSummary() {
  return apiRequest('/analytics/summary', { method: 'GET' });
}

// =========================
// PAYMENTS (Deposits + Full)
// =========================

async function createPaymentIntent(payload) {
  // payload: { studentId/clientId, amount, type: 'deposit'|'full', source: 'class'|'tree-service' }
  return apiRequest('/payments/intent', {
    method: 'POST',
    body: payload,
  });
}

async function listPayments(filter = {}) {
  return apiRequest('/payments/list', {
    method: 'POST',
    body: filter,
  });
}

// =========================
// VIDEO UPLOADS (R2)
// =========================

async function getVideoUploadUrl(meta) {
  // meta: { title, lessonId, category: 'class'|'tree-service' }
  return apiRequest('/videos/upload-url', {
    method: 'POST',
    body: meta,
  });
}

async function listVideos(filter = {}) {
  return apiRequest('/videos/list', {
    method: 'POST',
    body: filter,
  });
}

async function deleteVideo(videoId) {
  return apiRequest('/videos/delete', {
    method: 'POST',
    body: { videoId },
  });
}

async function uploadVideoFile(file, meta) {
  const { uploadUrl, videoId } = await getVideoUploadUrl(meta);

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('Video upload failed');

  return { videoId };
}

// =========================
// LESSONS (Climbing Class)
// =========================

async function createLesson(data) {
  // data: { title, description, level, videoIds: [] }
  return apiRequest('/lessons/create', {
    method: 'POST',
    body: data,
  });
}

async function updateLesson(id, data) {
  return apiRequest('/lessons/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

async function deleteLesson(id) {
  return apiRequest('/lessons/delete', {
    method: 'POST',
    body: { id },
  });
}

async function listLessons(filter = {}) {
  return apiRequest('/lessons/list', {
    method: 'POST',
    body: filter,
  });
}

// =========================
// RESERVATIONS / SCHEDULE
// =========================

async function createReservation(data) {
  // data: { studentId, classId, date, status }
  return apiRequest('/reservations/create', {
    method: 'POST',
    body: data,
  });
}

async function listReservations(filter = {}) {
  return apiRequest('/reservations/list', {
    method: 'POST',
    body: filter,
  });
}

async function updateReservation(id, data) {
  return apiRequest('/reservations/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

// =========================
// TREE SERVICE CLIENTS
// =========================

async function listClients(filter = {}) {
  return apiRequest('/clients/list', {
    method: 'POST',
    body: filter,
  });
}

async function createClient(data) {
  // data: { name, phone, email, address, notes }
  return apiRequest('/clients/create', {
    method: 'POST',
    body: data,
  });
}

async function updateClient(id, data) {
  return apiRequest('/clients/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

// =========================
// STUDENTS (Climbing Class)
// =========================

async function listStudents(filter = {}) {
  return apiRequest('/students/list', {
    method: 'POST',
    body: filter,
  });
}

async function createStudent(data) {
  // data: { name, phone, email, level, notes }
  return apiRequest('/students/create', {
    method: 'POST',
    body: data,
  });
}

async function updateStudent(id, data) {
  return apiRequest('/students/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

// =========================
// CITIES / LOCATIONS
// =========================

async function listCities() {
  return apiRequest('/cities/list', { method: 'GET' });
}

async function addCity(data) {
  // data: { name, state, type: 'tree-service'|'class' }
  return apiRequest('/cities/create', {
    method: 'POST',
    body: data,
  });
}

// =========================
// MESSAGING (Clients + Students)
// =========================

async function sendMessage(data) {
  // data: { toType: 'client'|'student', toId, subject, body }
  return apiRequest('/messages/send', {
    method: 'POST',
    body: data,
  });
}

async function listMessages(filter = {}) {
  return apiRequest('/messages/list', {
    method: 'POST',
    body: filter,
  });
}

// =========================
// UI WIRING
// =========================

async function initAdminDashboard() {
  try {
    const user = await getCurrentUser();
    console.log('Logged in as:', user.email);

    // Track admin login
    if (user.id) await trackLogin(user.id);

    // Load analytics summary
    const analytics = await loadAnalyticsSummary();
    renderAnalytics(analytics);

    // Load students, clients, lessons, reservations
    const [students, clients, lessons, reservations] = await Promise.all([
      listStudents(),
      listClients(),
      listLessons(),
      listReservations(),
    ]);

    renderStudents(students);
    renderClients(clients);
    renderLessons(lessons);
    renderReservations(reservations);

    // Wire forms
    wireEstimateForm();
    wireClassReservationForm();
    wireVideoUploadForm();
    wireMessageForm();
  } catch (err) {
    console.error('Admin init failed:', err);
  }
}

// =========================
// RENDER HELPERS (DOM)
// =========================

function renderAnalytics(data) {
  const el = qs('#admin-analytics');
  if (!el) return;
  el.innerHTML = `
    <div class="card">
      <h3>Website Views</h3>
      <p>${data.websiteViews ?? 0}</p>
    </div>
    <div class="card">
      <h3>App Logins</h3>
      <p>${data.appLogins ?? 0}</p>
    </div>
    <div class="card">
      <h3>Video Plays</h3>
      <p>${data.videoPlays ?? 0}</p>
    </div>
    <div class="card">
      <h3>Class Signups</h3>
      <p>${data.classSignups ?? 0}</p>
    </div>
    <div class="card">
      <h3>Estimate Requests</h3>
      <p>${data.estimateRequests ?? 0}</p>
    </div>
  `;
}

function renderStudents(students) {
  const el = qs('#admin-students');
  if (!el) return;
  el.innerHTML = students
    .map(
      (s) => `
    <div class="row">
      <span>${s.name}</span>
      <span>${s.level}</span>
      <span>${s.email}</span>
    </div>`
    )
    .join('');
}

function renderClients(clients) {
  const el = qs('#admin-clients');
  if (!el) return;
  el.innerHTML = clients
    .map(
      (c) => `
    <div class="row">
      <span>${c.name}</span>
      <span>${c.phone}</span>
      <span>${c.address}</span>
    </div>`
    )
    .join('');
}

function renderLessons(lessons) {
  const el = qs('#admin-lessons');
  if (!el) return;
  el.innerHTML = lessons
    .map(
      (l) => `
    <div class="row">
      <span>${l.title}</span>
      <span>${l.level}</span>
      <span>${(l.videoCount ?? 0)} videos</span>
    </div>`
    )
    .join('');
}

function renderReservations(reservations) {
  const el = qs('#admin-reservations');
  if (!el) return;
  el.innerHTML = reservations
    .map(
      (r) => `
    <div class="row">
      <span>${r.studentName}</span>
      <span>${r.classTitle}</span>
      <span>${r.date}</span>
      <span>${r.status}</span>
    </div>`
    )
    .join('');
}

// =========================
// FORM WIRING
// =========================

function wireEstimateForm() {
  const form = qs('#estimate-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      await apiRequest('/clients/estimate', {
        method: 'POST',
        body: payload,
      });
      alert('Estimate request sent.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Error sending estimate.');
    }
  });
}

function wireClassReservationForm() {
  const form = qs('#class-reservation-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      await createReservation(payload);
      alert('Reservation created.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Error creating reservation.');
    }
  });
}

function wireVideoUploadForm() {
  const form = qs('#video-upload-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = qs('#video-file');
    const file = fileInput?.files?.[0];
    if (!file) {
      alert('Select a video file.');
      return;
    }

    const fd = new FormData(form);
    const meta = {
      title: fd.get('title'),
      lessonId: fd.get('lessonId'),
      category: fd.get('category'),
    };

    try {
      await uploadVideoFile(file, meta);
      alert('Video uploaded.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Error uploading video.');
    }
  });
}

function wireMessageForm() {
  const form = qs('#message-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = Object.fromEntries(fd.entries());

    try {
      await sendMessage(payload);
      alert('Message sent.');
      form.reset();
    } catch (err) {
      console.error(err);
      alert('Error sending message.');
    }
  });
}

// =========================
// INIT
// =========================

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
});

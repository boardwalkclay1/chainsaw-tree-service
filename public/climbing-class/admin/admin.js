// admin.js
// Chainsaw Clay Admin — Unified Admin Controller
// Talks directly to ONE Worker (public + admin routes)

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

const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

// =========================
// AUTH
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
// ADMIN DASHBOARD
// =========================

async function loadAdminDashboard() {
  return apiRequest('/admin/dashboard', { method: 'GET' });
}

// =========================
// ANALYTICS
// =========================

async function loadAnalyticsSummary() {
  return apiRequest('/admin/analytics/summary', { method: 'GET' });
}

// =========================
// PAYMENTS
// =========================

async function listPayments() {
  return apiRequest('/admin/payments/list', { method: 'GET' });
}

async function loadPaymentsSummary() {
  return apiRequest('/admin/payments/summary', { method: 'GET' });
}

// =========================
// VIDEO UPLOADS (R2)
// =========================

async function getVideoUploadUrl(meta) {
  return apiRequest('/admin/videos/upload-url', {
    method: 'POST',
    body: meta,
  });
}

async function uploadVideoFile(file, meta) {
  const { uploadUrl, videoId } = await getVideoUploadUrl(meta);

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    body: file,
  });

  if (!res.ok) throw new Error('Video upload failed');

  return { videoId };
}

async function listVideos() {
  return apiRequest('/admin/videos/list', { method: 'GET' });
}

async function deleteVideo(videoId) {
  return apiRequest('/admin/videos/delete', {
    method: 'POST',
    body: { videoId },
  });
}

// =========================
// LESSONS
// =========================

async function listLessons() {
  return apiRequest('/admin/lessons/list', { method: 'GET' });
}

async function createLesson(data) {
  return apiRequest('/admin/lessons/create', {
    method: 'POST',
    body: data,
  });
}

async function updateLesson(id, data) {
  return apiRequest('/admin/lessons/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

async function deleteLesson(id) {
  return apiRequest('/admin/lessons/delete', {
    method: 'POST',
    body: { id },
  });
}

// =========================
// RESERVATIONS
// =========================

async function listReservations() {
  return apiRequest('/admin/reservations/list', { method: 'GET' });
}

async function createReservation(data) {
  return apiRequest('/admin/reservations/create', {
    method: 'POST',
    body: data,
  });
}

async function updateReservation(id, data) {
  return apiRequest('/admin/reservations/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

// =========================
// CLIENTS
// =========================

async function listClients() {
  return apiRequest('/admin/clients/list', { method: 'GET' });
}

async function createClient(data) {
  return apiRequest('/admin/clients/create', {
    method: 'POST',
    body: data,
  });
}

async function updateClient(id, data) {
  return apiRequest('/admin/clients/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

async function sendEstimate(data) {
  return apiRequest('/admin/clients/estimate', {
    method: 'POST',
    body: data,
  });
}

// =========================
// STUDENTS
// =========================

async function listStudents() {
  return apiRequest('/admin/students/list', { method: 'GET' });
}

async function createStudent(data) {
  return apiRequest('/admin/students/create', {
    method: 'POST',
    body: data,
  });
}

async function updateStudent(id, data) {
  return apiRequest('/admin/students/update', {
    method: 'POST',
    body: { id, ...data },
  });
}

// =========================
// CITIES
// =========================

async function listCities() {
  return apiRequest('/admin/cities/list', { method: 'GET' });
}

async function addCity(data) {
  return apiRequest('/admin/cities/create', {
    method: 'POST',
    body: data,
  });
}

// =========================
// MESSAGES
// =========================

async function sendMessage(data) {
  return apiRequest('/admin/messages/send', {
    method: 'POST',
    body: data,
  });
}

async function listMessages() {
  return apiRequest('/admin/messages/list', { method: 'GET' });
}

// =========================
// UI INITIALIZATION
// =========================

async function initAdminDashboard() {
  try {
    const user = await getCurrentUser();
    console.log('Admin logged in:', user.email);

    const dashboard = await loadAdminDashboard();

    renderAnalytics(dashboard.analytics);
    renderStudents(dashboard.students);
    renderClients(dashboard.clients);
    renderLessons(dashboard.lessons);
    renderReservations(dashboard.reservations);

    wireForms();
  } catch (err) {
    console.error('Admin init failed:', err);
  }
}

// =========================
// RENDER HELPERS
// =========================

function renderAnalytics(data) {
  const el = qs('#admin-analytics');
  if (!el) return;

  el.innerHTML = `
    <div class="card"><h3>Views</h3><p>${data.view ?? 0}</p></div>
    <div class="card"><h3>Logins</h3><p>${data.login ?? 0}</p></div>
    <div class="card"><h3>Video Plays</h3><p>${data['video-play'] ?? 0}</p></div>
  `;
}

function renderStudents(students) {
  const el = qs('#admin-students');
  if (!el) return;

  el.innerHTML = students
    .map(s => `
      <div class="row">
        <span>${s.name}</span>
        <span>${s.level}</span>
        <span>${s.email}</span>
      </div>
    `)
    .join('');
}

function renderClients(clients) {
  const el = qs('#admin-clients');
  if (!el) return;

  el.innerHTML = clients
    .map(c => `
      <div class="row">
        <span>${c.name}</span>
        <span>${c.phone}</span>
        <span>${c.address}</span>
      </div>
    `)
    .join('');
}

function renderLessons(lessons) {
  const el = qs('#admin-lessons');
  if (!el) return;

  el.innerHTML = lessons
    .map(l => `
      <div class="row">
        <span>${l.title}</span>
        <span>${l.level}</span>
      </div>
    `)
    .join('');
}

function renderReservations(reservations) {
  const el = qs('#admin-reservations');
  if (!el) return;

  el.innerHTML = reservations
    .map(r => `
      <div class="row">
        <span>${r.studentId}</span>
        <span>${r.classId}</span>
        <span>${r.date}</span>
        <span>${r.status}</span>
      </div>
    `)
    .join('');
}

// =========================
// FORM WIRING
// =========================

function wireForms() {
  wireEstimateForm();
  wireReservationForm();
  wireVideoUploadForm();
  wireMessageForm();
}

function wireEstimateForm() {
  const form = qs('#estimate-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await sendEstimate(payload);
      alert('Estimate sent.');
      form.reset();
    } catch (err) {
      alert('Error sending estimate.');
    }
  });
}

function wireReservationForm() {
  const form = qs('#class-reservation-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await createReservation(payload);
      alert('Reservation created.');
      form.reset();
    } catch (err) {
      alert('Error creating reservation.');
    }
  });
}

function wireVideoUploadForm() {
  const form = qs('#video-upload-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = qs('#video-file').files[0];
    if (!file) return alert('Select a video.');

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
      alert('Error uploading video.');
    }
  });
}

function wireMessageForm() {
  const form = qs('#message-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      await sendMessage(payload);
      alert('Message sent.');
      form.reset();
    } catch (err) {
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

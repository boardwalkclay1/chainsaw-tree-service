// ============================================================
// REAL TREE GUY — ADMIN CONTRACTS (STATIC FINAL VERSION)
// ============================================================

// This is the ONLY import you need.
import CONTRACT_INDEX from "./modules/contract-index.js";

// ============================================================
// STATE
// ============================================================

const CONTRACTS_STATE = {
  list: [],
  active: null
};

// ============================================================
// STORAGE
// ============================================================

const STORAGE_KEY = "rtgContracts";

function loadContracts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    CONTRACTS_STATE.list = raw ? JSON.parse(raw) : [];
  } catch {
    CONTRACTS_STATE.list = [];
  }
}

function saveContracts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(CONTRACTS_STATE.list));
}

// ============================================================
// INIT
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "admin-contracts") {
    loadContracts();
    renderContractsList();
    setupLivePreviewListeners();
  }
});

// ============================================================
// MODULE SELECTOR
// ============================================================

function getModule(type) {
  return CONTRACT_INDEX.CONTRACT_CATEGORY_MAP[type].module;
}

// ============================================================
// CREATE NEW DOCUMENT
// ============================================================

window.newAdminContract = function (type = "contract") {
  const module = getModule(type);
  const now = new Date().toLocaleString();

  const doc = {
    id: `doc_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type,
    ...JSON.parse(JSON.stringify(module.fields)),
    createdAt: now,
    status: "Draft"
  };

  CONTRACTS_STATE.list.push(doc);
  CONTRACTS_STATE.active = doc;

  saveContracts();
  renderContractsList();
  renderActiveContract(doc);
  renderPreview(doc);
};

// ============================================================
// OPEN DOCUMENT
// ============================================================

window.openAdminContract = function (id) {
  const doc = CONTRACTS_STATE.list.find(d => d.id === id);
  if (!doc) return alert("Document not found.");

  CONTRACTS_STATE.active = doc;

  renderActiveContract(doc);
  renderPreview(doc);
};

// ============================================================
// RENDER LIST
// ============================================================

function renderContractsList() {
  const listEl = document.getElementById("adminContractsList");
  if (!listEl) return;

  listEl.innerHTML = "";

  if (!CONTRACTS_STATE.list.length) {
    listEl.innerHTML = "<p>No documents yet.</p>";
    return;
  }

  CONTRACTS_STATE.list.forEach(doc => {
    const div = document.createElement("div");
    div.className = "admin-contract-card";

    const total =
      doc.totalPrice ||
      doc.grandTotal ||
      doc.deposit ||
      0;

    div.innerHTML = `
      <h3>${doc.type.toUpperCase()} — ${doc.clientName || "Unknown Client"}</h3>
      <p><strong>Job:</strong> ${doc.jobAddress || "N/A"}</p>
      <p><strong>Total:</strong> $${total}</p>
      <p><strong>Status:</strong> ${doc.status}</p>
      <p><strong>Created:</strong> ${doc.createdAt}</p>
      <button class="rtg-btn rtg-btn--primary" data-open="${doc.id}">Open</button>
    `;

    listEl.appendChild(div);
  });

  listEl.querySelectorAll("[data-open]").forEach(btn => {
    btn.onclick = () => openAdminContract(btn.dataset.open);
  });
}

// ============================================================
// RENDER ACTIVE DOCUMENT INTO FORM
// ============================================================

function renderActiveContract(doc) {
  for (const key in doc) {
    const el = document.getElementById(key);
    if (el) el.value = doc[key];
  }
}

// ============================================================
// UPDATE DOCUMENT FROM FORM
// ============================================================

function updateDocumentFromForm() {
  const doc = CONTRACTS_STATE.active;
  if (!doc) return;

  for (const key in doc) {
    const el = document.getElementById(key);
    if (el) doc[key] = el.value;
  }

  saveContracts();
}

// ============================================================
// LIVE PREVIEW
// ============================================================

function renderPreview(doc) {
  const previewEl = document.getElementById("contractPreview");
  if (!previewEl) return;

  const module = getModule(doc.type);
  previewEl.innerHTML = module.templatePreview(doc);
}

function setupLivePreviewListeners() {
  document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => {
      updateDocumentFromForm();
      renderPreview(CONTRACTS_STATE.active);
    });
  });
}

// ============================================================
// SAVE DOCUMENT
// ============================================================

window.saveAdminContract = function () {
  updateDocumentFromForm();
  saveContracts();
  renderContractsList();
  renderPreview(CONTRACTS_STATE.active);
  alert("Document saved.");
};

// ============================================================
// SIGNATURES
// ============================================================

window.adminSignContract = function () {
  const doc = CONTRACTS_STATE.active;
  if (!doc) return;

  doc.adminSignedAt = new Date().toLocaleString();
  doc.status = "Admin Signed";

  saveContracts();
  renderActiveContract(doc);
  renderPreview(doc);
};

window.clientSignContract = function () {
  const doc = CONTRACTS_STATE.active;
  if (!doc) return;

  doc.clientSignedAt = new Date().toLocaleString();
  doc.status = "Client Signed";

  saveContracts();
  renderActiveContract(doc);
  renderPreview(doc);
};

// ============================================================
// SEND TO CLIENT (STATIC MAILTO)
// ============================================================

window.sendContractToClient = function () {
  const doc = CONTRACTS_STATE.active;
  if (!doc) return alert("No active document.");

  if (!doc.clientEmail) return alert("Client email required.");

  const subject = encodeURIComponent(`${doc.type.toUpperCase()} from Chainsaw Clay`);
  const body = encodeURIComponent(`Hello ${doc.clientName},\n\nHere is your ${doc.type}.\n\nThank you,\nChainsaw Clay`);

  window.location.href = `mailto:${doc.clientEmail}?subject=${subject}&body=${body}`;
};

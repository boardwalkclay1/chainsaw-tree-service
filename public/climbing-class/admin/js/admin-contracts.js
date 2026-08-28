// ============================================================
// REAL TREE GUY — ADMIN CONTRACTS CORE (FULLY REBUILT)
// ============================================================

// API BASE
const ADMIN_API = "https://api.realtreeguy.com/admin/contracts";

// ============================================================
// AUTH / CONTEXT
// ============================================================

const ADMIN_USER_ID = localStorage.getItem("rtgAdminId") || "admin-dev";

const BUSINESS_INFO = {
  name: "Chainsaw Clay’s Tree Service LLC",
  phone: "(470) 469-2358",
  email: "support@chainsawclay.com",
  address: "Sylacauga, AL",
  license: "Tree Service License #CLAY-001",
  insurance: "Fully insured for residential and commercial tree work."
};

// ============================================================
// API WRAPPER (UPGRADED)
// ============================================================

async function contractsApi(path, method = "GET", body = null) {
  const url = `${ADMIN_API}${path}`;

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-RTG-Admin": ADMIN_USER_ID
      },
      body: body ? JSON.stringify(body) : null
    });
  } catch (err) {
    console.error("NETWORK ERROR:", err);
    return { ok: false, error: "network" };
  }

  // Handle CORS block
  if (!res.ok && res.status === 0) {
    return {
      ok: false,
      error: "cors_blocked",
      message: "CORS blocked: server must allow X-RTG-Admin header."
    };
  }

  try {
    return await res.json();
  } catch {
    return { ok: false, error: "invalid_json" };
  }
}

// ============================================================
// DOCUMENT TYPES
// ============================================================

const CONTRACT_TYPES = ["estimate", "proposal", "contract", "receipt"];

// ============================================================
// TEMPLATE GENERATOR (UPGRADED)
// ============================================================

function createEmptyDocument(type = "contract") {
  const now = Date.now();

  return {
    id: null,
    type,
    admin_id: ADMIN_USER_ID,

    // Client info
    client_id: null,
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",

    // Job info
    job_id: null,
    job_address: "",
    scope_of_work: "",
    work_plan: "",
    special_clauses: "",

    // Money
    total_price: 0,
    deposit_required: 0,
    payment_schedule: "",
    notes: "",

    // Dates
    created_at: now,
    client_signed_at: null,
    admin_signed_at: null,

    // Status
    status: "draft",

    // Business snapshot
    business: { ...BUSINESS_INFO }
  };
}

// ============================================================
// STATE
// ============================================================

const CONTRACTS_STATE = {
  list: [],
  active: null
};

// ============================================================
// INIT PAGE
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.page === "admin-contracts") {
    initAdminContracts();
  }
});

async function initAdminContracts() {
  await loadContractsList();
}

// ============================================================
// LOAD LIST
// ============================================================

async function loadContractsList() {
  const data = await contractsApi("/list");

  if (!data.ok || !Array.isArray(data.documents)) {
    CONTRACTS_STATE.list = [];
    renderContractsList([]);
    return;
  }

  CONTRACTS_STATE.list = data.documents;
  renderContractsList(CONTRACTS_STATE.list);
}

// ============================================================
// RENDER LIST
// ============================================================

function renderContractsList(documents) {
  const listEl = document.getElementById("adminContractsList");
  if (!listEl) return;

  if (!documents.length) {
    listEl.innerHTML = "<p>No documents yet.</p>";
    return;
  }

  listEl.innerHTML = "";

  documents.forEach(doc => {
    const div = document.createElement("div");
    div.className = "admin-contract-card";

    div.innerHTML = `
      <h3>${doc.type.toUpperCase()} — ${doc.client_name || "Unknown Client"}</h3>
      <p><strong>Job:</strong> ${doc.job_address || "N/A"}</p>
      <p><strong>Total:</strong> $${doc.total_price || 0}</p>
      <p><strong>Status:</strong> ${doc.status}</p>
      <p><strong>Created:</strong> ${doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "N/A"}</p>
      <button class="rtg-btn rtg-btn--primary" data-open="${doc.id}">Open</button>
    `;

    listEl.appendChild(div);
  });

  // Attach open handlers
  listEl.querySelectorAll("[data-open]").forEach(btn => {
    btn.addEventListener("click", () => openAdminContract(btn.dataset.open));
  });
}

// ============================================================
// OPEN DOCUMENT
// ============================================================

async function openAdminContract(id) {
  const data = await contractsApi(`/document/${id}`);

  if (!data.ok || !data.document) {
    alert("Failed to load document.");
    return;
  }

  CONTRACTS_STATE.active = data.document;
  renderActiveContract(CONTRACTS_STATE.active);
}

// ============================================================
// NEW DOCUMENT
// ============================================================

function newAdminContract(type = "contract") {
  if (!CONTRACT_TYPES.includes(type)) type = "contract";
  CONTRACTS_STATE.active = createEmptyDocument(type);
  renderActiveContract(CONTRACTS_STATE.active);
}

// ============================================================
// RENDER ACTIVE DOCUMENT
// ============================================================

function renderActiveContract(doc) {
  setValue("contractType", doc.type);

  setValue("contractClientName", doc.client_name);
  setValue("contractClientEmail", doc.client_email);
  setValue("contractClientPhone", doc.client_phone);
  setValue("contractClientAddress", doc.client_address);

  setValue("contractJobAddress", doc.job_address);
  setValue("contractScope", doc.scope_of_work);
  setValue("contractWorkPlan", doc.work_plan);
  setValue("contractSpecialClauses", doc.special_clauses);

  setValue("contractTotalPrice", doc.total_price);
  setValue("contractDeposit", doc.deposit_required);
  setValue("contractPaymentSchedule", doc.payment_schedule);
  setValue("contractNotes", doc.notes);

  setText("contractCreatedAt", doc.created_at ? new Date(doc.created_at).toLocaleString() : "N/A");
  setText("contractClientSignedAt", doc.client_signed_at ? new Date(doc.client_signed_at).toLocaleString() : "Not signed");
  setText("contractAdminSignedAt", doc.admin_signed_at ? new Date(doc.admin_signed_at).toLocaleString() : "Not signed");
  setText("contractStatus", doc.status);
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? "";
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
}

// ============================================================
// COLLECT FORM BACK INTO STATE
// ============================================================

function collectActiveContractFromForm() {
  if (!CONTRACTS_STATE.active) return null;

  const doc = CONTRACTS_STATE.active;

  doc.type = getValue("contractType") || doc.type;

  doc.client_name = getValue("contractClientName");
  doc.client_email = getValue("contractClientEmail");
  doc.client_phone = getValue("contractClientPhone");
  doc.client_address = getValue("contractClientAddress");

  doc.job_address = getValue("contractJobAddress");
  doc.scope_of_work = getValue("contractScope");
  doc.work_plan = getValue("contractWorkPlan");
  doc.special_clauses = getValue("contractSpecialClauses");

  doc.total_price = Number(getValue("contractTotalPrice") || 0);
  doc.deposit_required = Number(getValue("contractDeposit") || 0);
  doc.payment_schedule = getValue("contractPaymentSchedule");
  doc.notes = getValue("contractNotes");

  return doc;
}

function getValue(id) {
  const el = document.getElementById(id);
  return el ? el.value : "";
}

// ============================================================
// SAVE DOCUMENT
// ============================================================

async function saveAdminContract() {
  const doc = collectActiveContractFromForm();
  if (!doc) return;

  const path = doc.id ? `/update/${doc.id}` : "/create";
  const res = await contractsApi(path, "POST", doc);

  if (!res.ok) {
    alert("Failed to save document.");
    return;
  }

  doc.id = res.id || doc.id;
  doc.status = res.status || doc.status;

  alert("Document saved.");
  await loadContractsList();
}

// ============================================================
// ADMIN SIGN DOCUMENT
// ============================================================

async function adminSignContract() {
  const doc = CONTRACTS_STATE.active;
  if (!doc || !doc.id) return;

  const res = await contractsApi(`/admin-sign/${doc.id}`, "POST", {
    admin_id: ADMIN_USER_ID,
    signed_at: Date.now()
  });

  if (!res.ok) {
    alert("Failed to sign document.");
    return;
  }

  doc.admin_signed_at = res.admin_signed_at;
  doc.status = res.status || "admin_signed";

  renderActiveContract(doc);
  alert("You have signed this document.");
  await loadContractsList();
}

// ============================================================
// SEND TO CLIENT
// ============================================================

async function sendContractToClient() {
  const doc = collectActiveContractFromForm();
  if (!doc || !doc.id) {
    alert("Save the document before sending.");
    return;
  }

  const res = await contractsApi(`/send/${doc.id}`, "POST", {
    client_email: doc.client_email,
    client_name: doc.client_name
  });

  if (!res.ok) {
    alert("Failed to send document.");
    return;
  }

  doc.status = res.status || "sent";

  renderActiveContract(doc);
  alert("Document sent to client.");
  await loadContractsList();
}

// ============================================================
// EXPOSE FUNCTIONS
// ============================================================

window.newAdminContract = newAdminContract;
window.openAdminContract = openAdminContract;
window.saveAdminContract = saveAdminContract;
window.adminSignContract = adminSignContract;
window.sendContractToClient = sendContractToClient;

export const CONTRACTS_MODULE = {
  type: "contract",
  title: "Tree Service Contract",

  // ============================================================
  // FULL DATA MODEL (STATIC, LOCAL, COMPLETE)
  // ============================================================
  fields: {
    // ------------------------------------------------------------
    // CLIENT INFORMATION
    // ------------------------------------------------------------
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",

    // ------------------------------------------------------------
    // JOB INFORMATION
    // ------------------------------------------------------------
    jobAddress: "",
    jobCity: "",
    jobState: "",
    jobZip: "",
    propertyNotes: "",

    // ------------------------------------------------------------
    // TREE DETAILS
    // ------------------------------------------------------------
    trees: [],

    // ------------------------------------------------------------
    // SCOPE + WORK PLAN
    // ------------------------------------------------------------
    scope: "",
    workPlan: "",
    timeframe: "",
    specialClauses: "",
    exclusions: "",
    cleanupDetails: "",
    equipmentNotes: "",
    assumptions: "",

    // ------------------------------------------------------------
    // MONEY
    // ------------------------------------------------------------
    totalPrice: 0,
    deposit: 0,
    depositDueDate: "",
    paymentSchedule: "",
    lateFeePolicy: "",
    refundPolicy: "",
    changeOrderPolicy: "",

    // ------------------------------------------------------------
    // RISK / LIABILITY
    // ------------------------------------------------------------
    liabilityWaiver: "",
    propertyDamageClause: "",
    utilityLinesClause: "",
    weatherDelayClause: "",
    accessRequirements: "",
    preDepositWorkClause: "",

    // ------------------------------------------------------------
    // SIGNATURES + META
    // ------------------------------------------------------------
    createdAt: "",
    clientSignedAt: "",
    adminSignedAt: "",
    status: "Draft",
    internalNotes: "",

    // ------------------------------------------------------------
    // BUSINESS INFO (STATIC SNAPSHOT)
    // ------------------------------------------------------------
    business: {
      name: "Chainsaw Clay’s Tree Service LLC",
      phone: "(470) 469‑2358",
      email: "support@chainsawclay.com",
      address: "Sylacauga, AL",
      license: "Tree Service License #CLAY‑001",
      insurance: "Fully insured for residential and commercial tree work."
    }
  },

  // ============================================================
  // CONTRACT PREVIEW (STATIC, EPIC, FULLY FORMATTED)
  // ============================================================
  templatePreview(contract) {

    const treesHtml = (contract.trees || [])
      .map(tree => `
        <div class="tree-item">
          <h4>${tree.species || "Tree"} — ${tree.serviceType || "Service"}</h4>
          <p><strong>Location:</strong> ${tree.location || "Not specified"}</p>
          <p><strong>Details:</strong> ${tree.details || "No details provided"}</p>
          <p><strong>Price:</strong> $${tree.price || 0}</p>
        </div>
      `)
      .join("");

    return `
      <h2>${contract.title || "Tree Service Contract"}</h2>

      <!-- CLIENT -->
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${contract.clientName}</p>
      <p><strong>Phone:</strong> ${contract.clientPhone}</p>
      <p><strong>Email:</strong> ${contract.clientEmail}</p>
      <p><strong>Address:</strong> ${contract.clientAddress}</p>

      <!-- JOB -->
      <h3>Job Location</h3>
      <p>${contract.jobAddress}, ${contract.jobCity}, ${contract.jobState} ${contract.jobZip}</p>
      <p><strong>Property Notes:</strong> ${contract.propertyNotes || "None"}</p>

      <!-- TREES -->
      <h3>Tree Details & Services</h3>
      ${treesHtml || "<p>No trees added.</p>"}

      <!-- SCOPE -->
      <h3>Scope of Work</h3>
      <p>${contract.scope || "Not specified."}</p>

      <!-- WORK PLAN -->
      <h3>Work Plan</h3>
      <p>${contract.workPlan || "Not specified."}</p>

      <!-- TIMEFRAME -->
      <h3>Timeframe</h3>
      <p>${contract.timeframe || "Not specified."}</p>

      <!-- SPECIAL CLAUSES -->
      <h3>Special Clauses</h3>
      <p>${contract.specialClauses || "None."}</p>

      <!-- PRE-DEPOSIT -->
      <h3>Pre‑Deposit Work Clause</h3>
      <p>${contract.preDepositWorkClause || "None."}</p>

      <!-- EXCLUSIONS -->
      <h3>Exclusions</h3>
      <p>${contract.exclusions || "None."}</p>

      <!-- CLEANUP -->
      <h3>Cleanup Details</h3>
      <p>${contract.cleanupDetails || "Standard cleanup included."}</p>

      <!-- EQUIPMENT -->
      <h3>Equipment Notes</h3>
      <p>${contract.equipmentNotes || "None."}</p>

      <!-- ASSUMPTIONS -->
      <h3>Assumptions</h3>
      <p>${contract.assumptions || "None."}</p>

      <!-- MONEY -->
      <h3>Pricing & Payments</h3>
      <p><strong>Total Price:</strong> $${contract.totalPrice}</p>
      <p><strong>Deposit:</strong> $${contract.deposit} ${contract.depositDueDate ? `(Due: ${contract.depositDueDate})` : ""}</p>
      <p><strong>Payment Schedule:</strong> ${contract.paymentSchedule || "Not specified."}</p>
      <p><strong>Late Fees:</strong> ${contract.lateFeePolicy || "None."}</p>
      <p><strong>Refund Policy:</strong> ${contract.refundPolicy || "None."}</p>
      <p><strong>Change Orders:</strong> ${contract.changeOrderPolicy || "None."}</p>

      <!-- LIABILITY -->
      <h3>Liability & Risk</h3>
      <p>${contract.liabilityWaiver || "No liability waiver provided."}</p>
      <p><strong>Property Damage:</strong> ${contract.propertyDamageClause || "None."}</p>
      <p><strong>Utility Lines:</strong> ${contract.utilityLinesClause || "None."}</p>
      <p><strong>Weather Delays:</strong> ${contract.weatherDelayClause || "None."}</p>
      <p><strong>Access Requirements:</strong> ${contract.accessRequirements || "None."}</p>

      <!-- STATUS -->
      <h3>Status</h3>
      <p><strong>Status:</strong> ${contract.status}</p>
      <p><strong>Created:</strong> ${contract.createdAt || "N/A"}</p>
      <p><strong>Client Signed:</strong> ${contract.clientSignedAt || "Not signed"}</p>
      <p><strong>Admin Signed:</strong> ${contract.adminSignedAt || "Not signed"}</p>

      <!-- BUSINESS INFO -->
      <h3>Prepared By</h3>
      <p><strong>${contract.business.name}</strong></p>
      <p>Phone: ${contract.business.phone}</p>
      <p>Email: ${contract.business.email}</p>
      <p>Address: ${contract.business.address}</p>
      <p>License: ${contract.business.license}</p>
      <p>${contract.business.insurance}</p>
    `;
  }
};

export const CONTRACTS_MODULE = {
  type: "contract",
  title: "Tree Service Contract",

  // ============================================================
  // FULL DATA MODEL
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
    // TREE DETAILS (inherited from estimate)
    // ------------------------------------------------------------
    trees: [
      // {
      //   id: crypto.randomUUID(),
      //   species: "Oak",
      //   location: "Front yard near driveway",
      //   serviceType: "Full Removal",
      //   details: "Remove dead limbs, reduce weight over roof",
      //   price: 0
      // }
    ],

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
    preDepositWorkClause: "", // your “cut before deposit” rule

    // ------------------------------------------------------------
    // SIGNATURES + META
    // ------------------------------------------------------------
    createdAt: "",
    clientSignedAt: "",
    adminSignedAt: "",
    status: "Draft",
    internalNotes: ""
  },

  // ============================================================
  // PROFESSIONAL CONTRACT PREVIEW (FULLY FORMATTED)
  // ============================================================
  templatePreview(contract) {

    // ------------------------------------------------------------
    // TREE LIST HTML
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // FINAL PREVIEW OUTPUT
    // ------------------------------------------------------------
    return `
      <h2>Tree Service Contract</h2>

      <!-- CLIENT & JOB -->
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${contract.clientName}</p>
      <p><strong>Phone:</strong> ${contract.clientPhone}</p>
      <p><strong>Email:</strong> ${contract.clientEmail}</p>
      <p><strong>Address:</strong> ${contract.clientAddress}</p>

      <h3>Job Location</h3>
      <p>${contract.jobAddress}, ${contract.jobCity}, ${contract.jobState} ${contract.jobZip}</p>
      <p><strong>Property Notes:</strong> ${contract.propertyNotes || "None"}</p>

      <!-- TREE DETAILS -->
      <h3>Tree Details & Services</h3>
      ${treesHtml || "<p>No trees added yet.</p>"}

      <!-- SCOPE -->
      <h3>Scope of Work</h3>
      <p>${contract.scope || "Scope of work not yet defined."}</p>

      <!-- WORK PLAN -->
      <h3>Work Plan</h3>
      <p>${contract.workPlan || "Work plan not yet defined."}</p>

      <!-- TIMEFRAME -->
      <h3>Timeframe</h3>
      <p>${contract.timeframe || "Not specified."}</p>

      <!-- SPECIAL CLAUSES -->
      <h3>Special Clauses</h3>
      <p>${contract.specialClauses || "No special clauses added."}</p>

      <!-- PRE-DEPOSIT WORK -->
      <h3>Pre‑Deposit Work Clause</h3>
      <p>${contract.preDepositWorkClause || "No pre‑deposit clause added."}</p>

      <!-- EXCLUSIONS + CLEANUP -->
      <h3>Exclusions & Cleanup</h3>
      <p><strong>Exclusions:</strong> ${contract.exclusions || "None listed."}</p>
      <p><strong>Cleanup:</strong> ${contract.cleanupDetails || "Standard cleanup included."}</p>

      <!-- EQUIPMENT -->
      <h3>Equipment Notes</h3>
      <p>${contract.equipmentNotes || "No equipment notes provided."}</p>

      <!-- ASSUMPTIONS -->
      <h3>Assumptions</h3>
      <p>${contract.assumptions || "None listed."}</p>

      <!-- MONEY -->
      <h3>Pricing & Payments</h3>
      <p><strong>Total Price:</strong> $${contract.totalPrice || 0}</p>
      <p><strong>Deposit:</strong> $${contract.deposit || 0} ${contract.depositDueDate ? `(Due: ${contract.depositDueDate})` : ""}</p>
      <p><strong>Payment Schedule:</strong> ${contract.paymentSchedule || "Not specified."}</p>
      <p><strong>Late Fees:</strong> ${contract.lateFeePolicy || "Not specified."}</p>
      <p><strong>Refunds:</strong> ${contract.refundPolicy || "Not specified."}</p>
      <p><strong>Change Orders:</strong> ${contract.changeOrderPolicy || "Not specified."}</p>

      <!-- LIABILITY -->
      <h3>Liability & Risk</h3>
      <p>${contract.liabilityWaiver || "Liability waiver not yet defined."}</p>
      <p><strong>Property Damage:</strong> ${contract.propertyDamageClause || "Not specified."}</p>
      <p><strong>Utility Lines:</strong> ${contract.utilityLinesClause || "Not specified."}</p>
      <p><strong>Weather Delays:</strong> ${contract.weatherDelayClause || "Not specified."}</p>
      <p><strong>Access Requirements:</strong> ${contract.accessRequirements || "Not specified."}</p>

      <!-- STATUS -->
      <h3>Status</h3>
      <p><strong>Status:</strong> ${contract.status}</p>
      <p><strong>Created:</strong> ${contract.createdAt || "N/A"}</p>
      <p><strong>Client Signed:</strong> ${contract.clientSignedAt || "Not signed"}</p>
      <p><strong>Admin Signed:</strong> ${contract.adminSignedAt || "Not signed"}</p>

      <!-- BUSINESS INFO -->
      <h3>Prepared By</h3>
      <p><strong>Chainsaw Clay’s Tree Service LLC</strong></p>
      <p>Phone: (470) 469‑2358</p>
      <p>Email: support@chainsawclay.com</p>
      <p>Address: Sylacauga, AL</p>
      <p>Fully insured for residential and commercial tree work.</p>
    `;
  }
};

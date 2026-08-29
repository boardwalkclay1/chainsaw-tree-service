export const PROPOSALS_MODULE = {
  type: "proposal",
  title: "Tree Service Proposal",

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
    // TREE DETAILS (same structure as estimates + contracts)
    // ------------------------------------------------------------
    trees: [
      // {
      //   id: crypto.randomUUID(),
      //   species: "Oak",
      //   location: "Front yard near driveway",
      //   serviceType: "Pruning | Full Removal | Debris Removal | Stump Grinding",
      //   details: "Reduce weight over roof, remove dead limbs",
      //   price: 0
      // }
    ],

    // ------------------------------------------------------------
    // SCOPE + WORK PLAN + PHASES
    // ------------------------------------------------------------
    scope: "",
    workPlan: "",
    phases: [
      // { title, description }
    ],
    timeline: "",
    crewSize: "",
    equipmentList: "",
    cleanupDetails: "",
    assumptions: "",
    exclusions: "",
    riskNotes: "",

    // ------------------------------------------------------------
    // MONEY
    // ------------------------------------------------------------
    totalPrice: 0,
    deposit: 0,
    paymentSchedule: "",
    options: [
      // { label, price, description }
    ],

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
  // PROFESSIONAL PROPOSAL PREVIEW (FULLY FORMATTED)
  // ============================================================
  templatePreview(proposal) {

    // ------------------------------------------------------------
    // TREE LIST HTML
    // ------------------------------------------------------------
    const treesHtml = (proposal.trees || [])
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
    // PHASES HTML
    // ------------------------------------------------------------
    const phasesHtml = (proposal.phases || [])
      .map(phase => `
        <div class="phase-item">
          <h4>${phase.title}</h4>
          <p>${phase.description}</p>
        </div>
      `)
      .join("");

    // ------------------------------------------------------------
    // OPTIONS HTML
    // ------------------------------------------------------------
    const optionsHtml = (proposal.options || [])
      .map(opt => `
        <p><strong>${opt.label}:</strong> $${opt.price} — ${opt.description}</p>
      `)
      .join("");

    // ------------------------------------------------------------
    // FINAL PREVIEW OUTPUT
    // ------------------------------------------------------------
    return `
      <h2>Tree Service Proposal</h2>

      <!-- CLIENT & JOB -->
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${proposal.clientName}</p>
      <p><strong>Phone:</strong> ${proposal.clientPhone}</p>
      <p><strong>Email:</strong> ${proposal.clientEmail}</p>
      <p><strong>Address:</strong> ${proposal.clientAddress}</p>

      <h3>Job Location</h3>
      <p>${proposal.jobAddress}, ${proposal.jobCity}, ${proposal.jobState} ${proposal.jobZip}</p>
      <p><strong>Property Notes:</strong> ${proposal.propertyNotes || "None"}</p>

      <!-- TREE DETAILS -->
      <h3>Tree Details & Services</h3>
      ${treesHtml || "<p>No trees added yet.</p>"}

      <!-- SCOPE -->
      <h3>Scope of Work</h3>
      <p>${proposal.scope || "Scope of work not yet defined."}</p>

      <!-- WORK PLAN -->
      <h3>Work Plan</h3>
      <p>${proposal.workPlan || "Work plan not yet defined."}</p>

      <!-- PHASES -->
      <h3>Project Phases</h3>
      ${phasesHtml || "<p>No phases defined.</p>"}

      <!-- TIMELINE + CREW + EQUIPMENT -->
      <h3>Timeline & Crew</h3>
      <p><strong>Timeline:</strong> ${proposal.timeline || "Not specified."}</p>
      <p><strong>Crew Size:</strong> ${proposal.crewSize || "Not specified."}</p>
      <p><strong>Equipment:</strong> ${proposal.equipmentList || "Not specified."}</p>
      <p><strong>Cleanup:</strong> ${proposal.cleanupDetails || "Not specified."}</p>

      <!-- ASSUMPTIONS + EXCLUSIONS -->
      <h3>Assumptions</h3>
      <p>${proposal.assumptions || "None listed."}</p>

      <h3>Exclusions</h3>
      <p>${proposal.exclusions || "None listed."}</p>

      <!-- RISK -->
      <h3>Risk Notes</h3>
      <p>${proposal.riskNotes || "No additional risk notes."}</p>

      <!-- MONEY -->
      <h3>Pricing & Options</h3>
      <p><strong>Base Price:</strong> $${proposal.totalPrice || 0}</p>
      <p><strong>Deposit:</strong> $${proposal.deposit || 0}</p>
      <p><strong>Payment Schedule:</strong> ${proposal.paymentSchedule || "Not specified."}</p>
      ${optionsHtml || "<p>No optional add-ons defined.</p>"}

      <!-- STATUS -->
      <h3>Status</h3>
      <p><strong>Status:</strong> ${proposal.status}</p>
      <p><strong>Created:</strong> ${proposal.createdAt || "N/A"}</p>
      <p><strong>Client Signed:</strong> ${proposal.clientSignedAt || "Not signed"}</p>
      <p><strong>Admin Signed:</strong> ${proposal.adminSignedAt || "Not signed"}</p>

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

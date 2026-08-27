export const CONTRACTS_MODULE = {
  type: "contract",
  title: "Contracts",

  fields: {
    // CLIENT
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",

    // JOB
    jobAddress: "",
    jobCity: "",
    jobState: "",
    jobZip: "",
    scope: "",
    workPlan: "",
    specialClauses: "",
    exclusions: "",
    cleanupDetails: "",
    equipmentNotes: "",

    // MONEY
    totalPrice: 0,
    deposit: 0,
    depositDueDate: "",
    paymentSchedule: "",
    lateFeePolicy: "",
    refundPolicy: "",
    changeOrderPolicy: "",

    // RISK / LIABILITY
    liabilityWaiver: "",
    propertyDamageClause: "",
    utilityLinesClause: "",
    weatherDelayClause: "",
    accessRequirements: "",

    // META
    createdAt: "",
    clientSignedAt: "",
    adminSignedAt: "",
    status: "Draft",
    internalNotes: ""
  },

  templatePreview(contract) {
    return `
      <h2>Tree Service Contract</h2>

      <h3>Client & Job</h3>
      <p><strong>Client:</strong> ${contract.clientName}</p>
      <p><strong>Contact:</strong> ${contract.clientPhone} · ${contract.clientEmail}</p>
      <p><strong>Job Address:</strong> ${contract.jobAddress}, ${contract.jobCity}, ${contract.jobState} ${contract.jobZip}</p>

      <h3>Scope of Work</h3>
      <p>${contract.scope || "Scope of work not yet defined."}</p>

      <h3>Work Plan</h3>
      <p>${contract.workPlan || "Work plan not yet defined."}</p>

      <h3>Special Clauses</h3>
      <p>${contract.specialClauses || "No special clauses added."}</p>

      <h3>Exclusions & Cleanup</h3>
      <p><strong>Exclusions:</strong> ${contract.exclusions || "None listed."}</p>
      <p><strong>Cleanup:</strong> ${contract.cleanupDetails || "Standard cleanup included."}</p>

      <h3>Pricing & Payments</h3>
      <p><strong>Total Price:</strong> $${contract.totalPrice || 0}</p>
      <p><strong>Deposit:</strong> $${contract.deposit || 0} ${contract.depositDueDate ? `(Due: ${contract.depositDueDate})` : ""}</p>
      <p><strong>Payment Schedule:</strong> ${contract.paymentSchedule || "Not specified."}</p>
      <p><strong>Late Fees:</strong> ${contract.lateFeePolicy || "Not specified."}</p>
      <p><strong>Refunds:</strong> ${contract.refundPolicy || "Not specified."}</p>
      <p><strong>Change Orders:</strong> ${contract.changeOrderPolicy || "Not specified."}</p>

      <h3>Liability & Risk</h3>
      <p>${contract.liabilityWaiver || "Liability waiver not yet defined."}</p>
      <p><strong>Property Damage:</strong> ${contract.propertyDamageClause || "Not specified."}</p>
      <p><strong>Utility Lines:</strong> ${contract.utilityLinesClause || "Not specified."}</p>
      <p><strong>Weather Delays:</strong> ${contract.weatherDelayClause || "Not specified."}</p>
      <p><strong>Access Requirements:</strong> ${contract.accessRequirements || "Not specified."}</p>

      <h3>Status</h3>
      <p><strong>Status:</strong> ${contract.status}</p>
      <p><strong>Created:</strong> ${contract.createdAt || "N/A"}</p>
      <p><strong>Client Signed:</strong> ${contract.clientSignedAt || "Not signed"}</p>
      <p><strong>Admin Signed:</strong> ${contract.adminSignedAt || "Not signed"}</p>
    `;
  }
};

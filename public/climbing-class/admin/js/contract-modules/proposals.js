export const PROPOSALS_MODULE = {
  type: "proposal",
  title: "Proposals",

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
    phases: [], // [{ title, description }]
    timeline: "",
    crewSize: "",
    equipmentList: "",
    cleanupDetails: "",
    riskNotes: "",

    // MONEY
    totalPrice: 0,
    deposit: 0,
    paymentSchedule: "",
    options: [], // [{ label, price, description }]

    // META
    createdAt: "",
    status: "Draft",
    internalNotes: ""
  },

  templatePreview(proposal) {
    const phasesHtml = (proposal.phases || [])
      .map(phase => `
        <h4>${phase.title}</h4>
        <p>${phase.description}</p>
      `)
      .join("");

    const optionsHtml = (proposal.options || [])
      .map(opt => `
        <p><strong>${opt.label}:</strong> $${opt.price} — ${opt.description}</p>
      `)
      .join("");

    return `
      <h2>Tree Service Proposal</h2>

      <h3>Client & Job</h3>
      <p><strong>Client:</strong> ${proposal.clientName}</p>
      <p><strong>Contact:</strong> ${proposal.clientPhone} · ${proposal.clientEmail}</p>
      <p><strong>Job Address:</strong> ${proposal.jobAddress}, ${proposal.jobCity}, ${proposal.jobState} ${proposal.jobZip}</p>

      <h3>Scope of Work</h3>
      <p>${proposal.scope || "Scope of work not yet defined."}</p>

      <h3>Work Plan & Phases</h3>
      <p>${proposal.workPlan || "Work plan not yet defined."}</p>
      ${phasesHtml || "<p>No phases defined.</p>"}

      <h3>Timeline & Crew</h3>
      <p><strong>Timeline:</strong> ${proposal.timeline || "Not specified."}</p>
      <p><strong>Crew Size:</strong> ${proposal.crewSize || "Not specified."}</p>
      <p><strong>Equipment:</strong> ${proposal.equipmentList || "Not specified."}</p>
      <p><strong>Cleanup:</strong> ${proposal.cleanupDetails || "Not specified."}</p>

      <h3>Risk & Notes</h3>
      <p>${proposal.riskNotes || "No additional risk notes."}</p>

      <h3>Pricing & Options</h3>
      <p><strong>Base Price:</strong> $${proposal.totalPrice || 0}</p>
      <p><strong>Deposit:</strong> $${proposal.deposit || 0}</p>
      <p><strong>Payment Schedule:</strong> ${proposal.paymentSchedule || "Not specified."}</p>
      ${optionsHtml || "<p>No optional add-ons defined.</p>"}

      <h3>Status</h3>
      <p><strong>Status:</strong> ${proposal.status}</p>
      <p><strong>Created:</strong> ${proposal.createdAt || "N/A"}</p>
    `;
  }
};

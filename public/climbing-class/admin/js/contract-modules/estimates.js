export const ESTIMATES_MODULE = {
  type: "estimate",
  title: "Estimates",

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
    lineItems: [], // [{ description, qty, unitPrice, total }]
    notes: "",
    validityPeriod: "",
    assumptions: "",
    exclusions: "",

    // MONEY
    totalPrice: 0,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 0,

    // META
    createdAt: "",
    status: "Draft",
    internalNotes: ""
  },

  templatePreview(estimate) {
    const itemsHtml = (estimate.lineItems || [])
      .map(item => `
        <tr>
          <td>${item.description}</td>
          <td>${item.qty}</td>
          <td>$${item.unitPrice}</td>
          <td>$${item.total}</td>
        </tr>
      `)
      .join("");

    return `
      <h2>Tree Service Estimate</h2>

      <h3>Client & Job</h3>
      <p><strong>Client:</strong> ${estimate.clientName}</p>
      <p><strong>Contact:</strong> ${estimate.clientPhone} · ${estimate.clientEmail}</p>
      <p><strong>Job Address:</strong> ${estimate.jobAddress}, ${estimate.jobCity}, ${estimate.jobState} ${estimate.jobZip}</p>

      <h3>Scope of Work</h3>
      <p>${estimate.scope || "Scope of work not yet defined."}</p>

      <h3>Line Items</h3>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml || "<tr><td colspan='4'>No line items added.</td></tr>"}
        </tbody>
      </table>

      <h3>Totals</h3>
      <p><strong>Subtotal:</strong> $${estimate.totalPrice || 0}</p>
      <p><strong>Tax (${estimate.taxRate || 0}%):</strong> $${estimate.taxAmount || 0}</p>
      <p><strong>Grand Total:</strong> $${estimate.grandTotal || estimate.totalPrice || 0}</p>

      <h3>Assumptions & Exclusions</h3>
      <p><strong>Assumptions:</strong> ${estimate.assumptions || "None listed."}</p>
      <p><strong>Exclusions:</strong> ${estimate.exclusions || "None listed."}</p>

      <h3>Validity</h3>
      <p><strong>Valid Until:</strong> ${estimate.validityPeriod || "Not specified."}</p>

      <h3>Status</h3>
      <p><strong>Status:</strong> ${estimate.status}</p>
      <p><strong>Created:</strong> ${estimate.createdAt || "N/A"}</p>
    `;
  }
};

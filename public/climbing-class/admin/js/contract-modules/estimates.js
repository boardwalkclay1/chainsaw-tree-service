export const ESTIMATES_MODULE = {
  type: "estimate",
  title: "Tree Service Estimate",

  // ============================================================
  // FULL DATA MODEL (STATIC, COMPLETE)
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
    // LINE ITEMS
    // ------------------------------------------------------------
    lineItems: [],

    // ------------------------------------------------------------
    // SCOPE + NOTES
    // ------------------------------------------------------------
    scope: "",
    assumptions: "",
    exclusions: "",
    notes: "",
    timeframe: "",

    // ------------------------------------------------------------
    // MONEY
    // ------------------------------------------------------------
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    grandTotal: 0,
    depositRequired: 0,

    // ------------------------------------------------------------
    // META
    // ------------------------------------------------------------
    createdAt: "",
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
  // ESTIMATE PREVIEW (STATIC, EPIC, FULLY FORMATTED)
  // ============================================================
  templatePreview(estimate) {

    // TREE LIST
    const treesHtml = (estimate.trees || [])
      .map(tree => `
        <div class="tree-item">
          <h4>${tree.species || "Tree"} — ${tree.serviceType || "Service"}</h4>
          <p><strong>Location:</strong> ${tree.location || "Not specified"}</p>
          <p><strong>Details:</strong> ${tree.details || "No details provided"}</p>
          <p><strong>Price:</strong> $${tree.price || 0}</p>
        </div>
      `)
      .join("");

    // LINE ITEMS
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

    // FINAL PREVIEW
    return `
      <h2>${estimate.title || "Tree Service Estimate"}</h2>

      <!-- CLIENT -->
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${estimate.clientName}</p>
      <p><strong>Phone:</strong> ${estimate.clientPhone}</p>
      <p><strong>Email:</strong> ${estimate.clientEmail}</p>
      <p><strong>Address:</strong> ${estimate.clientAddress}</p>

      <!-- JOB -->
      <h3>Job Location</h3>
      <p>${estimate.jobAddress}, ${estimate.jobCity}, ${estimate.jobState} ${estimate.jobZip}</p>
      <p><strong>Property Notes:</strong> ${estimate.propertyNotes || "None"}</p>

      <!-- TREES -->
      <h3>Tree Details & Services</h3>
      ${treesHtml || "<p>No trees added.</p>"}

      <!-- SCOPE -->
      <h3>Scope of Work</h3>
      <p>${estimate.scope || "Not specified."}</p>

      <!-- LINE ITEMS -->
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

      <!-- MONEY -->
      <h3>Totals</h3>
      <p><strong>Subtotal:</strong> $${estimate.subtotal}</p>
      <p><strong>Tax (${estimate.taxRate}%):</strong> $${estimate.taxAmount}</p>
      <p><strong>Grand Total:</strong> $${estimate.grandTotal}</p>
      <p><strong>Deposit Required:</strong> $${estimate.depositRequired}</p>

      <!-- TIMEFRAME -->
      <h3>Timeframe</h3>
      <p>${estimate.timeframe || "Not specified."}</p>

      <!-- ASSUMPTIONS -->
      <h3>Assumptions</h3>
      <p>${estimate.assumptions || "None."}</p>

      <!-- EXCLUSIONS -->
      <h3>Exclusions</h3>
      <p>${estimate.exclusions || "None."}</p>

      <!-- NOTES -->
      <h3>Additional Notes</h3>
      <p>${estimate.notes || "None."}</p>

      <!-- META -->
      <h3>Document Status</h3>
      <p><strong>Status:</strong> ${estimate.status}</p>
      <p><strong>Created:</strong> ${estimate.createdAt || "N/A"}</p>

      <!-- BUSINESS INFO -->
      <h3>Prepared By</h3>
      <p><strong>${estimate.business.name}</strong></p>
      <p>Phone: ${estimate.business.phone}</p>
      <p>Email: ${estimate.business.email}</p>
      <p>Address: ${estimate.business.address}</p>
      <p>License: ${estimate.business.license}</p>
      <p>${estimate.business.insurance}</p>
    `;
  }
};

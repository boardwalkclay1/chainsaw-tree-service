export const ESTIMATES_MODULE = {
  type: "estimate",
  title: "Tree Service Estimate",

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
    propertyNotes: "", // gate codes, hazards, pets, access issues

    // ------------------------------------------------------------
    // TREE DETAILS (each tree has its own service + price)
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
    // SERVICE LINE ITEMS (optional)
    // ------------------------------------------------------------
    lineItems: [
      // { description, qty, unitPrice, total }
    ],

    // ------------------------------------------------------------
    // SCOPE + NOTES
    // ------------------------------------------------------------
    scope: "",
    assumptions: "",
    exclusions: "",
    notes: "",
    timeframe: "", // "Job will be completed between ___ and ___"

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
    internalNotes: ""
  },

  // ============================================================
  // PROFESSIONAL ESTIMATE PREVIEW (FULLY FORMATTED)
  // ============================================================
  templatePreview(estimate) {

    // ------------------------------------------------------------
    // TREE LIST HTML
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // LINE ITEMS HTML
    // ------------------------------------------------------------
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

    // ------------------------------------------------------------
    // FINAL PREVIEW OUTPUT
    // ------------------------------------------------------------
    return `
      <h2>Tree Service Estimate</h2>

      <!-- CLIENT & JOB -->
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${estimate.clientName}</p>
      <p><strong>Phone:</strong> ${estimate.clientPhone}</p>
      <p><strong>Email:</strong> ${estimate.clientEmail}</p>
      <p><strong>Address:</strong> ${estimate.clientAddress}</p>

      <h3>Job Location</h3>
      <p>${estimate.jobAddress}, ${estimate.jobCity}, ${estimate.jobState} ${estimate.jobZip}</p>
      <p><strong>Property Notes:</strong> ${estimate.propertyNotes || "None"}</p>

      <!-- TREE DETAILS -->
      <h3>Tree Details & Services</h3>
      ${treesHtml || "<p>No trees added yet.</p>"}

      <!-- SCOPE -->
      <h3>Scope of Work</h3>
      <p>${estimate.scope || "Scope of work not yet defined."}</p>

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
      <p><strong>Subtotal:</strong> $${estimate.subtotal || 0}</p>
      <p><strong>Tax (${estimate.taxRate || 0}%):</strong> $${estimate.taxAmount || 0}</p>
      <p><strong>Grand Total:</strong> $${estimate.grandTotal || estimate.subtotal || 0}</p>
      <p><strong>Deposit Required:</strong> $${estimate.depositRequired || 0}</p>

      <!-- TIMEFRAME -->
      <h3>Timeframe</h3>
      <p>${estimate.timeframe || "Not specified."}</p>

      <!-- ASSUMPTIONS & EXCLUSIONS -->
      <h3>Assumptions</h3>
      <p>${estimate.assumptions || "None listed."}</p>

      <h3>Exclusions</h3>
      <p>${estimate.exclusions || "None listed."}</p>

      <!-- NOTES -->
      <h3>Additional Notes</h3>
      <p>${estimate.notes || "No additional notes."}</p>

      <!-- META -->
      <h3>Document Status</h3>
      <p><strong>Status:</strong> ${estimate.status}</p>
      <p><strong>Created:</strong> ${estimate.createdAt || "N/A"}</p>

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

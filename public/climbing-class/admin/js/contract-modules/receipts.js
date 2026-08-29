export const RECEIPTS_MODULE = {
  type: "receipt",
  title: "Payment Receipt",

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

    // ------------------------------------------------------------
    // JOB INFORMATION
    // ------------------------------------------------------------
    jobAddress: "",
    jobCity: "",
    jobState: "",
    jobZip: "",
    propertyNotes: "",

    // ------------------------------------------------------------
    // TREE DETAILS (same structure as estimates/contracts)
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
    // PAYMENT DETAILS
    // ------------------------------------------------------------
    totalPaid: 0,
    paymentMethod: "",       // Cash, Card, Zelle, Venmo, Check, etc.
    paymentDate: "",
    transactionId: "",
    remainingBalance: 0,
    depositPaid: 0,
    finalPayment: 0,

    // ------------------------------------------------------------
    // NOTES
    // ------------------------------------------------------------
    scope: "",
    notes: "",
    internalNotes: "",

    // ------------------------------------------------------------
    // META
    // ------------------------------------------------------------
    createdAt: "",
    status: "Completed"
  },

  // ============================================================
  // PROFESSIONAL RECEIPT PREVIEW (FULLY FORMATTED)
  // ============================================================
  templatePreview(receipt) {

    // ------------------------------------------------------------
    // TREE LIST HTML
    // ------------------------------------------------------------
    const treesHtml = (receipt.trees || [])
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
      <h2>Payment Receipt</h2>

      <!-- CLIENT & JOB -->
      <h3>Client Information</h3>
      <p><strong>Name:</strong> ${receipt.clientName}</p>
      <p><strong>Phone:</strong> ${receipt.clientPhone}</p>
      <p><strong>Email:</strong> ${receipt.clientEmail}</p>

      <h3>Job Location</h3>
      <p>${receipt.jobAddress}, ${receipt.jobCity}, ${receipt.jobState} ${receipt.jobZip}</p>
      <p><strong>Property Notes:</strong> ${receipt.propertyNotes || "None"}</p>

      <!-- TREE DETAILS -->
      <h3>Tree Details & Services</h3>
      ${treesHtml || "<p>No tree details provided.</p>"}

      <!-- PAYMENT DETAILS -->
      <h3>Payment Details</h3>
      <p><strong>Total Paid:</strong> $${receipt.totalPaid || 0}</p>
      <p><strong>Deposit Paid:</strong> $${receipt.depositPaid || 0}</p>
      <p><strong>Final Payment:</strong> $${receipt.finalPayment || 0}</p>
      <p><strong>Remaining Balance:</strong> $${receipt.remainingBalance || 0}</p>
      <p><strong>Payment Method:</strong> ${receipt.paymentMethod || "Not specified."}</p>
      <p><strong>Payment Date:</strong> ${receipt.paymentDate || "Not specified."}</p>
      <p><strong>Transaction ID:</strong> ${receipt.transactionId || "N/A"}</p>

      <!-- SCOPE + NOTES -->
      <h3>Scope of Work</h3>
      <p>${receipt.scope || "Not specified."}</p>

      <h3>Additional Notes</h3>
      <p>${receipt.notes || "No notes."}</p>

      <!-- STATUS -->
      <h3>Status</h3>
      <p><strong>Status:</strong> ${receipt.status}</p>
      <p><strong>Created:</strong> ${receipt.createdAt || "N/A"}</p>

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

export const RECEIPTS_MODULE = {
  type: "receipt",
  title: "Receipts",

  fields: {
    // CLIENT
    clientName: "",
    clientEmail: "",
    clientPhone: "",

    // JOB
    jobAddress: "",
    jobCity: "",
    jobState: "",
    jobZip: "",
    scope: "",

    // MONEY
    totalPaid: 0,
    paymentMethod: "",
    paymentDate: "",
    transactionId: "",
    remainingBalance: 0,
    notes: "",

    // META
    createdAt: "",
    status: "Completed",
    internalNotes: ""
  },

  templatePreview(receipt) {
    return `
      <h2>Payment Receipt</h2>

      <h3>Client & Job</h3>
      <p><strong>Client:</strong> ${receipt.clientName}</p>
      <p><strong>Contact:</strong> ${receipt.clientPhone} · ${receipt.clientEmail}</p>
      <p><strong>Job Address:</strong> ${receipt.jobAddress}, ${receipt.jobCity}, ${receipt.jobState} ${receipt.jobZip}</p>

      <h3>Payment Details</h3>
      <p><strong>Total Paid:</strong> $${receipt.totalPaid || 0}</p>
      <p><strong>Payment Method:</strong> ${receipt.paymentMethod || "Not specified."}</p>
      <p><strong>Payment Date:</strong> ${receipt.paymentDate || "Not specified."}</p>
      <p><strong>Transaction ID:</strong> ${receipt.transactionId || "N/A"}</p>
      <p><strong>Remaining Balance:</strong> $${receipt.remainingBalance || 0}</p>

      <h3>Scope / Notes</h3>
      <p><strong>Scope:</strong> ${receipt.scope || "Not specified."}</p>
      <p><strong>Notes:</strong> ${receipt.notes || "No notes."}</p>

      <h3>Status</h3>
      <p><strong>Status:</strong> ${receipt.status}</p>
      <p><strong>Created:</strong> ${receipt.createdAt || "N/A"}</p>
    `;
  }
};

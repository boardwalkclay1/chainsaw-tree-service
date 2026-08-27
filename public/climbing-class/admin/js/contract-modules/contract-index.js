// ===============================
// CONTRACT MODULES AGGREGATOR
// ===============================

// Full Contract Module
export { CONTRACTS_MODULE } from "./contracts.js";

// Full Estimates Module
export { ESTIMATES_MODULE } from "./estimates.js";

// Full Proposals Module
export { PROPOSALS_MODULE } from "./proposals.js";

// Full Receipts Module
export { RECEIPTS_MODULE } from "./receipts.js";


// ===============================
// CATEGORY MAP (for admin-contracts.js)
// ===============================
//
// This gives your admin-contracts.js a clean,
// organized structure to loop through.
// Each category has:
// - type
// - title
// - module reference
// - description
// - icon (optional)
// - color (for UI themes)
// ===============================

export const CONTRACT_CATEGORY_MAP = {
  contract: {
    type: "contract",
    title: "Contracts",
    module: CONTRACTS_MODULE,
    description: "Full legal contracts for tree service jobs including scope, liability, pricing, and signatures.",
    color: "#ff7b00",
    icon: "📄"
  },

  estimate: {
    type: "estimate",
    title: "Estimates",
    module: ESTIMATES_MODULE,
    description: "Detailed job estimates with line items, assumptions, exclusions, and total cost breakdown.",
    color: "#00c853",
    icon: "🧮"
  },

  proposal: {
    type: "proposal",
    title: "Proposals",
    module: PROPOSALS_MODULE,
    description: "Professional proposals with phases, timelines, crew size, equipment lists, and optional add-ons.",
    color: "#4e9cff",
    icon: "📘"
  },

  receipt: {
    type: "receipt",
    title: "Receipts",
    module: RECEIPTS_MODULE,
    description: "Payment receipts with transaction details, remaining balance, and job reference.",
    color: "#ff00c8",
    icon: "🧾"
  }
};


// ===============================
// CATEGORY ORDER (UI sorting)
// ===============================
//
// This ensures your admin-contracts.js displays
// categories in the correct order every time.
// ===============================

export const CONTRACT_CATEGORY_ORDER = [
  "contract",
  "estimate",
  "proposal",
  "receipt"
];


// ===============================
// EXPORT EVERYTHING CLEANLY
// ===============================

export default {
  CONTRACTS_MODULE,
  ESTIMATES_MODULE,
  PROPOSALS_MODULE,
  RECEIPTS_MODULE,
  CONTRACT_CATEGORY_MAP,
  CONTRACT_CATEGORY_ORDER
};

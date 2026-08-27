/* ============================================================
   IMPORT MODULES
   ============================================================ */
import { KNOTS } from "./modules/knots.js";
import { CLIMBING } from "./modules/climbing.js";
import { THROWBALL } from "./modules/throwball.js";
import { CUTTING } from "./modules/cutting.js";
import { BUSINESS } from "./modules/business.js";
import { SAFETY } from "./modules/safety.js";

/* ============================================================
   CATEGORY CONFIG (COLORS + ICONS + DESCRIPTIONS)
   ============================================================ */
const CATEGORY_META = {
  KNOTS: {
    color: "#c8ff00",
    icon: "🪢",
    description: "Arborist knots, friction hitches, rigging knots, and real canopy applications."
  },
  CLIMBING: {
    color: "#4e9cff",
    icon: "🧗‍♂️",
    description: "Movement, flow, body thrusting, footlocking, spiking, and canopy navigation."
  },
  THROWBALL: {
    color: "#ff7b00",
    icon: "🎯",
    description: "Throwball basics, anchors, accuracy, recovery, and high‑union techniques."
  },
  CUTTING: {
    color: "#ff00c8",
    icon: "🪚",
    description: "Chainsaw safety, basic cuts, advanced canopy cuts, and rigging‑aware cutting."
  },
  BUSINESS: {
    color: "#00e0ff",
    icon: "💼",
    description: "Pricing, jobsite setup, communication, workflow, and professional arborist business skills."
  },
  SAFETY: {
    color: "#00c853",
    icon: "⚠️",
    description: "PPE, climbing safety, rigging safety, hazard awareness, and jobsite risk control."
  }
};

/* ============================================================
   CATEGORY LIST
   ============================================================ */
const ALL_CATEGORIES = [
  KNOTS,
  CLIMBING,
  THROWBALL,
  CUTTING,
  BUSINESS,
  SAFETY
];

/* ============================================================
   BUILD VIDEO LIBRARY
   ============================================================ */
function buildVideoLibrary() {
  const container = document.getElementById("videoContainer");
  if (!container) return;

  ALL_CATEGORIES.forEach(category => {
    const meta = CATEGORY_META[category.title.toUpperCase()] || {};

    /* CATEGORY WRAPPER */
    const catDiv = document.createElement("div");
    catDiv.className = "category";
    catDiv.dataset.cat = category.title.toLowerCase();

    /* CATEGORY HEADER */
    const catHeader = document.createElement("div");
    catHeader.className = "category-header";
    catHeader.innerHTML = `
      <h2 style="color:${meta.color || "#fff"}">
        ${meta.icon || ""} ${category.title}
      </h2>
      <p class="category-description">${meta.description || ""}</p>
    `;
    catHeader.addEventListener("click", () => {
      catDiv.classList.toggle("open");
    });

    catDiv.appendChild(catHeader);

    /* SUBCATEGORIES */
    Object.values(category.subcategories).forEach(sub => {
      const subDiv = document.createElement("div");
      subDiv.className = "subcategory";

      const subHeader = document.createElement("div");
      subHeader.className = "subcategory-header";
      subHeader.innerHTML = `<h3>${sub.title}</h3>`;
      subHeader.addEventListener("click", () => {
        subDiv.classList.toggle("open");
      });

      subDiv.appendChild(subHeader);

      /* VIDEO GRID */
      const grid = document.createElement("div");
      grid.className = "video-grid";

      sub.videos.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.dataset.tags = video.tags || "";
        card.dataset.title = video.title.toLowerCase();

        card.innerHTML = `
          <h4>${video.title}</h4>
          <video controls src="${video.src}"></video>
        `;

        grid.appendChild(card);
      });

      subDiv.appendChild(grid);
      catDiv.appendChild(subDiv);
    });

    container.appendChild(catDiv);
  });
}

/* ============================================================
   SEARCH SYSTEM (UPGRADED)
   ============================================================ */
function initSearch() {
  const searchInput = document.getElementById("videoSearch");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    document.querySelectorAll(".video-card").forEach(card => {
      const text = card.dataset.title || "";
      const tags = card.dataset.tags.toLowerCase() || "";

      const match =
        text.includes(term) ||
        tags.includes(term);

      card.style.display = match ? "" : "none";
    });
  });
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  buildVideoLibrary();
  initSearch();
});

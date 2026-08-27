import { KNOTS } from "./modules/knots.js";
import { CLIMBING } from "./modules/climbing.js";
import { THROWBALL } from "./modules/throwball.js";
import { CUTTING } from "./modules/cutting.js";
import { BUSINESS } from "./modules/business.js";
import { SAFETY } from "./modules/safety.js";

const ALL_CATEGORIES = [
  KNOTS,
  CLIMBING,
  THROWBALL,
  CUTTING,
  BUSINESS,
  SAFETY
];

function buildVideoLibrary() {
  const container = document.getElementById("videoContainer");

  ALL_CATEGORIES.forEach(category => {
    const catDiv = document.createElement("div");
    catDiv.className = "category";

    const catHeader = document.createElement("h2");
    catHeader.textContent = category.title;
    catHeader.className = "category-header";
    catHeader.addEventListener("click", () => {
      catDiv.classList.toggle("open");
    });

    catDiv.appendChild(catHeader);

    Object.values(category.subcategories).forEach(sub => {
      const subDiv = document.createElement("div");
      subDiv.className = "subcategory";

      const subHeader = document.createElement("h3");
      subHeader.textContent = sub.title;
      subHeader.className = "subcategory-header";
      subHeader.addEventListener("click", () => {
        subDiv.classList.toggle("open");
      });

      subDiv.appendChild(subHeader);

      const grid = document.createElement("div");
      grid.className = "video-grid";

      sub.videos.forEach(video => {
        const card = document.createElement("div");
        card.className = "video-card";
        card.dataset.tags = video.tags || "";

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

document.addEventListener("DOMContentLoaded", () => {
  buildVideoLibrary();

  document.getElementById("videoSearch").addEventListener("input", function () {
    const term = this.value.toLowerCase();
    document.querySelectorAll(".video-card").forEach(card => {
      const text = card.innerText.toLowerCase();
      const tags = card.dataset.tags.toLowerCase();
      card.style.display = (text.includes(term) || tags.includes(term)) ? "" : "none";
    });
  });
});

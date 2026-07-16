/* ============================
   SMOOTH SCROLL
============================ */
function initScroll() {
  document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("data-scroll"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

/* ============================
   VIDEO CONTROLS
============================ */
function initVideoControls() {
  const videoHero = document.getElementById("video-hero");
  const video = document.getElementById("heroVideo");

  const playPauseBtn = document.getElementById("playPauseBtn");
  const backBtn = document.getElementById("backBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const muteBtn = document.getElementById("muteBtn");

  if (!video) return;

  video.muted = false;

  // Show controls when clicking video area
  videoHero.addEventListener("click", () => {
    videoHero.classList.add("show-controls");
    setTimeout(() => {
      videoHero.classList.remove("show-controls");
    }, 2500);
  });

  playPauseBtn.addEventListener("click", e => {
    e.stopPropagation();
    if (video.paused) {
      video.play();
      playPauseBtn.textContent = "Pause";
    } else {
      video.pause();
      playPauseBtn.textContent = "Play";
    }
  });

  backBtn.addEventListener("click", e => {
    e.stopPropagation();
    video.currentTime = Math.max(0, video.currentTime - 5);
  });

  forwardBtn.addEventListener("click", e => {
    e.stopPropagation();
    video.currentTime = Math.min(video.duration, video.currentTime + 5);
  });

  muteBtn.addEventListener("click", e => {
    e.stopPropagation();
    video.muted = !video.muted;
    muteBtn.textContent = video.muted ? "Sound: Off" : "Sound: On";
  });
}

/* ============================
   DROPDOWN CONTENT
============================ */
function loadDropdownContent() {
  const treeService = document.getElementById("tree-service-content");
  const climbClass = document.getElementById("climb-class-content");
  const gallery = document.getElementById("gallery-content");

  if (treeService) {
    treeService.innerHTML = `
      <p>Chainsaw Clay's Tree Service provides:</p>
      <ul>
        <li>High‑level climbing</li>
        <li>Safe removals</li>
        <li>Precision pruning</li>
        <li>Storm cleanup</li>
        <li>Yard planning</li>
      </ul>
      <p>All work is done with canopy‑based cutting, controlled rigging, and real climbing skill.</p>
      <a href="services.html" class="link-btn">Open Services Page</a>
    `;
  }

  if (climbClass) {
    climbClass.innerHTML = `
      <p>Learn real climbing from a real climber:</p>
      <ul>
        <li>Knots & gear</li>
        <li>Throwball & access</li>
        <li>Movement & canopy flow</li>
        <li>Safety & rescue</li>
      </ul>
      <p>Classes built from real canopy experience, not ground theory.</p>
      <a href="climbing-class.html" class="link-btn">Open Climbing Class Page</a>
    `;
  }

  if (gallery) {
    gallery.innerHTML = `
      <p>Preview photos and videos from real jobs:</p>
      <ul>
        <li>Removals</li>
        <li>Pruning</li>
        <li>Storm cleanup</li>
        <li>Climbing class sessions</li>
      </ul>
      <a href="gallery.html" class="link-btn">Open Gallery</a>
    `;
  }
}

/* ============================
   ESTIMATE FORM → WORKER
============================ */
function initEstimateForm() {
  const form = document.getElementById("estimate-form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        alert("There was an issue submitting your request. Please try again.");
        return;
      }

      alert("Your estimate request has been submitted. Clay will review it in the admin dash.");
      form.reset();
    } catch (err) {
      alert("Network error. Please try again.");
    }
  });
}

/* ============================
   INIT EVERYTHING
============================ */
document.addEventListener("DOMContentLoaded", () => {
  initScroll();
  initVideoControls();
  loadDropdownContent();
  initEstimateForm();
});

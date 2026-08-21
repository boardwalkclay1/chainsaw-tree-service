/* ============================
   FORCE VIDEO AUTOPLAY
============================ */
function forceAutoplay() {
  const video = document.getElementById("heroVideo");
  if (!video) return;

  video.muted = true;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      setTimeout(() => {
        video.play().catch(() => {});
      }, 150);
    });
  }

  document.addEventListener("click", () => {
    video.muted = false;
  });
}

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
   ESTIMATE FORM
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
  forceAutoplay();
  initScroll();
  initVideoControls();
  initEstimateForm();
});

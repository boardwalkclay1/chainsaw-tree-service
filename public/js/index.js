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

  const submitButton = document.getElementById("estimate-submit");
  const status = document.getElementById("estimate-status");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    if (submitButton) submitButton.disabled = true;
    if (status) status.textContent = "Sending your message…";

    const formData = new FormData(form);

    try {
      const res = await fetch("https://api.chainsawclay.com/api/estimate", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        if (status) {
          status.textContent = result.error || "There was an issue sending your message. Please try again.";
        }
        return;
      }

      if (status) status.textContent = "Your message was sent. Clay will get back to you soon.";
      form.reset();
    } catch (err) {
      if (status) status.textContent = "Unable to send your message right now. Please try again or email support@chainsawclay.com.";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}

function initContactPopup() {
  const button = document.getElementById("contact-now-btn");
  const popup = document.getElementById("contact-popup");
  const closeButton = document.getElementById("close-contact");
  const estimateLink = document.getElementById("contact-estimate-link");
  if (!button || !popup || !closeButton || !estimateLink) return;

  function closePopup(restoreFocus = true) {
    popup.classList.remove("open");
    popup.hidden = true;
    button.setAttribute("aria-expanded", "false");
    if (restoreFocus) button.focus();
  }

  button.addEventListener("click", () => {
    popup.hidden = false;
    popup.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    closeButton.focus();
  });
  closeButton.addEventListener("click", () => closePopup());
  estimateLink.addEventListener("click", () => closePopup(false));
  popup.addEventListener("click", e => {
    if (e.target === popup) closePopup();
  });
  document.addEventListener("keydown", e => {
    if (popup.hidden) return;
    if (e.key === "Escape") {
      closePopup();
    } else if (e.key === "Tab") {
      const focusable = popup.querySelectorAll("a[href], button:not([disabled])");
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
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
  initContactPopup();
});

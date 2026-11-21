/* ============================
   VIDEO
============================ */
function initVideo() {
  const video = document.getElementById("heroVideo");
  const videoHero = document.getElementById("video-hero");

  if (!video || !videoHero) return;

  const playPauseBtn = document.getElementById("playPauseBtn");
  const backBtn = document.getElementById("backBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const muteBtn = document.getElementById("muteBtn");

  let controlsTimer;

  function updateVideoButtons() {
    if (playPauseBtn) {
      playPauseBtn.textContent = video.paused ? "Play" : "Pause";
    }

    if (muteBtn) {
      muteBtn.textContent = video.muted ? "Sound: Off" : "Sound: On";
    }
  }

  function showControls() {
    videoHero.classList.add("show-controls");
    clearTimeout(controlsTimer);

    controlsTimer = setTimeout(() => {
      if (!videoHero.contains(document.activeElement)) {
        videoHero.classList.remove("show-controls");
      }
    }, 2500);
  }

  videoHero.addEventListener("click", showControls);
  videoHero.addEventListener("focusin", showControls);
  videoHero.addEventListener("focusout", () => {
    controlsTimer = setTimeout(() => {
      if (!videoHero.contains(document.activeElement)) {
        videoHero.classList.remove("show-controls");
      }
    }, 2500);
  });

  video.addEventListener("play", updateVideoButtons);
  video.addEventListener("pause", updateVideoButtons);
  video.addEventListener("volumechange", updateVideoButtons);

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", async () => {
      showControls();

      if (video.paused) {
        try {
          await video.play();
        } catch (error) {
          console.error("Video playback failed:", error);
          alert("The video could not be played. Please try again.");
        }
      } else {
        video.pause();
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener("click", () => {
      showControls();
      video.currentTime = Math.max(0, video.currentTime - 5);
    });
  }

  if (forwardBtn) {
    forwardBtn.addEventListener("click", () => {
      showControls();

      if (Number.isFinite(video.duration)) {
        video.currentTime = Math.min(video.duration, video.currentTime + 5);
      }
    });
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", () => {
      showControls();
      video.muted = !video.muted;
    });
  }

  video.muted = true;
  updateVideoButtons();

  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.warn("Autoplay was blocked or failed:", error);
      video.controls = true;
      updateVideoButtons();
    });
  }
}

/* ============================
   SMOOTH SCROLL
============================ */
function initScroll() {
  document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", event => {
      const selector = link.getAttribute("data-scroll");
      if (!selector) return;

      let target;
      try {
        target = document.querySelector(selector);
      } catch (error) {
        console.error("Invalid scroll target:", selector, error);
        return;
      }

      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/* ============================
   ESTIMATE FORM
============================ */
function initEstimateForm() {
  const form = document.getElementById("estimate-form");
  if (!form) return;

  const submitButton = document.getElementById("estimate-submit");
  let submitting = false;

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (submitting) return;

    submitting = true;
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        body: new FormData(form)
      });

      if (!response.ok) {
        alert("There was an issue submitting your request. Please try again.");
        return;
      }

      alert("Your estimate request has been submitted.");
      form.reset();
    } catch (error) {
      console.error("Estimate submission failed:", error);
      alert("Network error. Please try again.");
    } finally {
      submitting = false;
      if (submitButton) submitButton.disabled = false;
    }
  });
}

/* ============================
   INITIALIZE
============================ */
document.addEventListener("DOMContentLoaded", () => {
  initVideo();
  initScroll();
  initEstimateForm();
});

/* ==========================================
   CHAINSAW CLAY MAIN SCRIPT
========================================== */

function initVideo() {

  const video = document.getElementById("heroVideo");
  const videoHero = document.getElementById("video-hero");

  if (!video || !videoHero) return;

  const playPauseBtn =
    document.getElementById("playPauseBtn");

  const backBtn =
    document.getElementById("backBtn");

  const forwardBtn =
    document.getElementById("forwardBtn");

  const muteBtn =
    document.getElementById("muteBtn");

  let controlsTimer;

  function updateButtons() {

    if (playPauseBtn) {
      playPauseBtn.textContent =
        video.paused ? "Play" : "Pause";
    }

    if (muteBtn) {
      muteBtn.textContent =
        video.muted
          ? "Sound: Off"
          : "Sound: On";
    }

  }

  function showControls() {

    videoHero.classList.add("show-controls");

    clearTimeout(controlsTimer);

    controlsTimer = setTimeout(() => {

      videoHero.classList.remove(
        "show-controls"
      );

    }, 2500);

  }

  videoHero.addEventListener(
    "mousemove",
    showControls
  );

  videoHero.addEventListener(
    "click",
    showControls
  );

  if (playPauseBtn) {

    playPauseBtn.addEventListener(
      "click",
      async () => {

        if (video.paused) {

          try {

            await video.play();

          } catch (err) {

            console.error(err);

          }

        } else {

          video.pause();

        }

        updateButtons();

      }
    );

  }

  if (backBtn) {

    backBtn.addEventListener(
      "click",
      () => {

        video.currentTime =
          Math.max(
            0,
            video.currentTime - 5
          );

      }
    );

  }

  if (forwardBtn) {

    forwardBtn.addEventListener(
      "click",
      () => {

        video.currentTime =
          Math.min(
            video.duration || 999999,
            video.currentTime + 5
          );

      }
    );

  }

  if (muteBtn) {

    muteBtn.addEventListener(
      "click",
      () => {

        video.muted = !video.muted;

        updateButtons();

      }
    );

  }

  video.muted = true;

  updateButtons();

}


/* ==========================================
   SMOOTH SCROLL
========================================== */

function initScroll() {

  document
    .querySelectorAll("[data-scroll]")
    .forEach(link => {

      link.addEventListener(
        "click",
        e => {

          const target =
            document.querySelector(
              link.dataset.scroll
            );

          if (!target) return;

          e.preventDefault();

          target.scrollIntoView({
            behavior:"smooth"
          });

        }
      );

    });

}


/* ==========================================
   ESTIMATE FORM
========================================== */

function initEstimateForm() {

  const form =
    document.getElementById(
      "estimate-form"
    );

  const submitBtn =
    document.getElementById(
      "estimate-submit"
    );

  if (!form) {
    console.error(
      "estimate-form not found"
    );
    return;
  }

  form.addEventListener(
    "submit",
    async e => {

      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {

        const response =
          await fetch(
            "/api/estimate",
            {
              method:"POST",
              body:new FormData(form)
            }
          );

        if (!response.ok) {

          throw new Error(
            "Estimate request failed"
          );

        }

        alert(
          "Estimate request submitted successfully."
        );

        form.reset();

      } catch(error) {

        console.error(error);

        alert(
          "Estimate form failed. Check the browser console and verify /api/estimate exists."
        );

      }

      if (submitBtn) {
        submitBtn.disabled = false;
      }

    }
  );

}


/* ==========================================
   REVIEW FORM
========================================== */

function initReviewForm() {

  const form =
    document.getElementById(
      "review-form"
    );

  const submitBtn =
    document.getElementById(
      "review-submit"
    );

  if (!form) return;

  form.addEventListener(
    "submit",
    async e => {

      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
      }

      try {

        const response =
          await fetch(
            "/api/reviews",
            {
              method:"POST",
              body:new FormData(form)
            }
          );

        if (!response.ok) {

          throw new Error(
            "Review submission failed"
          );

        }

        alert(
          "Review submitted successfully."
        );

        form.reset();

      } catch(error) {

        console.error(error);

        alert(
          "Review submission failed."
        );

      }

      if (submitBtn) {
        submitBtn.disabled = false;
      }

    }
  );

}


/* ==========================================
   CONTACT POPUP
========================================== */

function initContactPopup() {

  const contactBtn =
    document.getElementById(
      "contact-now-btn"
    );

  const popup =
    document.getElementById(
      "contact-popup"
    );

  const closeBtn =
    document.getElementById(
      "close-contact"
    );

  if (
    !contactBtn ||
    !popup ||
    !closeBtn
  ) {
    return;
  }

  popup.style.display = "none";

  contactBtn.addEventListener(
    "click",
    () => {

      popup.style.display =
        "flex";

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      popup.style.display =
        "none";

    }
  );

  popup.addEventListener(
    "click",
    e => {

      if (e.target === popup) {

        popup.style.display =
          "none";

      }

    }
  );

}


/* ==========================================
   MAIN MENU
========================================== */

function initMenu() {

  const logo =
    document.getElementById(
      "main-logo"
    );

  const menu =
    document.getElementById(
      "main-menu"
    );

  const closeBtn =
    document.getElementById(
      "main-menu-close"
    );

  if (
    !logo ||
    !menu ||
    !closeBtn
  ) {
    return;
  }

  logo.addEventListener(
    "click",
    () => {

      menu.classList.add("open");

    }
  );

  closeBtn.addEventListener(
    "click",
    () => {

      menu.classList.remove("open");

    }
  );

}


/* ==========================================
   LOAD PRICING
========================================== */

async function loadPricing() {

  const container =
    document.getElementById(
      "climb-pricing-content"
    );

  if (!container) return;

  try {

    const response =
      await fetch(
        "/climbing-class/public/pages/pricing.html"
      );

    if (!response.ok) return;

    const html =
      await response.text();

    container.innerHTML = html;

  } catch(error) {

    console.error(
      "Pricing load failed",
      error
    );

  }

}


/* ==========================================
   START
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    initVideo();

    initScroll();

    initEstimateForm();

    initReviewForm();

    initContactPopup();

    initMenu();

    loadPricing();

  }
);

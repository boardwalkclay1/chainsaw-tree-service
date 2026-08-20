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
   BACKGROUND ROTATION ENGINE
============================ */
function initBackgroundRotation() {
  const frames = [
    { type: "photo", src: "/img/climb-logo.jpg" },
    { type: "photo", src: "/img/tree-service-logo.png" },
    { type: "photo", src: "/img/your-photo-here.jpg" }, // <-- CHANGE THIS
    { type: "video", src: "/videos/your-video-1.mp4" },
    { type: "video", src: "/videos/your-video-2.mp4" }
  ];

  const bgLock = document.getElementById("bg-lock");
  if (!bgLock) return;

  const elements = [];
  let index = 0;

  frames.forEach(frame => {
    if (frame.type === "photo") {
      const div = document.createElement("div");
      div.className = "bg-frame";
      div.style.backgroundImage = `url('${frame.src}')`;
      bgLock.appendChild(div);
      elements.push(div);
    } else {
      const video = document.createElement("video");
      video.className = "bg-video";
      video.src = frame.src;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      bgLock.appendChild(video);
      elements.push(video);
    }
  });

  if (!elements.length) return;

  elements[0].classList.add("active");

  setInterval(() => {
    elements[index].classList.remove("active");
    index = (index + 1) % elements.length;
    elements[index].classList.add("active");
  }, 9000);
}

/* ============================
   LEAVES FALLING
============================ */
function initLeaves() {
  const layer = document.getElementById("leaves-layer");
  if (!layer) return;

  function spawnLeaf() {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = Math.random() * 100 + "vw";
    leaf.style.animationDuration = 4 + Math.random() * 6 + "s";
    layer.appendChild(leaf);
    setTimeout(() => leaf.remove(), 12000);
  }

  setInterval(spawnLeaf, 350);
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
  initBackgroundRotation();   // <-- THIS WAS MISSING
  initLeaves();               // <-- THIS WAS MISSING
  initScroll();
  initVideoControls();
  loadDropdownContent();
  initEstimateForm();
});

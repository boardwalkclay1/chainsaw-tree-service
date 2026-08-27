/* ============================
   SIDEBAR OPEN/CLOSE
   ============================ */
function toggleSidebar() {
  const bar = document.getElementById("sidebar");
  bar.classList.toggle("open");
}

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");

  // Add close button once
  const closeBtn = document.createElement("div");
  closeBtn.id = "sidebar-close";
  closeBtn.textContent = "✕";
  closeBtn.onclick = () => sidebar.classList.remove("open");
  sidebar.appendChild(closeBtn);
});

/* ============================
   FLOATING LEAVES
   ============================ */
(function generateLeaves() {
  const container = document.getElementById("leaf-container");
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = Math.random() * 100 + "vw";
    leaf.style.animationDuration = (4 + Math.random() * 6) + "s";
    container.appendChild(leaf);
  }
})();

/* ============================
   SQUIRREL CHAT TOGGLE
   ============================ */
const squirrelBtn = document.getElementById("squirrelChatBtn");
const squirrelBubble = document.getElementById("squirrelBubble");

if (squirrelBtn && squirrelBubble) {
  squirrelBtn.onclick = () => {
    squirrelBubble.classList.toggle("open");
  };
}

/* ============================
   INPUT HANDOFF TO SQUIRREL.JS
   ============================ */
const squirrelInput = document.getElementById("squirrelInput");
const squirrelMessages = document.getElementById("squirrelMessages");

if (squirrelInput && squirrelMessages) {
  squirrelInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const msg = squirrelInput.value.trim();
      if (!msg) return;

      // Display user message
      const div = document.createElement("div");
      div.textContent = "You: " + msg;
      squirrelMessages.appendChild(div);
      squirrelMessages.scrollTop = squirrelMessages.scrollHeight;

      // Hand off to squirrel.js brain
      if (typeof squirrelBrain === "function") {
        const reply = squirrelBrain(msg);
        const r = document.createElement("div");
        r.textContent = reply;
        squirrelMessages.appendChild(r);
        squirrelMessages.scrollTop = squirrelMessages.scrollHeight;
      }

      squirrelInput.value = "";
    }
  });
}

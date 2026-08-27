/* ============================
   SIDEBAR TOGGLE
   ============================ */
function toggleSidebar() {
  const bar = document.getElementById("sidebar");
  bar.classList.toggle("open");
}

/* ============================
   FLOATING LEAVES
   ============================ */
(function generateLeaves() {
  const container = document.getElementById("leaf-container");
  for (let i = 0; i < 25; i++) {
    const leaf = document.createElement("div");
    leaf.className = "leaf";
    leaf.style.left = Math.random() * 100 + "vw";
    leaf.style.animationDuration = (4 + Math.random() * 6) + "s";
    container.appendChild(leaf);
  }
})();

/* ============================
   FLOATING SQUIRREL CHAT BRAIN
   ============================ */
const squirrelBtn = document.getElementById("squirrelChatBtn");
const squirrelBubble = document.getElementById("squirrelBubble");
const squirrelMessages = document.getElementById("squirrelMessages");
const squirrelInput = document.getElementById("squirrelInput");

squirrelBtn.onclick = () => {
  squirrelBubble.classList.toggle("open");
};

squirrelInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const msg = squirrelInput.value.trim();
    if (!msg) return;

    addSquirrelMessage("You: " + msg);
    squirrelInput.value = "";

    // SQUIRREL BRAIN RESPONSE
    setTimeout(() => {
      addSquirrelMessage(squirrelBrain(msg));
    }, 300);
  }
});

function addSquirrelMessage(text) {
  const div = document.createElement("div");
  div.textContent = text;
  squirrelMessages.appendChild(div);
  squirrelMessages.scrollTop = squirrelMessages.scrollHeight;
}

/* ============================
   SQUIRREL AI BRAIN
   ============================ */
function squirrelBrain(input) {
  input = input.toLowerCase();

  if (input.includes("price")) return "Pricing depends on class type — check the pricing page!";
  if (input.includes("gear")) return "Gear starts with harness, lifeline, carabiners, and friction hitch.";
  if (input.includes("throwball")) return "Throwball mastery is all about anchor selection and clean throws.";
  if (input.includes("class")) return "Classes run weekly — check the schedule!";
  if (input.includes("app")) return "The app has videos, quizzes, and breakdowns for every climbing skill.";
  if (input.includes("help")) return "I can help with classes, knots, gear, rigging, or app info.";

  return "Got it! Ask me anything about climbing, gear, knots, rigging, or classes.";
}

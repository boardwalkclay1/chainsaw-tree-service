// 🐿️ Helper Squirrel Brain v1.0
// File: public/js/squirrel.js
// Uses: /public/js/squirrel-data.json
// Purpose: Front-end chat logic + intent matching + UI for Helper Squirrel

(function() {
  const chatBtn = document.getElementById("squirrelChatBtn");
  const chatBox = document.getElementById("squirrelChatBox");
  const messagesEl = document.getElementById("squirrelMessages");
  const inputEl = document.getElementById("squirrelInput");

  let squirrelData = null;
  let conversationHistory = [];

  // -----------------------------
  // 1. LOAD SQUIRREL DATA (JSON)
  // -----------------------------
  async function loadSquirrelData() {
    try {
      const res = await fetch("/public/js/squirrel-data.json");
      squirrelData = await res.json();
      logSystem("Squirrel data loaded.");
    } catch (err) {
      console.error("Error loading squirrel data:", err);
      logSystem("I had trouble loading my brain. Some answers might be limited.");
    }
  }

  // -----------------------------
  // 2. BASIC UI TOGGLE
  // -----------------------------
  if (chatBtn) {
    chatBtn.addEventListener("click", () => {
      if (!chatBox) return;
      const isVisible = chatBox.style.display === "block";
      chatBox.style.display = isVisible ? "none" : "block";
      if (!isVisible) {
        scrollMessages();
      }
    });
  }

  if (inputEl) {
    inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const text = inputEl.value.trim();
        if (!text) return;
        handleUserMessage(text);
        inputEl.value = "";
      }
    });
  }

  // -----------------------------
  // 3. MESSAGE HELPERS
  // -----------------------------
  function addMessage(text, sender = "squirrel") {
    if (!messagesEl) return;
    const div = document.createElement("div");
    div.style.marginBottom = "8px";

    if (sender === "user") {
      div.style.textAlign = "right";
      div.style.color = "#00c853";
      div.textContent = `You: ${text}`;
    } else if (sender === "system") {
      div.style.fontSize = "12px";
      div.style.opacity = "0.7";
      div.textContent = text;
    } else {
      div.textContent = `Helper Squirrel: ${text}`;
    }

    messagesEl.appendChild(div);
    scrollMessages();
  }

  function scrollMessages() {
    if (!messagesEl) return;
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function logSystem(text) {
    addMessage(text, "system");
  }

  // -----------------------------
  // 4. HANDLE USER MESSAGE
  // -----------------------------
  function handleUserMessage(text) {
    addMessage(text, "user");
    conversationHistory.push({ role: "user", text });

    const lower = text.toLowerCase();

    // 4.1 Quick exits / resets
    if (lower === "clear" || lower === "reset") {
      messagesEl.innerHTML = "";
      addMessage("Chat cleared. Ask me anything again!", "squirrel");
      conversationHistory = [];
      return;
    }

    // 4.2 If data not loaded yet
    if (!squirrelData) {
      addMessage("I’m still waking up. Try again in a second.", "squirrel");
      return;
    }

    // 4.3 Route to intent engine
    const reply = findBestReply(lower);
    addMessage(reply, "squirrel");
    conversationHistory.push({ role: "squirrel", text: reply });
  }

  // -----------------------------
  // 5. INTENT ENGINE
  // -----------------------------
  function findBestReply(lower) {
    // 5.1 Hard-coded emergency / safety
    if (containsAny(lower, ["emergency", "hurt", "injured", "bleeding", "hospital"])) {
      return squirrelData.systemMessages.emergency || 
        "If this is an emergency or someone is hurt, stop and call 911 or local emergency services immediately.";
    }

    // 5.2 Pricing / money
    if (containsAny(lower, ["price", "prices", "cost", "how much", "fee", "pay", "deposit"])) {
      return handlePricingIntent(lower);
    }

    // 5.3 Classes / schedule
    if (containsAny(lower, ["class", "classes", "schedule", "group", "1-on-1", "one on one", "premium package"])) {
      return handleClassesIntent(lower);
    }

    // 5.4 Digital training / app
    if (containsAny(lower, ["app", "digital", "videos", "training", "online", "course", "courses"])) {
      return handleDigitalIntent(lower);
    }

    // 5.5 Knots
    if (containsAny(lower, ["knot", "knots", "friction hitch", "blake", "prusik", "vt", "hitch"])) {
      return handleKnotsIntent(lower);
    }

    // 5.6 Climbing techniques
    if (containsAny(lower, ["climb", "climbing", "body thrust", "footlock", "footlocking", "spike", "spiking", "rope walking", "srs", "mrs"])) {
      return handleClimbingIntent(lower);
    }

    // 5.7 Rigging / cutting
    if (containsAny(lower, ["rigging", "rig", "lowering", "cutting", "chainsaw", "saw", "negative rigging", "speedline"])) {
      return handleRiggingIntent(lower);
    }

    // 5.8 Business / jobs / pricing jobs
    if (containsAny(lower, ["business", "job", "jobs", "price jobs", "quote", "estimate", "customer", "liability"])) {
      return handleBusinessIntent(lower);
    }

    // 5.9 Refunds / deposits / policy
    if (containsAny(lower, ["refund", "refundable", "non refundable", "policy", "cancel", "cancellation"])) {
      return handlePolicyIntent(lower);
    }

    // 5.10 Account / login / access
    if (containsAny(lower, ["account", "login", "password", "access", "unlock", "how do i get in"])) {
      return handleAccountIntent(lower);
    }

    // 5.11 General FAQ
    const faqReply = matchFromSection(lower, squirrelData.faq);
    if (faqReply) return faqReply;

    // 5.12 Fallback small talk
    const smallTalkReply = matchFromSection(lower, squirrelData.smallTalk);
    if (smallTalkReply) return smallTalkReply;

    // 5.13 Final fallback
    return squirrelData.systemMessages.fallback ||
      "I’m not fully sure about that one yet, but I can explain classes, pricing, knots, climbing techniques, business skills, or the training app.";
  }

  // -----------------------------
  // 6. INTENT HANDLERS
  // -----------------------------

  function handlePricingIntent(lower) {
    // Direct “what are the prices”
    if (containsAny(lower, ["what are the prices", "prices", "how much", "cost"])) {
      return squirrelData.pricing.overview;
    }

    if (containsAny(lower, ["group", "group class"])) {
      return squirrelData.pricing.groupClass;
    }

    if (containsAny(lower, ["1-on-1", "one on one", "personal"])) {
      return squirrelData.pricing.personalTraining;
    }

    if (containsAny(lower, ["500", "$500", "beginner package"])) {
      return squirrelData.pricing.package500;
    }

    if (containsAny(lower, ["700", "$700", "intermediate package"])) {
      return squirrelData.pricing.package700;
    }

    if (containsAny(lower, ["1000", "$1000", "full arborist"])) {
      return squirrelData.pricing.package1000;
    }

    if (containsAny(lower, ["digital", "videos", "online", "subscription"])) {
      return squirrelData.pricing.digitalOverview;
    }

    if (containsAny(lower, ["single video", "one video", "20", "$20"])) {
      return squirrelData.pricing.digitalSingle;
    }

    if (containsAny(lower, ["two videos", "2 videos", "bundle", "30", "$30"])) {
      return squirrelData.pricing.digitalTwoPack;
    }

    if (containsAny(lower, ["four videos", "4 videos", "40", "$40"])) {
      return squirrelData.pricing.digitalFourPack;
    }

    if (containsAny(lower, ["deposit", "half", "50%", "non refundable"])) {
      return squirrelData.pricing.deposits;
    }

    return squirrelData.pricing.overview;
  }

  function handleClassesIntent(lower) {
    if (containsAny(lower, ["group", "group class"])) {
      return squirrelData.classes.groupClass;
    }

    if (containsAny(lower, ["personal", "1-on-1", "one on one"])) {
      return squirrelData.classes.personalTraining;
    }

    if (containsAny(lower, ["premium", "package", "gear"])) {
      return squirrelData.classes.premiumPackages;
    }

    if (containsAny(lower, ["schedule", "calendar", "openings"])) {
      return squirrelData.classes.schedule;
    }

    if (containsAny(lower, ["what do i learn", "learn", "skills"])) {
      return squirrelData.classes.whatYouLearn;
    }

    return squirrelData.classes.overview;
  }

  function handleDigitalIntent(lower) {
    if (containsAny(lower, ["app", "training app", "install"])) {
      return squirrelData.digital.appInstall;
    }

    if (containsAny(lower, ["digital", "videos", "online"])) {
      return squirrelData.digital.overview;
    }

    if (containsAny(lower, ["discount", "10%", "20%", "rewards"])) {
      return squirrelData.digital.rewards;
    }

    if (containsAny(lower, ["access", "how long", "expire", "lifetime"])) {
      return squirrelData.digital.access;
    }

    return squirrelData.digital.overview;
  }

  function handleKnotsIntent(lower) {
    if (containsAny(lower, ["basic", "beginner"])) {
      return squirrelData.knots.basic;
    }

    if (containsAny(lower, ["friction hitch", "hitch", "prusik", "blake", "vt"])) {
      return squirrelData.knots.friction;
    }

    if (containsAny(lower, ["rigging knots", "rigging"])) {
      return squirrelData.knots.rigging;
    }

    return squirrelData.knots.overview;
  }

  function handleClimbingIntent(lower) {
    if (containsAny(lower, ["body thrust", "body thrusting"])) {
      return squirrelData.climbing.bodyThrust;
    }

    if (containsAny(lower, ["footlock", "footlocking"])) {
      return squirrelData.climbing.footlock;
    }

    if (containsAny(lower, ["spike", "spiking"])) {
      return squirrelData.climbing.spiking;
    }

    if (containsAny(lower, ["srs", "single rope", "stationary rope"])) {
      return squirrelData.climbing.srs;
    }

    if (containsAny(lower, ["mrs", "moving rope", "doubled rope"])) {
      return squirrelData.climbing.mrs;
    }

    if (containsAny(lower, ["rope walking", "ropewalker"])) {
      return squirrelData.climbing.ropeWalking;
    }

    return squirrelData.climbing.overview;
  }

  function handleRiggingIntent(lower) {
    if (containsAny(lower, ["basic rigging", "beginner rigging"])) {
      return squirrelData.rigging.basic;
    }

    if (containsAny(lower, ["negative rigging"])) {
      return squirrelData.rigging.negative;
    }

    if (containsAny(lower, ["speedline"])) {
      return squirrelData.rigging.speedline;
    }

    if (containsAny(lower, ["cutting", "chainsaw", "saw"])) {
      return squirrelData.rigging.cutting;
    }

    return squirrelData.rigging.overview;
  }

  function handleBusinessIntent(lower) {
    if (containsAny(lower, ["price jobs", "quote", "estimate"])) {
      return squirrelData.business.pricingJobs;
    }

    if (containsAny(lower, ["customer", "client"])) {
      return squirrelData.business.customers;
    }

    if (containsAny(lower, ["jobsite", "crew", "flow"])) {
      return squirrelData.business.jobsiteFlow;
    }

    if (containsAny(lower, ["liability", "safety"])) {
      return squirrelData.business.liability;
    }

    return squirrelData.business.overview;
  }

  function handlePolicyIntent(lower) {
    if (containsAny(lower, ["refund", "refundable"])) {
      return squirrelData.policy.refunds;
    }

    if (containsAny(lower, ["deposit", "non refundable"])) {
      return squirrelData.policy.deposits;
    }

    if (containsAny(lower, ["cancel", "cancellation"])) {
      return squirrelData.policy.cancellations;
    }

    return squirrelData.policy.overview;
  }

  function handleAccountIntent(lower) {
    if (containsAny(lower, ["login", "password"])) {
      return squirrelData.account.login;
    }

    if (containsAny(lower, ["access", "unlock"])) {
      return squirrelData.account.access;
    }

    if (containsAny(lower, ["email", "contact"])) {
      return squirrelData.account.contact;
    }

    return squirrelData.account.overview;
  }

  // -----------------------------
  // 7. GENERIC MATCHING HELPERS
  // -----------------------------
  function containsAny(text, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (text.includes(arr[i])) return true;
    }
    return false;
  }

  function matchFromSection(lower, section) {
    if (!section || !Array.isArray(section)) return null;
    for (let i = 0; i < section.length; i++) {
      const entry = section[i];
      if (!entry || !entry.keywords || !entry.reply) continue;
      if (entry.keywords.some(k => lower.includes(k))) {
        return entry.reply;
      }
    }
    return null;
  }

  // -----------------------------
  // 8. INIT
  // -----------------------------
  loadSquirrelData();

})();

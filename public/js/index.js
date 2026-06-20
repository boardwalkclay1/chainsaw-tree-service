// =========================
// Chainsaw Clay's Tree Service + Climbing Class
// =========================

// HERO SECTION
const hero = `
<section id="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <img src="img/tree-service-logo.png" class="hero-logo">
    <h1>Chainsaw Clay's Tree Service</h1>
    <p class="hero-tagline">Professional Tree Care • Real Experience • Real Results</p>
    <p class="hero-description">
      High‑level climbing, safe removals, precision pruning, storm cleanup, gardening, and now
      <strong>professional climbing classes</strong> taught by a real climber with 10+ years in the canopy.
    </p>
    <div class="hero-buttons">
      <button class="btn primary" data-scroll="#estimate">Request Estimate</button>
      <button class="btn secondary" data-scroll="#climbing-class">Climbing Class Info</button>
    </div>
  </div>
</section>
`;

// DIFFERENCE SECTION
const difference = `
<section id="features">
  <h2>What Makes Us Different</h2>
  <div class="features-grid">
    <div class="feature-card"><h3>High‑Level Climbing</h3><p>Advanced rigging and canopy navigation.</p></div>
    <div class="feature-card"><h3>Tree Health Tech</h3><p>Movement analysis and structure evaluation.</p></div>
    <div class="feature-card"><h3>Storm Cleanup</h3><p>Fast, safe, and precise emergency cleanup.</p></div>
    <div class="feature-card"><h3>Full Yard Planning</h3><p>Flowers, shrubs, fruit trees, and layouts.</p></div>
    <div class="feature-card"><h3>Advanced Tools</h3><p>Measurement tools and yard designer modules.</p></div>
    <div class="feature-card"><h3>Tech‑Powered Service</h3><p>Digital estimates and visual planning.</p></div>
  </div>
</section>
`;

// ESTIMATE SECTION
const estimate = `
<section id="estimate">
  <h2>Request an Estimate</h2>
  <form id="estimate-form">
    <input type="text" placeholder="Your Name" required>
    <input type="email" placeholder="Email" required>
    <input type="text" placeholder="Service Needed" required>
    <textarea placeholder="Describe your project"></textarea>
    <button type="submit" class="btn primary">Submit</button>
  </form>
</section>
`;

// CLIMBING CLASS SECTION
const climbingClass = `
<section id="climbing-class">
  <h2>Chainsaw Clay’s Tree Climbing Class</h2>
  <img src="img/climbing-class-logo.png" alt="Climbing Class Logo" class="climb-logo">
  <p class="climb-small">
    Learn real climbing from a real climber — gear, knots, movement, safety, and canopy flow.
  </p>
  <details class="climb-details">
    <summary>Full Class Description</summary>
    <div class="climb-description">
      <p>
        The Chainsaw Clay Climbing Class is a hands‑on, real‑world training experience designed for
        beginners, homeowners, and future arborists. You’ll learn:
      </p>
      <ul>
        <li>Rope setup, knots, and climbing systems</li>
        <li>Movement, balance, and canopy flow</li>
        <li>Gear selection and safety fundamentals</li>
        <li>Tree structure, anchor points, and load awareness</li>
        <li>How to climb confidently and safely</li>
      </ul>
      <p>
        Classes are available as group workshops or personal 1‑on‑1 sessions.  
        All training is based on real climbing experience — not theory.
      </p>
    </div>
  </details>
</section>
`;

// FOOTER SECTION
const footer = `
<footer id="footer">
  <p>© 2026 Chainsaw Clay’s Tree Service • All Rights Reserved</p>
  <p>Email: boardwalkclay1@gmail.com | Phone: (470)‑695‑2055</p>
</footer>
`;

// =========================
// PAGE RENDER
// =========================
const app = document.getElementById("app");
app.innerHTML = hero + difference + estimate + climbingClass + footer;

// =========================
– SCROLL LOGIC ONLY
// =========================
function initScroll() {
  document.querySelectorAll("[data-scroll]").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("data-scroll"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

initScroll();

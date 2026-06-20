// Smooth scroll
function initScroll() {
  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("data-scroll"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

// Estimate form -> Worker
function initEstimateForm() {
  const form = document.getElementById("estimate-form");
  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      // Tree service + climbing classes can share this worker endpoint
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

document.addEventListener("DOMContentLoaded", function () {
  initScroll();
  initEstimateForm();
});

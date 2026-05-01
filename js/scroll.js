export default function initScroll() {
  document.addEventListener("click", (e) => {
    const target = e.target.closest("[data-scroll]");
    if (!target) return;
    const selector = target.getAttribute("data-scroll");
    if (!selector) return;
    const el = document.querySelector(selector);
    if (!el) return;
    e.preventDefault();
    const rect = el.getBoundingClientRect();
    const offset = window.scrollY + rect.top - 70;
    window.scrollTo({ top: offset, behavior: "smooth" });
  });
}

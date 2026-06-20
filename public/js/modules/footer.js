export default function footer() {
  return `
    <footer id="footer">
      <h2>Ready to Talk About Your Trees?</h2>
      <p>Email: boardwalkclay1@gmail.com</p>
      <p>Phone: 678‑683‑0570</p>
      <p>&copy; <span id="year"></span> Chainsaw Clay’s Tree Service</p>
    </footer>
    <script>
      document.getElementById("year").textContent = new Date().getFullYear();
    </script>
  `;
}

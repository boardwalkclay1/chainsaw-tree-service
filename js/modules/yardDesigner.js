export default function yardDesigner() {
  return `
    <section id="yard-designer">
      <h2>Visual Yard Designer</h2>
      <p class="section-intro">
        Upload a photo of your yard and start placing flowers, shrubs, and beds to see how it
        could look before anything is planted.
      </p>

      <div class="yard-designer-wrapper">
        <div class="yard-designer-toolbar">
          <input type="file" id="yard-photo-input" accept="image/*">
          <select id="yard-element-select">
            <option value="">Add element…</option>
            <option value="flower">Flower cluster</option>
            <option value="shrub">Shrub</option>
            <option value="tree">Small tree</option>
            <option value="bed">Flower bed</option>
          </select>
          <button class="btn ghost" id="yard-clear">Clear</button>
        </div>

        <div class="yard-designer-canvas-wrapper">
          <canvas id="yard-canvas" width="900" height="500"></canvas>
        </div>
      </div>

      <script type="module">
        const canvas = document.getElementById("yard-canvas");
        const ctx = canvas.getContext("2d");
        const input = document.getElementById("yard-photo-input");
        const select = document.getElementById("yard-element-select");
        const clearBtn = document.getElementById("yard-clear");

        let backgroundImage = null;
        const elements = [];

        input.addEventListener("change", (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const url = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            backgroundImage = img;
            draw();
          };
          img.src = url;
        });

        select.addEventListener("change", () => {
          const type = select.value;
          if (!type) return;
          elements.push({
            type,
            x: canvas.width / 2 + (Math.random() * 80 - 40),
            y: canvas.height / 2 + (Math.random() * 40 - 20),
          });
          draw();
          select.value = "";
        });

        clearBtn.addEventListener("click", () => {
          backgroundImage = null;
          elements.length = 0;
          draw();
        });

        function draw() {
          ctx.fillStyle = "#050608";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          if (backgroundImage) {
            const scale = Math.min(
              canvas.width / backgroundImage.width,
              canvas.height / backgroundImage.height
            );
            const w = backgroundImage.width * scale;
            const h = backgroundImage.height * scale;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2;
            ctx.drawImage(backgroundImage, x, y, w, h);
          }

          elements.forEach((el) => {
            if (el.type === "flower") {
              ctx.fillStyle = "#ff6fb5";
              ctx.beginPath();
              ctx.arc(el.x, el.y, 10, 0, Math.PI * 2);
              ctx.fill();
            } else if (el.type === "shrub") {
              ctx.fillStyle = "#3fd46b";
              ctx.beginPath();
              ctx.arc(el.x, el.y, 14, 0, Math.PI * 2);
              ctx.fill();
            } else if (el.type === "tree") {
              ctx.fillStyle = "#2b8f3a";
              ctx.beginPath();
              ctx.arc(el.x, el.y, 18, 0, Math.PI * 2);
              ctx.fill();
            } else if (el.type === "bed") {
              ctx.strokeStyle = "#f5f7fb";
              ctx.lineWidth = 2;
              ctx.strokeRect(el.x - 30, el.y - 12, 60, 24);
            }
          });
        }

        draw();
      </script>
    </section>
  `;
}

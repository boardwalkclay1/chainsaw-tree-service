export default function gardening() {
  return `
    <section id="gardening">
      <h2>Gardening & Planting Planner</h2>
      <p class="section-intro">
        Use this to tell us what kind of yard you want — more color, more privacy, more food,
        or just something that feels better to be in.
      </p>

      <form id="gardening-form">
        <div class="form-row">
          <label for="goal">Main goal</label>
          <select id="goal" name="goal">
            <option value="">Select one</option>
            <option>More flowers and color</option>
            <option>More privacy / screening</option>
            <option>Fruit trees and food</option>
            <option>Low maintenance</option>
            <option>Full redesign</option>
          </select>
        </div>

        <div class="form-row">
          <label for="sun">Sun & shade</label>
          <select id="sun" name="sun">
            <option value="">Select one</option>
            <option>Mostly full sun</option>
            <option>Mixed sun and shade</option>
            <option>Mostly shade</option>
          </select>
        </div>

        <div class="form-row">
          <label for="region">Region / climate</label>
          <input id="region" name="region" type="text" placeholder="City or general region">
        </div>

        <div class="form-row">
          <label for="gardenDetails">Anything else we should know?</label>
          <textarea id="gardenDetails" name="gardenDetails" placeholder="Favorite colors, plants you like, things you don’t want, etc."></textarea>
        </div>

        <div class="form-row">
          <label for="yardPhotos">Yard photos (optional)</label>
          <input id="yardPhotos" name="yardPhotos" type="file" accept="image/*" multiple>
        </div>

        <button type="submit" class="btn secondary">Send Gardening Info</button>
        <div id="gardening-status"></div>
      </form>
    </section>
  `;
}

export default function estimate() {
  return `
    <section id="estimate">
      <h2>Request a Tree & Yard Estimate</h2>
      <p class="section-intro">
        Tell us what you’re seeing, what you’re worried about, and what you’d like to do with
        your yard. Attach photos if you have them — they help a lot.
      </p>

      <form id="estimate-form">
        <div class="form-row">
          <label for="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your name">
        </div>

        <div class="form-row">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@example.com">
        </div>

        <div class="form-row">
          <label for="phone">Phone</label>
          <input id="phone" name="phone" type="tel" placeholder="(555) 123‑4567">
        </div>

        <div class="form-row">
          <label for="address">Address (City / Area)</label>
          <input id="address" name="address" type="text" placeholder="Neighborhood or city">
        </div>

        <div class="form-row">
          <label for="serviceType">What do you need?</label>
          <select id="serviceType" name="serviceType">
            <option value="">Select one</option>
            <option>Tree removal</option>
            <option>Pruning / trimming</option>
            <option>Storm cleanup</option>
            <option>Tree health evaluation</option>
            <option>Gardening / planting</option>
            <option>Fruit trees / beds</option>
            <option>General yard planning</option>
          </select>
        </div>

        <div class="form-row">
          <label for="details">Describe what’s going on</label>
          <textarea id="details" name="details" placeholder="Leaning tree, dead limbs, over house, want to add flowers, etc."></textarea>
        </div>

        <div class="form-row">
          <label for="photos">Photos (optional)</label>
          <input id="photos" name="photos" type="file" accept="image/*" multiple>
        </div>

        <button type="submit" class="btn primary">Submit Estimate Request</button>
        <div id="estimate-status"></div>
      </form>
    </section>
  `;
}

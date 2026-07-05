/* ============================================================
   GLOBAL PAYWALL SYSTEM — Chainsaw Clay
   One PayPal link, unlimited unlock logic
   ============================================================ */

const Paywall = {
  paypalLink: "",   // <-- YOU SET THIS ONCE

  /* ============================================================
     SET PAYPAL LINK
     ============================================================ */
  setPaypalLink(link) {
    this.paypalLink = link;
  },

  /* ============================================================
     CHECK UNLOCK STATUS
     ============================================================ */
  isUnlocked(key) {
    return localStorage.getItem(key) === "true";
  },

  /* ============================================================
     UNLOCK ANY ITEM
     ============================================================ */
  unlock(key) {
    localStorage.setItem(key, "true");
  },

  /* ============================================================
     FULL COURSE OVERRIDES INDIVIDUAL
     ============================================================ */
  hasFullAccess(courseKey) {
    return this.isUnlocked(courseKey);
  },

  /* ============================================================
     HANDLE PURCHASE CLICK
     ============================================================ */
  purchase(amount) {
    if (!this.paypalLink) {
      alert("PayPal link not set.");
      return;
    }

    // Auto-fill amount into your PayPal.Me link
    const url = `${this.paypalLink}/${amount}`;
    window.open(url, "_blank");
  },

  /* ============================================================
     RENDER PAYWALL BLOCK
     ============================================================ */
  renderLock(containerId, unlockKey, fullKey, price, title) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const fullUnlocked = this.hasFullAccess(fullKey);
    const unlocked = this.isUnlocked(unlockKey);

    if (fullUnlocked || unlocked) {
      container.innerHTML = `
        <div class="unlocked">
          <h3>${title}</h3>
          <p>Unlocked</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="locked">
        <h3>${title}</h3>
        <p>Locked</p>
        <button onclick="Paywall.purchase(${price})">Unlock for $${price}</button>
        <button onclick="Paywall.purchase(${price * 4})">Unlock Full Course</button>
      </div>
    `;
  }
};

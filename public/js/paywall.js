/* ============================================================
   GLOBAL PAYWALL SYSTEM — CLEAN VERSION
   Access logic handled ONLY by Auth.js + Worker
   ============================================================ */

const Paywall = {
  paypalLink: "",
  userId: "",

  /* ============================
     CONFIG
     ============================ */
  setPaypalLink(link) {
    this.paypalLink = link;
  },

  setUser(id) {
    this.userId = id;
  },

  /* ============================
     PURCHASE → PayPal
     ============================ */
  purchase(amount) {
    const url = `${this.paypalLink}/${amount}`;
    window.open(url, "_blank");
  },

  /* ============================
     UNLOCK (writes to D1)
     Auth.js will verify access
     ============================ */
  async unlock(itemKey) {
    const res = await fetch("https://api.chainsawclay.com/api/access/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: this.userId,
        item_key: itemKey
      })
    });

    const data = await res.json();
    return data.success === true;
  }
};

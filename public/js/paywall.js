/* ============================================================
   GLOBAL PAYWALL SYSTEM — DATABASE VERSION
   ============================================================ */

const Paywall = {
  paypalLink: "",
  userId: "",

  setPaypalLink(link) {
    this.paypalLink = link;
  },

  setUser(id) {
    this.userId = id;
  },

  async hasAccess(itemKey) {
    const res = await fetch("https://api.chainsawclay.com/api/access/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: this.userId,
        item_key: itemKey
      })
    });

    const data = await res.json();
    return data.access === true;
  },

  async unlock(itemKey) {
    await fetch("https://api.chainsawclay.com/api/access/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: this.userId,
        item_key: itemKey
      })
    });
  },

  purchase(amount) {
    const url = `${this.paypalLink}/${amount}`;
    window.open(url, "_blank");
  }
};

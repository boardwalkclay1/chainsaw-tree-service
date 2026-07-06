/* ============================================================
   GLOBAL AUTH SYSTEM — D1-backed
   Uses /api/auth/login and /api/auth/me
   ============================================================ */

const Auth = {
  tokenKey: "chainsaw_auth_token",
  userKey: "chainsaw_auth_user",

  /* ============================
     TOKEN STORAGE
     ============================ */
  getToken() {
    return localStorage.getItem(this.tokenKey) || "";
  },

  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  },

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  },

  /* ============================
     USER STORAGE
     ============================ */
  getUser() {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  },

  /* ============================
     LOGIN
     ============================ */
  async login(email, password) {
    const res = await fetch("https://api.chainsawclay.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();

    // Expecting { token, user }
    if (data.token) this.setToken(data.token);
    if (data.user) this.setUser(data.user);

    return data;
  },

  /* ============================
     LOGOUT
     ============================ */
  logout() {
    this.clearToken();
    window.location.href = "/climbing-class/login.html";
  },

  /* ============================
     FETCH CURRENT USER (D1-backed)
     ============================ */
  async fetchMe() {
    const token = this.getToken();
    if (!token) return null;

    const res = await fetch("https://api.chainsawclay.com/api/auth/me", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      this.clearToken();
      return null;
    }

    const user = await res.json();
    this.setUser(user);
    return user;
  },

  /* ============================
     REQUIRE AUTH FOR A PAGE
     ============================ */
  async requireAuth() {
    let user = this.getUser();
    if (!user) {
      user = await this.fetchMe();
    }

    if (!user) {
      // Not logged in → send to login
      window.location.href = "/climbing-class/login.html";
      return null;
    }

    return user;
  },

  /* ============================
     AUTH FETCH WRAPPER
     ============================ */
  async authFetch(url, options = {}) {
    const token = this.getToken();

    const headers = {
      ...(options.headers || {}),
      "Content-Type": options.body ? "application/json" : (options.headers || {})["Content-Type"] || undefined
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers
    });

    return res;
  }
};

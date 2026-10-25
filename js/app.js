/* Parliament Tattoos studio: site logic.
   Edit the CONFIG block below. Everything marked PLACEHOLDER must be replaced before launch. */
(function () {
  "use strict";

  // ---------- CONFIG (owner edits these) ----------
  // TODO: replace with your real Flutterwave PUBLIC key (starts with FLWPUBK_TEST- for test, FLWPUBK- for live).
  // Never put your secret key (FLWSECK-) in this file. It is visible to everyone.
  const FLW_PUBLIC_KEY = "FLWPUBK_TEST-PLACEHOLDER-REPLACE-ME";
  const SHOP_NAME = "Parliament Tattoos";
  const SHOP_CITY = "Lagos";                        // city, edit if needed
  const CURRENCY = "NGN";
  const NAIRA = "\u20A6";
  const STORE_KEY = "parliament_bookings_v1";        // localStorage key, rename per shop

  // PLACEHOLDER prices and deposits, in naira. Replace every amount with your real price list.
  const SERVICES = [
    { id: "fineline",  name: "Fine line",              desc: "Delicate single-needle and fine-line work.",                 price: 0, deposit: 0, minutes: 120, placeholder: true },
    { id: "blackwork", name: "Blackwork / geometric",  desc: "Bold solid black and geometric patterns.",                   price: 0, deposit: 0, minutes: 180, placeholder: true },
    { id: "dotwork",   name: "Dotwork",                desc: "Stippled dot shading and fine detail.",                       price: 0, deposit: 0, minutes: 180, placeholder: true },
    { id: "neotrad",   name: "Neo-traditional",        desc: "Bold outlines and rich colour in a modern traditional style.", price: 0, deposit: 0, minutes: 180, placeholder: true },
    { id: "micro",     name: "Micro-realism",          desc: "Small, highly detailed realistic pieces.",                   price: 0, deposit: 0, minutes: 120, placeholder: true },
    { id: "consult",   name: "Custom design consult",  desc: "Free consultation to plan your design, size and placement.",  price: 0, deposit: 0, minutes: 30,  placeholder: true },
  ];
  const DEPOSIT_NOTE = "Deposit is set per service (placeholder amounts above). Deposit is applied to your final price.";

  // Opening hours: 0 = Sunday ... 6 = Saturday. Empty array = closed. PLACEHOLDER hours.
  const HOURS = {
    0: [],
    1: [],
    2: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    3: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    4: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    5: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
    6: ["11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"],
  };
  const BOOKING_HORIZON_DAYS = 90;

  // Gallery. These are the verified images of OTHER artists, used for layout only.
  // Replace each entry with your own photo: { src: "images/your-file.jpg", alt: "..." }
  const GALLERY = [ // kept: 8 verified gallery URLs, unchanged
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/5261a4a4-4030-475a-a724-bb05ba51e4bf/IMG_1907.JPEG?format=500w", alt: "Micro-realism mouse and rabbit in mirror reflection" },
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/17c24493-55b7-4352-a177-f6f74c69fcd5/IMG_0851.JPEG?format=500w", alt: "Fine-line compass with binary and coordinates" },
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/d4441277-2c9b-4806-a660-609f8d188ced/IMG_0985.JPEG?format=500w", alt: "Micro-realism astronaut exploring space" },
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/ba87ef55-9585-49e5-a8f2-5834e7db56d2/IMG_8840.JPEG?format=500w", alt: "Minimal fine-line sword" },
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/c558c4e5-b855-4419-a005-f0bcaff8dc54/IMG_1363.JPEG?format=500w", alt: "Fine-line geometric tree, birds and chakras" },
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/ffb07469-522a-492f-b2be-d2977e74f76f/IMG_1391.JPEG?format=500w", alt: "Fine-line geometric with Euler identity and hexagon" },
    { src: "https://images.squarespace-cdn.com/content/v1/681994d53cd44a2c9e31fdf3/8dd3484f-4d67-4043-87ce-75525de0d4df/IMG_1362.JPEG?format=500w", alt: "Symmetrical forearm with Metatron's cube" },
    { src: "https://images.squarespace-cdn.com/content/v1/624d9fc780a0b47bf4132884/bdfbd6d1-c943-470e-b7b4-6d9e3cd7cd55/geometric-dotwork-chest-tattoo.jpg?format=500w", alt: "Geometric dotwork chest tattoo" },
  ];

  // ---------- HELPERS ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => NAIRA + Number(n).toLocaleString("en-NG");
  const serviceById = (id) => SERVICES.find((s) => s.id === id);
  const isPlaceholderKey = () => !FLW_PUBLIC_KEY || /PLACEHOLDER/i.test(FLW_PUBLIC_KEY);
  const todayIso = () => { const t = new Date(); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`; };
  const addDays = (iso, n) => { const [y, m, d] = iso.split("-").map(Number); const dt = new Date(y, m - 1, d + n); return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}`; };
  const fmtDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }); };
  const dayOfWeek = (iso) => { const [y, m, d] = iso.split("-").map(Number); return new Date(y, m - 1, d).getDay(); };

  // ---------- STORAGE ----------
  function loadBookings() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function saveBookings(list) { try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {} }
  function isSlotTaken(date, time) { return loadBookings().some((b) => b.date === date && b.time === time && b.status === "paid"); }
  function makeRef() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "SN-";
    for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  }

  // ---------- RENDER: services ----------
  function renderServices() {
    $("#services-grid").innerHTML = SERVICES.map((s) => `
      <article class="service-card">
        <span class="placeholder-tag">Placeholder price</span>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.desc)}</p>
        <div class="price">${money(s.price)} <small class="muted">from</small></div>
        <p class="small muted">Deposit ${money(s.deposit)} (placeholder)</p>
      </article>`).join("");
    $("#f-service").innerHTML = `<option value="">Choose a service</option>` +
      SERVICES.map((s) => `<option value="${esc(s.id)}">${esc(s.name)}</option>`).join("");
  }

  // ---------- RENDER: gallery ----------
  function renderGallery() {
    $("#gallery-grid").innerHTML = GALLERY.map((g) => `
      <figure><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async" />
        <figcaption>${esc(g.alt)}</figcaption></figure>`).join("");
  }

  // ---------- VALIDATION ----------
  function setErr(fieldId, msg) {
    const input = $("#" + fieldId);
    const err = $("#err-" + fieldId.replace("f-", ""));
    if (input) input.closest(".field").classList.toggle("invalid", !!msg);
    if (err) err.textContent = msg || "";
    return !msg;
  }
  function validateDetails() {
    let ok = true;
    const name = $("#f-name").value.trim();
    const phone = $("#f-phone").value.trim();
    const email = $("#f-email").value.trim();
    const service = $("#f-service").value;
    const date = $("#f-date").value;
    const time = $("#f-time").value;
    ok = setErr("f-name", name.length < 2 ? "Enter your full name." : "") && ok;
    ok = setErr("f-phone", /^\+?[0-9 ()-]{7,20}$/.test(phone) ? "" : "Enter a valid phone number.") && ok;
    ok = setErr("f-email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email for your receipt.") && ok;
    ok = setErr("f-service", service ? "" : "Choose a service.") && ok;
    ok = setErr("f-date", date ? "" : "Pick a date.") && ok;
    ok = setErr("f-time", time ? "" : "Pick a time.") && ok;
    if (date && time && isSlotTaken(date, time)) { ok = setErr("f-time", "That slot was just taken. Pick another time.") && false; }
    return ok;
  }

  // ---------- DATE + TIME ----------
  function setupDateInputs() {
    const dateEl = $("#f-date");
    const min = todayIso();
    dateEl.min = min;
    dateEl.max = addDays(min, BOOKING_HORIZON_DAYS);
    dateEl.addEventListener("change", refreshTimes);
  }
  function refreshTimes() {
    const date = $("#f-date").value;
    const timeEl = $("#f-time");
    const note = $("#hours-note");
    if (!date) { timeEl.innerHTML = `<option value="">Pick a date first</option>`; note.textContent = ""; return; }
    const hours = HOURS[dayOfWeek(date)] || [];
    if (!hours.length) {
      timeEl.innerHTML = `<option value="">Closed that day</option>`;
      note.textContent = `We are closed on ${fmtDate(date)}. Pick another day.`;
      return;
    }
    const free = hours.filter((t) => !isSlotTaken(date, t));
    timeEl.innerHTML = `<option value="">Choose a time</option>` +
      free.map((t) => `<option value="${t}">${t}</option>`).join("");
    note.textContent = `Open ${hours[0]} to ${hours[hours.length - 1]}. ${hours.length - free.length} slot(s) already taken.`;
  }

  // ---------- STEPS ----------
  let draft = null;
  function goToStep(n) {
    $$(".step").forEach((s) => s.classList.toggle("active", Number(s.dataset.step) === n));
    $$("#steps-indicator li").forEach((li) => {
      const i = Number(li.dataset.stepInd);
      li.classList.toggle("active", i === n);
      li.classList.toggle("done", i < n);
    });
    $("#book").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function buildDraft() {
    const s = serviceById($("#f-service").value);
    return {
      name: $("#f-name").value.trim(),
      phone: $("#f-phone").value.trim(),
      email: $("#f-email").value.trim(),
      service: s.id,
      serviceName: s.name,
      amount: s.deposit,
      date: $("#f-date").value,
      time: $("#f-time").value,
      notes: $("#f-notes").value.trim(),
    };
  }
  function renderSummary() {
    $("#summary").innerHTML = `
      <div><span class="k">Name</span><span>${esc(draft.name)}</span></div>
      <div><span class="k">Service</span><span>${esc(draft.serviceName)}</span></div>
      <div><span class="k">Date and time</span><span>${fmtDate(draft.date)}, ${esc(draft.time)}</span></div>
      <div><span class="k">Deposit</span><span>${money(draft.amount)}</span></div>`;
    $("#pay-amount").textContent = money(draft.amount);
    $("#pay-status").textContent = isPlaceholderKey()
      ? "Demo mode: no Flutterwave key is set yet, so no real money moves. The receipt will be marked as a demo."
      : "";
  }

  // ---------- FLUTTERWAVE ----------
  // Loads Flutterwave's inline checkout script once.
  function loadFlutterwave() {
    return new Promise((resolve, reject) => {
      if (window.FlutterwaveCheckout) return resolve();
      const s = document.createElement("script");
      s.src = "https://checkout.flutterwave.com/v3.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Could not load Flutterwave checkout. Check your connection."));
      document.head.appendChild(s);
    });
  }

  function confirmBooking(txId, status, demo) {
    const ref = makeRef();
    const record = { ...draft, ref, txId: txId || "DEMO-NO-PAYMENT", status: "paid", demo: !!demo, createdAt: new Date().toISOString() };
    const list = loadBookings();
    list.push(record);
    saveBookings(list);
    showReceipt(record);
  }

  function showReceipt(b) {
    $("#r-ref").textContent = b.ref;
    $("#r-name").textContent = b.name;
    $("#r-service").textContent = b.serviceName;
    $("#r-date").textContent = fmtDate(b.date);
    $("#r-time").textContent = b.time;
    $("#r-amount").textContent = money(b.amount);
    $("#r-txid").textContent = b.txId;
    $("#r-status").textContent = b.demo ? "Demo booking (no payment taken)" : "Deposit paid";
    goToStep(3);
  }

  async function payDeposit() {
    const btn = $("#pay-btn");
    if (!draft) return;
    // Demo path: no key yet. Confirms the flow without taking money.
    if (isPlaceholderKey()) {
      if (!window.confirm("Demo mode: no real payment will be taken. Continue to a demo receipt?")) return;
      confirmBooking(null, "demo", true);
      return;
    }
    btn.disabled = true;
    $("#pay-status").textContent = "Opening secure checkout...";
    try {
      await loadFlutterwave();
    } catch (e) {
      btn.disabled = false;
      $("#pay-status").textContent = e.message;
      return;
    }
    const txRef = "DEP-" + Date.now() + "-" + Math.floor(Math.random() * 1e5);
    window.FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount: draft.amount,
      currency: CURRENCY,
      payment_options: "card,banktransfer,ussd",
      customer: { email: draft.email, phone_number: draft.phone, name: draft.name },
      customizations: {
        title: SHOP_NAME,
        description: "Deposit: " + draft.serviceName,
        logo: "", // TODO: optional logo URL
      },
      callback: function (data) {
        // TODO (before launch): verify data.transaction_id server-side with your Flutterwave secret key
        // before trusting it. A browser callback alone can be faked.
        if (data && (data.status === "successful" || data.status === "completed")) {
          confirmBooking(String(data.transaction_id || data.tx_ref || txRef), "paid", false);
        } else {
          $("#pay-status").textContent = "Payment was not completed. You have not been charged. Try again.";
        }
        if (window.FlutterwaveCheckout) { /* checkout closes itself */ }
        btn.disabled = false;
      },
      onclose: function () {
        btn.disabled = false;
        $("#pay-status").textContent = "Checkout closed. Your slot is not held until payment completes.";
      },
    });
  }

  // ---------- INIT ----------
  function init() {
    $("#year").textContent = new Date().getFullYear();
    // CMS gallery: content/gallery.json (written by the admin page). If it has items, they replace the placeholder list.
    fetch("content/gallery.json", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.items) && data.items.length) {
          GALLERY.length = 0;
          data.items.forEach((it) => GALLERY.push({ src: it.image, alt: it.alt || it.title || "Tattoo design" }));
          renderGallery();
        }
      })
      .catch(() => {});
    renderServices();
    renderGallery();
    setupDateInputs();

    // Mobile menu toggle
    const nav = $(".nav");
    $("#menu-toggle").addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      $("#menu-toggle").setAttribute("aria-expanded", String(open));
    });
    $$(".nav-links a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("open");
      $("#menu-toggle").setAttribute("aria-expanded", "false");
    }));

    $("#f-service").addEventListener("change", () => {});
    $("#booking-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateDetails()) return;
      draft = buildDraft();
      renderSummary();
      goToStep(2);
    });
    $$("[data-back]").forEach((b) => b.addEventListener("click", () => goToStep(Number(b.dataset.back))));
    $("#pay-btn").addEventListener("click", payDeposit);
    $("#new-booking").addEventListener("click", () => {
      $("#booking-form").reset();
      draft = null;
      refreshTimes();
      goToStep(1);
    });

    // Shows the empty time list until a date is picked
    refreshTimes();
  }

  // Expose a read-only hook for the chat widget (hours and prices only).
  window.SHOP = { SERVICES, HOURS, SHOP_NAME, SHOP_CITY, money };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

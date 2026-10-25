/* Parliament Tattoos: rule-based chat assistant. No external API. Edit the replies below. */
(function () {
  "use strict";

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const log = document.getElementById("chat-log");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");

  const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  function hoursText() {
    const H = (window.SHOP && window.SHOP.HOURS) || {};
    const open = [1, 2, 3, 4, 5, 6, 0].filter((d) => (H[d] || []).length);
    if (!open.length) return "We are closed every day right now.";
    const first = H[open[0]], last = H[open[0]][H[open[0]].length - 1];
    return "PLACEHOLDER hours: " + open.map((d) => DAYS[d]).join(", ") +
      ", " + first[0] + " to " + (last ? last : "") + ". Closed the other days. Confirm the real hours before launch.";
  }

  function pricesText() {
    const S = (window.SHOP && window.SHOP.SERVICES) || [];
    return "Prices are placeholders until the owner sets them:\n" +
      S.map((s) => "- " + s.name + ": " + (window.SHOP.money(s.price)) + " (deposit " + window.SHOP.money(s.deposit) + ")").join("\n") +
      "\nThe deposit is applied to your final price.";
  }

  // Rules run top to bottom. First match wins.
  const RULES = [
    { match: /\b(hi|hello|hey|good (morning|afternoon|evening))\b/, reply: "Hi. I can help with prices, opening hours, booking, or the deposit. What do you need?" },
    { match: /\b(price|prices|cost|how much|rate|rates|naira|deposit amount)\b/, reply: () => pricesText() },
    { match: /\b(hour|hours|open|opening|close|closing|time|when are you)\b/, reply: () => hoursText() },
    { match: /\b(book|booking|appointment|reserve|slot)\b/, reply: "Scroll to Book your session, fill in your details and design notes, pick a date and time, then pay the deposit to get your booking reference. Your slot is locked after payment." },
    { match: /\b(deposit|pay|payment|flutterwave|card|transfer|ussd)\b/, reply: "The deposit is paid online through Flutterwave before your visit. It is applied to your final price. You get a booking reference after payment. Show it at the front desk." },
    { match: /\b(reference|receipt|confirmation)\b/, reply: "After you pay, your receipt shows a booking reference (SN-XXXXXX). Show it at the front desk. You can print the receipt from that screen." },
    { match: /\b(walk.?in|walk in|without booking)\b/, reply: "PLACEHOLDER: walk-ins are welcome for piercings and small pieces when the artist has a gap. Booked appointments come first. Booking online is the surest way to get a slot." },
    { match: /\b(cancel|reschedule|change my (booking|appointment|time))\b/, reply: "PLACEHOLDER: rescheduling with 48 hours notice is free. Contact the shop directly to change or cancel. Deposits are non-refundable." },
    { match: /\b(age|old|minor|18|consent|id)\b/, reply: "Clients must be 18 or older, or have written parental consent where the law allows. Bring valid photo ID to your appointment." },
    { match: /\b(aftercare|heal|healing|care)\b/, reply: "Keep the wrap on for the time your artist gives you, wash gently with unscented soap, pat dry, use a thin layer of recommended balm, and avoid sun, swimming and picking for at least two weeks." },
    { match: /\b(where|address|location|located|directions)\b/, reply: "Our address is not published yet. Please ask the shop." },
    { match: /\b(phone|call|contact|number|whatsapp|email)\b/, reply: "Contact details are not published yet. Please check back or ask the shop." },
    { match: /\b(design|draw|custom|sketch|idea)\b/, reply: "Add your idea and reference images in the design notes on the booking form. Custom consultations are available for big pieces." },
    { match: /\b(thanks|thank you|thx|cheers)\b/, reply: "You are welcome." },
  ];

  const FALLBACK = "I did not catch that. Try asking about prices, opening hours, booking, the deposit, or your receipt reference.";

  function answer(text) {
    const q = text.toLowerCase();
    for (const r of RULES) {
      if (r.match.test(q)) return typeof r.reply === "function" ? r.reply() : r.reply;
    }
    return FALLBACK;
  }

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function open() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (!log.childElementCount) {
      addMsg("Hi, I am the shop assistant. Ask me about prices, hours, booking or the deposit.", "bot");
    }
    input.focus();
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
  }

  fab.addEventListener("click", () => (panel.hidden ? open() : close()));
  closeBtn.addEventListener("click", close);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";
    setTimeout(() => addMsg(answer(text), "bot"), 250);
  });
})();

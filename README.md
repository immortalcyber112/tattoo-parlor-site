# Parliament Tattoos tattoo site

Plain HTML, CSS and JS. No build step. Open index.html in a browser to preview, or upload the whole folder to any static host.

Files
- index.html: all sections (hero, services and pricing, gallery, booking, deposit, receipt, FAQ, footer, chat widget)
- css/style.css: dark, mobile-first styling
- js/app.js: CONFIG block at the top, services and prices, hours, booking flow, Flutterwave checkout, receipt
- js/chat.js: rule-based shop assistant (prices, hours, booking, deposit, receipt reference, aftercare, contact)

Placeholders you still need to fill

1. Shop name. Find and replace "YOUR SHOP NAME" in index.html (title, hero, nav, receipt, footer) and SHOP_NAME in js/app.js.
2. City and address. Replace "YOUR CITY" and "YOUR STREET ADDRESS" in index.html, in the footer, and in js/chat.js.
3. Phone and email. Replace +234 000 000 0000 and hello@example.com in index.html and js/chat.js.
4. Hero line. Replace the "TODO: one line about your style" text in index.html.
5. Real prices and deposits. In js/app.js, edit the SERVICES list. Every price and deposit is set to 0 and marked as a placeholder. Set the deposit amounts in naira.
6. Opening hours. In js/app.js, edit HOURS (0 = Sunday). Also update the FAQ hours answer in index.html and the hours answer in js/chat.js so they match.
7. Gallery pictures. js/app.js GALLERY currently uses 8 tattoo photos from OTHER artists (Miki S in Vancouver, Seth Arcane in London). They are for layout only. Replace each src with your own photo, for example "images/your-file.jpg", and put your own alt text. Do not launch with other artists' work.
8. Flutterwave public key. In js/app.js, replace FLW_PUBLIC_KEY (the line marked TODO) with your key. Test keys start with FLWPUBK_TEST-, live keys start with FLWPUBK-. Use only the PUBLIC key here. Never put your secret key (FLWSECK-) in the site, because anyone can read these files.
9. Flutterwave server check (before you take real money). The site currently trusts the browser callback. Before launch, verify each transaction on your server with your secret key, using the transaction_id, and only then issue the booking. Without that check a fake success could be shown.
10. Chat replies. The shop assistant answers with rules written in js/chat.js. The PLACEHOLDER replies there (walk-ins, rescheduling, hours, address, phone) need your real policy.
11. Social links. The footer has "Instagram, TikTok, Facebook (placeholder links)". Add your real links.

Notes
- While FLW_PUBLIC_KEY still contains PLACEHOLDER, the deposit step runs in demo mode: no money moves and the receipt is marked as a demo booking.
- Bookings are saved in the visitor's browser (localStorage). That blocks double booking on the same device only. A real shop needs a server-side booking store, which is not built yet.
- Your shop's receipt reference is SN-XXXXXX. Change the prefix in makeRef() in js/app.js if you want your own.

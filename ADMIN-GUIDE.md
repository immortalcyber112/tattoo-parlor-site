# Admin guide (for the shop owner)

Admin page: https://immortalcyber112.github.io/tattoo-parlor-site/admin/

First, finish SETUP-SUPABASE.md once. Login does not work until that is done.

Log in
1. Open the admin page above.
2. Click "Login with GitHub" and sign in with the GitHub account that has access to the repo.

Upload a gallery design
1. Click "Gallery (tattoo designs)", then "Gallery items", then "New Gallery items".
2. Click the Image field and pick a photo from your computer.
3. Fill in Alt text (describe the tattoo, for example "fine-line rose on forearm").
4. Optional: title and artist name.
5. Click "Publish" (top right). Decap commits the photo to the uploads folder and updates content/gallery.json.
6. Wait 1 to 2 minutes. The new design shows in the gallery on the homepage.

Change prices, hours or the about text
1. Click "Site settings".
2. Edit the price or deposit under "Services and prices". Prices are in naira.
3. Edit opening hours under "Opening hours". Use 24-hour times like 11:00 and 18:00. Tick "Closed this day" for days you are closed.
4. Edit "About text" if needed.
5. Click "Publish". Changes show on the site after Pages rebuilds (1 to 2 minutes).

Save and publish
- "Save" keeps a draft. "Publish" commits the change to the repo. GitHub Pages then rebuilds the site automatically.
- You can check the rebuild in the repo's "Actions" tab.

Things to know
- Do not put your payment keys or any secret in these files.
- Contact details (phone, email, social links) stay blank until you add them yourself.
- Payments are in demo mode until you connect your Flutterwave account.

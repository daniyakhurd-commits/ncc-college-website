# NCC College Website

Responsive starter website for **Govt Gajanan Madhav Muktibodh College, Sahaspur Lohara**.

## Pages
- Home page with college/NCC introduction and year-wise senior-rank highlights
- Cadet directory (public cards omit phone and regiment number)
- Achievements and notices
- Admin content editor for cadets, achievements, and notices

## Run locally
Open `index.html` in a browser, or serve this folder with any static web server. No build step is required.

## Important prototype limitation
The admin editor saves data in the current browser's `localStorage` only. It is not authenticated, does not publish changes to a shared website, and is not suitable for real cadet data. For production, connect a secure backend/database, add server-side admin authentication and authorization, and obtain consent before storing or publishing personal data. Do not enter real phone numbers or regiment numbers in this public demo.

College name and the initial content can be customized in `index.html` and `app.js`.

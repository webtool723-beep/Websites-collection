# 🏟️ GreenZone Turf — Website Package

A complete, professional sports turf website with Google Sheets booking integration.

---

## 📁 Files Included

| File | Description |
|------|-------------|
| `index.html` | Main website — all sections |
| `style.css` | All styles, animations, responsive layout |
| `script.js` | Interactivity, counters, form submission |
| `google-apps-script.js` | Paste into Google Apps Script to connect the form to Google Sheets |
| `README.md` | This setup guide |

---

## 🚀 Quick Start

### Step 1 — Open the Website Locally
- Unzip the package
- Open `index.html` in any browser — the site works immediately

### Step 2 — Customize Your Details
Open `index.html` and find/replace:
- `GreenZone Turf` → Your turf name
- `Kota, Rajasthan` → Your city/location
- `+91 99999 99999` → Your real phone number
- `info@greenzoneturf.in` → Your email
- `Plot No. XYZ, Near [Landmark]` → Your address
- `https://maps.google.com` → Your real Google Maps link
- Pricing in the sports cards (e.g. `₹800/hr onwards`)

---

## 📊 Connect Google Sheets (Booking Form)

### Step 1 — Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new sheet
2. Rename the first tab to: **Bookings**
3. Add these headers in **Row 1** (A1 to I1):
   ```
   Timestamp | Name | Phone | Email | Sport | Date | Time | Players | Message
   ```

### Step 2 — Create Apps Script
1. In Google Sheets → **Extensions** → **Apps Script**
2. Delete any existing code
3. Open `google-apps-script.js` from this package and **paste the entire contents**
4. Click the 💾 Save button
5. Name the project: `GreenZone Turf Bookings`

### Step 3 — Deploy as Web App
1. Click **Deploy** → **New Deployment**
2. Click the ⚙️ gear icon → select **Web App**
3. Fill in:
   - **Description**: GreenZone Turf Form Handler
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. Authorize when prompted (click "Allow")
6. **Copy the Web App URL** shown

### Step 4 — Connect to Website
1. Open `script.js` in a text editor
2. Find this line (near the top):
   ```javascript
   const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder with your copied URL:
   ```javascript
   const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
   ```
4. Save `script.js`

✅ **Done! Every booking now saves directly to your Google Sheet.**

---

## 📧 Optional: Email Notifications

To receive an email for every new booking:
1. Open `google-apps-script.js`
2. Find this line:
   ```javascript
   const NOTIFY_EMAIL = '';
   ```
3. Add your email:
   ```javascript
   const NOTIFY_EMAIL = 'youremail@gmail.com';
   ```
4. Re-deploy the Apps Script (Deploy → Manage Deployments → Edit → Deploy)

---

## 🌐 Deploy to Live Website

### Option A — Free Hosting (GitHub Pages)
1. Create a [GitHub](https://github.com) account
2. Create a new repository (e.g. `greenzoneturf`)
3. Upload all 4 files (`index.html`, `style.css`, `script.js`, and the Apps Script for reference)
4. Go to Settings → Pages → Source: `main` branch → Save
5. Your site is live at: `https://yourusername.github.io/greenzoneturf`

### Option B — Paid Hosting (Hostinger / GoDaddy)
1. Purchase a domain + hosting plan
2. Upload all files via FTP or the File Manager in cPanel
3. Your site is live on your custom domain

### Option C — Free Hosting (Netlify)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the unzipped folder
3. Your site is live instantly with a free subdomain

---

## 🎨 Customization Tips

### Change Colors
Open `style.css` and edit the CSS variables at the top:
```css
:root {
  --green-primary: #22c55e;   /* Main green accent */
  --green-dark:    #16a34a;   /* Darker green */
  --dark-bg:       #080f08;   /* Page background */
  --dark-card:     #0e1a0e;   /* Card background */
}
```

### Change Fonts
The website uses Google Fonts. To change them:
1. Go to [fonts.google.com](https://fonts.google.com)
2. Pick your font → copy the `<link>` tag
3. Replace the existing font link in `index.html` `<head>`
4. Update `--font-display`, `--font-heading`, `--font-body` in `style.css`

### Add Real Photos
Replace the SVG sport illustrations by adding `<img>` tags:
```html
<!-- Replace the <svg>...</svg> inside .about-img-placeholder with: -->
<img src="images/your-turf-photo.jpg" alt="GreenZone Turf" style="width:100%;display:block;" />
```

---

## 📱 WhatsApp Integration

The floating WhatsApp button and "WhatsApp Us" link use:
```
https://wa.me/919999999999
```
Replace `919999999999` with your number in international format (91 = India code, then 10-digit number).

---

## ✅ SEO Checklist

Already included:
- ✅ Meta description with keywords
- ✅ Semantic HTML structure (h1, h2, h3, section, nav)
- ✅ Mobile responsive layout
- ✅ Fast-loading (no heavy dependencies)
- ✅ Local keywords (Kota, Rajasthan)

To improve further:
- Add your real address in the `<meta>` description
- Submit your site to Google Search Console
- Add a `sitemap.xml` file
- Register on Google Business Profile

---

## 📞 Support

Built for sports turf businesses in India. For customization help, reach out to your developer.

---

*© 2025 GreenZone Turf. All rights reserved.*

# ✦ Lumière Salon & Spa — Website Package

A fully responsive, professional salon website with Google Sheets booking integration.

---

## 📁 File Structure

```
salon-website/
├── index.html               → Main website (all pages in one file)
├── style.css                → All styles (luxury gold & charcoal theme)
├── script.js                → JavaScript (animations, form logic, Google Sheets)
├── google-sheets-script.js  → Google Apps Script (paste into Apps Script editor)
└── README.md                → This file
```

---

## 🚀 Quick Start

### Step 1 — Open the Website Locally
- Double-click `index.html` to open in your browser
- The website works fully without any server

### Step 2 — Customise Your Details
Open `index.html` and update:
- **Salon name** — Search "Lumière" and replace with your salon name
- **Address** — Find "12, Rose Garden Lane" and update
- **Phone** — Find "+91 98765 43210" and update
- **Email** — Find "hello@lumieresalon.in" and update
- **Social handles** — Find "@lumieresalon" and update
- **Prices** — Update all "Starting ₹XXX" values
- **Hours** — Update opening/closing times in footer

---

## 📊 Google Sheets Integration

### Step 1 — Create Your Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename Sheet1 tab to: **Bookings**

### Step 2 — Add the Apps Script
1. In your Google Sheet: **Extensions → Apps Script**
2. Delete any existing code
3. Open `google-sheets-script.js` from this package
4. Copy ALL the code and paste it into the Apps Script editor
5. Press **Save** (Ctrl+S or Cmd+S)

### Step 3 — Deploy as Web App
1. Click **Deploy → New deployment**
2. Click the ⚙ gear icon → Select **Web app**
3. Set:
   - **Description:** Lumiere Salon Booking
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. Authorize the app when prompted
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC123.../exec`)

### Step 4 — Connect to Your Website
1. Open `script.js` in any text editor
2. Find this line near the top:
   ```javascript
   const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec";
   ```
3. Replace the URL with your copied Web App URL
4. Save `script.js`

### Step 5 — Optional: Email Notifications
To receive an email every time someone books:
1. Open `google-sheets-script.js`
2. Find: `const NOTIFY_EMAIL = "";`
3. Add your email: `const NOTIFY_EMAIL = "youremail@gmail.com";`
4. Re-deploy the script (Deploy → Manage deployments → Edit → New version → Deploy)

### Step 6 — Test It
1. Open your website in a browser
2. Fill in the booking form and submit
3. Check your Google Sheet — a new row should appear! ✦

---

## 🎨 Customisation Guide

### Colors (in style.css)
```css
--gold: #C9A84C;        /* Primary gold accent */
--gold-light: #E8D08A;  /* Light gold */
--dark: #1A1510;        /* Deep charcoal background */
--cream: #FAF6EE;       /* Light cream background */
```
Change these to match your brand.

### Fonts
The website uses **Cormorant Garamond** (display) + **Jost** (body) from Google Fonts.
To change, update the `<link>` tag in index.html and the `--font-display` / `--font-body` variables in style.css.

### Gallery Images
The gallery currently shows styled placeholders. To add real photos:
1. Add your images to the salon-website folder
2. In `index.html`, find each `.gal-item` and add an `<img>` tag:
   ```html
   <div class="gal-item gal-tall">
     <img src="your-image.jpg" alt="Balayage" />
     <div class="gal-inner"><span>Balayage</span></div>
   </div>
   ```

---

## 🌐 Publishing Your Website

### Option A — Free Hosting (GitHub Pages)
1. Create a free account at github.com
2. Create a new repository
3. Upload all files from this folder
4. Go to Settings → Pages → Source: main branch
5. Your site will be live at: `https://yourusername.github.io/repo-name`

### Option B — Paid Hosting (Recommended for business)
- **Hostinger** (~₹99/month) — beginner friendly
- **GoDaddy** — includes domain registration
- Upload all files to your `public_html` folder via File Manager or FTP

### Option C — WhatsApp-linked Landing Page
Host on Netlify (free): drag & drop your folder at netlify.com

---

## 📱 Features Included

- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth scroll animations
- ✅ Sticky navbar with scroll effect
- ✅ Mobile hamburger menu
- ✅ Booking form → Google Sheets
- ✅ Email notification on new booking
- ✅ Toast notifications
- ✅ Counter animations on stats
- ✅ Gallery hover effects
- ✅ SEO meta tags
- ✅ Accessible HTML structure

---

## 💛 Credits

**Design & Development:** Custom built for Lumière Salon
**Fonts:** Google Fonts (Cormorant Garamond, Jost)
**Icons:** Unicode symbols (no external libraries)
**Form Backend:** Google Apps Script (free)

---

*Made with ✦ for Lumière Salon & Spa — Kota, Rajasthan*

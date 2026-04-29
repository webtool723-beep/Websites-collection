# IronPeak Gym Website — Setup Guide

## 📁 File Structure

```
gym-website/
├── index.html              ← Main website file
├── style.css               ← All styles
├── script.js               ← Interactivity + form logic
├── google-apps-script.gs   ← Paste into Google Apps Script
└── README.md               ← This file
```

---

## 🚀 Quick Start

1. **Host the website** — Upload `index.html`, `style.css`, and `script.js` to any web host (Netlify, Vercel, GitHub Pages, or cPanel).
2. **Connect Google Sheets** — Follow the steps below.
3. **Customise** — Update your gym name, contact details, WhatsApp number, and Google Maps link.

---

## 📊 Connecting the Form to Google Sheets

### Step 1 — Create the Spreadsheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it **IronPeak Enquiries**.
3. Rename the default tab to **Enquiries**.
4. In Row 1, add these exact headers (A1 to I1):

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Phone | Email | Program | Goal | Preferred Date | Message | Status |

### Step 2 — Set Up Apps Script
1. In your spreadsheet, click **Extensions → Apps Script**.
2. Delete all the default code.
3. Open `google-apps-script.gs` from this package and **paste the entire contents**.
4. Find this line and replace the placeholder with your **Spreadsheet ID**:
   ```js
   const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
   ```
   > Your Spreadsheet ID is the long string in the URL:  
   > `https://docs.google.com/spreadsheets/d/`**THIS_PART**`/edit`

5. (Optional) Update `NOTIFY_EMAIL` to receive email alerts on new enquiries.

### Step 3 — Deploy as Web App
1. Click **Deploy → New Deployment**.
2. Click the gear icon ⚙️ and choose **Web app**.
3. Set:
   - **Description:** IronPeak Form Handler
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** → **Authorize** → **Allow**.
5. **Copy the Web App URL** shown (it looks like `https://script.google.com/macros/s/ABC.../exec`).

### Step 4 — Connect to the Website
1. Open `script.js`.
2. Find line 10:
   ```js
   const GOOGLE_SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
3. Replace `YOUR_GOOGLE_APPS_SCRIPT_URL_HERE` with the URL you copied.
4. Save and re-upload `script.js`.

### Step 5 — Test It
1. Open your website and fill in the enquiry form.
2. Check your Google Sheet — a new row should appear within seconds.
3. If you set `NOTIFY_EMAIL`, check your inbox.

---

## 🎨 Customisation Guide

### Change Gym Name
Search and replace `IRONPEAK` / `IronPeak` in all files.

### Update Contact Details
In `index.html`, search for:
- `+91 98765 43210` → your phone
- `hello@ironpeakgym.in` → your email
- `Vigyan Nagar, Kota` → your address
- Google Maps link (in the map section)

### Update Pricing
In `index.html`, find the `#pricing` section and update the `₹` amounts.

### Change Colors
In `style.css`, find `:root` at the top and adjust:
```css
--gold: #d4a017;        /* Primary accent color */
--gold-bright: #f5c842; /* Hover state */
--black: #0a0a0a;       /* Background */
```

### Add Real Photos
Replace the `.gym1` and `.gym2` CSS classes' backgrounds with:
```css
.gym1 {
  background: url('images/gym-floor.jpg') center/cover no-repeat;
}
```
Then add your photo files to an `images/` folder.

### Add Your Logo
Replace the text logo in `index.html`:
```html
<!-- Find this: -->
<a href="#hero" class="logo">IRON<span>PEAK</span></a>

<!-- Replace with: -->
<a href="#hero"><img src="images/logo.png" alt="IronPeak Gym" height="48" /></a>
```

---

## 🌐 Hosting Options (Free)

| Platform | Steps |
|----------|-------|
| **Netlify** | Drag & drop your folder at netlify.com/drop |
| **Vercel** | Connect GitHub repo or upload via CLI |
| **GitHub Pages** | Push to repo → Settings → Pages → Deploy |
| **cPanel** | Upload files to `public_html` via File Manager |

---

## ⚡ Performance Tips

- Compress images with [squoosh.app](https://squoosh.app) before uploading.
- Enable **Gzip compression** on your host.
- Add a **custom domain** for a professional appearance.
- Set up **SSL/HTTPS** (free via Let's Encrypt on most hosts).

---

## 📞 Need Help?

For support setting up your website, contact your web developer or refer to:
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Netlify Docs](https://docs.netlify.com)

---

*IronPeak Gym Website — Built for Champions 🏆*

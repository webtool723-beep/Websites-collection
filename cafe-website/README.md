# ☕ Brewed Haven Café – Website Package

## What's Included

| File | Description |
|------|-------------|
| `index.html` | Main website HTML |
| `style.css` | Complete stylesheet (theme, layout, responsive) |
| `main.js` | All interactivity + Google Sheets form logic |
| `menu-data.js` | Café menu items (easy to edit) |
| `google-apps-script.js` | Paste into Google Apps Script to link your spreadsheet |
| `README.md` | This setup guide |

---

## 🚀 Quick Start (Local)

1. Unzip the folder
2. Open `index.html` in any modern browser
3. The website is fully functional — the form will work in demo mode

---

## 🔗 Connecting Google Sheets (5 Minutes)

### Step 1 – Create Your Spreadsheet
1. Go to [https://sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: `Brewed Haven – Reservations`

### Step 2 – Open Apps Script
1. In your spreadsheet, click **Extensions** → **Apps Script**
2. You'll see a code editor open

### Step 3 – Add the Script
1. **Delete** all existing code in the editor
2. Open `google-apps-script.js` from this package
3. **Copy all the code** and paste it into the Apps Script editor
4. Click the **floppy disk icon** (Save) or press `Ctrl+S`

### Step 4 – Deploy as Web App
1. Click **Deploy** (top right) → **New Deployment**
2. Click the **gear icon ⚙** next to "Select type"
3. Choose **Web App**
4. Set:
   - **Execute as**: Me *(your Google account)*
   - **Who has access**: Anyone
5. Click **Deploy**
6. **Authorize** the app when the permission popup appears
7. Click **Allow**
8. Copy the **Web App URL** that appears (it looks like: `https://script.google.com/macros/s/AKfycb.../exec`)

### Step 5 – Connect to Your Website
1. Open `main.js` in a text editor
2. Find line 14:
   ```js
   const GOOGLE_SHEETS_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
   ```
3. Replace the placeholder with your copied URL:
   ```js
   const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
4. Save `main.js`

### Step 6 – Test It
1. Open the website and submit a test reservation
2. Check your Google Sheet — a new tab called **"Reservations"** should appear with the data
3. Check your email — you should receive a notification email
4. Your guest will also receive a styled confirmation email automatically

---

## ✏️ Customising Your Content

### Change Café Name & Details
- Open `index.html`
- Search for `Brewed Haven` and replace with your café name
- Update address, phone, and email throughout the file

### Update Menu Items
- Open `menu-data.js`
- Each item has: `emoji`, `name`, `desc`, `price`, `tag`
- Add, edit, or remove items from each category (`coffee`, `food`, `specials`)

### Change Colours
- Open `style.css`
- Edit the `:root` variables at the top:
```css
:root {
  --espresso: #1a0f0a;      /* Main dark background */
  --caramel: #c17f3a;       /* Primary accent colour */
  --gold: #d4a843;           /* Gold highlights */
  --cream: #f5efe6;          /* Light background */
  --warm-white: #fdf8f2;    /* Page background */
}
```

### Add Real Photos
Replace the CSS gradient placeholders in `style.css` with real images:
```css
/* Find lines like: */
.gi1 { background: linear-gradient(135deg, #3d1a08, #6b3a1f); }

/* Replace with: */
.gi1 { background: url('images/your-photo.jpg') center/cover; }
```

### Update Opening Hours
Search for `7:00 AM – 9:00 PM` in `index.html` and replace with your real hours.

---

## 🌐 Deploying Your Website

### Option A – Upload to Web Hosting (Recommended)
1. Use any hosting provider (Hostinger, Bluehost, GoDaddy, etc.)
2. Upload all files via **FTP** or their **File Manager**
3. Upload to the `public_html` folder
4. Your site goes live at `yourdomain.com`

### Option B – GitHub Pages (Free)
1. Create a free GitHub account
2. Create a new repository
3. Upload all files
4. Go to: Settings → Pages → Deploy from Branch → Main → Save
5. Site goes live at `yourusername.github.io/repo-name`

### Option C – Netlify (Free, Easiest)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your entire website folder onto the Netlify dashboard
3. Your site goes live instantly with a free URL
4. You can add your custom domain in settings

---

## 📊 What Gets Saved to Google Sheets

### Reservations Tab
| Column | Data |
|--------|------|
| Timestamp | When form was submitted |
| Type | "Reservation" |
| First Name | Guest's first name |
| Last Name | Guest's last name |
| Email | Guest email |
| Phone | Phone number |
| Date | Requested date |
| Time | Requested time |
| Guests | Number of guests |
| Occasion | Special occasion |
| Notes | Special requests |

### Enquiries Tab
| Column | Data |
|--------|------|
| Timestamp | When form was submitted |
| Type | "Enquiry" |
| First Name | — |
| Last Name | — |
| Email | — |
| Phone | — |
| Enquiry Type | Category selected |
| Message | Full message text |

---

## 📧 Email Notifications

The Google Apps Script automatically sends:

1. **Owner Notification** → Sent to your Google account email whenever a new form is submitted
2. **Guest Confirmation** → A branded HTML email sent to the guest confirming their reservation or enquiry

To change the owner email, edit `google-apps-script.js`:
```js
// Find this line and replace the email:
MailApp.sendEmail({ to: "your@email.com", subject, body });
```

---

## ❓ Troubleshooting

**Form not submitting data to sheets?**
- Make sure you pasted the correct Web App URL in `main.js`
- Re-deploy the Apps Script (Deploy → Manage Deployments → Edit → Deploy)
- Check the Apps Script execution logs (View → Executions)

**Emails not sending?**
- Make sure you authorized the app during deployment
- Check Apps Script → Services → Gmail API is enabled

**Website looks broken?**
- Make sure all 5 files are in the same folder
- Use a modern browser (Chrome, Firefox, Edge, Safari)

---

## 📞 Support

For help customising or deploying your café website, contact your developer or refer to:
- Google Apps Script docs: [developers.google.com/apps-script](https://developers.google.com/apps-script)
- Netlify docs: [docs.netlify.com](https://docs.netlify.com)

---

*© 2026 Brewed Haven Café Website Package*

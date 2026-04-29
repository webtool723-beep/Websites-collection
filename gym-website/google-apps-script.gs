/**
 * IRONPEAK GYM — Google Apps Script
 * ===================================
 * This script receives form submissions from the website
 * and appends them as rows in a Google Sheet.
 *
 * SETUP INSTRUCTIONS (Step-by-Step):
 * ------------------------------------
 * 1. Open Google Sheets → create a new spreadsheet named "IronPeak Enquiries"
 * 2. Rename the first sheet tab to "Enquiries"
 * 3. In Row 1, add these exact headers (one per column):
 *    Timestamp | Name | Phone | Email | Program | Goal | Preferred Date | Message | Status
 * 4. Click Extensions → Apps Script
 * 5. Delete all existing code and paste THIS ENTIRE FILE
 * 6. Replace YOUR_SPREADSHEET_ID below with your Sheet's ID
 *    (find it in the URL: docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit)
 * 7. Click Save (💾), then click Deploy → New Deployment
 * 8. Choose type: Web App
 *    - Description: IronPeak Form Handler
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 9. Click Deploy → Authorize → Allow
 * 10. Copy the Web App URL shown and paste it into script.js as GOOGLE_SCRIPT_URL
 */

// ── REPLACE THIS WITH YOUR ACTUAL SPREADSHEET ID ──
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Enquiries";

// ── Notification email (optional) ──
// If set, you'll receive an email for every new enquiry
const NOTIFY_EMAIL = "hello@ironpeakgym.in"; // set to "" to disable

// ─────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendToSheet(data);
    if (NOTIFY_EMAIL) sendNotification(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput("IronPeak Form Handler is running ✅")
    .setMimeType(ContentService.MimeType.TEXT);
}

function appendToSheet(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(`Sheet "${SHEET_NAME}" not found.`);

  const row = [
    data.timestamp  || new Date().toLocaleString("en-IN"),
    data.name       || "",
    data.phone      || "",
    data.email      || "",
    data.program    || "Not specified",
    data.goal       || "Not specified",
    data.preferred_date || "",
    data.message    || "",
    "New",          // Default status
  ];

  sheet.appendRow(row);

  // Auto-format: highlight new rows
  const lastRow = sheet.getLastRow();
  sheet.getRange(lastRow, 1, 1, row.length)
    .setBackground("#fff8e7");
}

function sendNotification(data) {
  const subject = `🏋️ New IronPeak Enquiry — ${data.name}`;
  const body = `
New gym enquiry received!

Name:           ${data.name}
Phone:          ${data.phone}
Email:          ${data.email}
Program:        ${data.program || "Not specified"}
Goal:           ${data.goal || "Not specified"}
Preferred Date: ${data.preferred_date || "Flexible"}
Message:        ${data.message || "None"}
Submitted At:   ${data.timestamp}

---
Log in to Google Sheets to view all enquiries.
  `.trim();

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

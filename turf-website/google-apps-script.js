/**
 * ============================================================
 *  GreenZone Turf — Google Apps Script
 *  Paste this entire file into Google Apps Script Editor
 *  and deploy as a Web App (see instructions below).
 * ============================================================
 *
 *  SETUP STEPS:
 *  ─────────────────────────────────────────────────────────
 *  1. Open your Google Sheet (create one if needed).
 *     Name the first sheet tab: "Bookings"
 *
 *  2. Add these column headers in Row 1 (A1 to I1):
 *     Timestamp | Name | Phone | Email | Sport |
 *     Date | Time | Players | Message
 *
 *  3. In the Google Sheet, go to:
 *     Extensions → Apps Script
 *
 *  4. Delete any existing code and paste THIS entire file.
 *
 *  5. Click the floppy-disk icon (Save). Give the project
 *     a name like "GreenZone Turf Bookings".
 *
 *  6. Click "Deploy" (top right) → "New Deployment".
 *     - Type: Web App
 *     - Description: GreenZone Turf Form Handler
 *     - Execute as: Me (your Google account)
 *     - Who has access: Anyone
 *     Click "Deploy" → Authorize when prompted.
 *
 *  7. Copy the "Web App URL" that appears.
 *
 *  8. Open script.js in this website folder.
 *     Find the line:
 *       const GOOGLE_SHEET_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
 *     Replace the placeholder with your copied URL.
 *
 *  9. Save script.js. Your form is now live & connected! ✅
 * ─────────────────────────────────────────────────────────
 */

// ─── CONFIGURATION ────────────────────────────────────────
const SHEET_NAME   = 'Bookings';   // Name of the tab in your Google Sheet
const NOTIFY_EMAIL = '';           // Optional: your email to get notifications
                                   // Leave empty '' to skip email alerts
// ──────────────────────────────────────────────────────────

/**
 * Handles GET requests (used for testing the deployment).
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'GreenZone Turf API is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handles POST requests from the booking form.
 */
function doPost(e) {
  try {
    // Parse incoming JSON body
    var data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet and the Bookings sheet
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow([
        'Timestamp', 'Name', 'Phone', 'Email',
        'Sport', 'Date', 'Time', 'Players', 'Message'
      ]);
      // Bold & freeze the header row
      sheet.getRange(1, 1, 1, 9).setFontWeight('bold').setBackground('#22c55e').setFontColor('#000000');
      sheet.setFrozenRows(1);
    }

    // Append the new booking row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.name      || '',
      data.phone     || '',
      data.email     || '',
      data.sport     || '',
      data.date      || '',
      data.time      || '',
      data.players   || '',
      data.message   || ''
    ]);

    // Auto-resize columns for readability
    sheet.autoResizeColumns(1, 9);

    // Optional: Send email notification
    if (NOTIFY_EMAIL && NOTIFY_EMAIL.length > 0) {
      sendNotificationEmail(data, NOTIFY_EMAIL);
    }

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Booking recorded.' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    // Log the error and return an error response
    Logger.log('Error in doPost: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Sends an email notification when a new booking is received.
 */
function sendNotificationEmail(data, recipientEmail) {
  try {
    var subject = '🏟️ New Turf Booking: ' + (data.name || 'Unknown') + ' — ' + (data.sport || 'Sport TBD');
    var body = [
      '📋 NEW BOOKING RECEIVED — GreenZone Turf',
      '─────────────────────────────────────',
      '👤 Name     : ' + (data.name    || 'N/A'),
      '📞 Phone    : ' + (data.phone   || 'N/A'),
      '✉️  Email    : ' + (data.email   || 'N/A'),
      '⚽ Sport    : ' + (data.sport   || 'N/A'),
      '📅 Date     : ' + (data.date    || 'N/A'),
      '⏰ Time     : ' + (data.time    || 'N/A'),
      '👥 Players  : ' + (data.players || 'N/A'),
      '💬 Message  : ' + (data.message || 'None'),
      '─────────────────────────────────────',
      '🕐 Submitted: ' + (data.timestamp || new Date().toLocaleString()),
      '',
      'Please confirm the booking within 30 minutes via WhatsApp or call.',
      '',
      '— GreenZone Turf Booking System'
    ].join('\n');

    MailApp.sendEmail(recipientEmail, subject, body);
  } catch (mailErr) {
    Logger.log('Email notification failed: ' + mailErr.toString());
  }
}

/**
 * Utility: Run this function manually to test your sheet setup.
 */
function testSetup() {
  var testData = {
    timestamp : new Date().toLocaleString(),
    name      : 'Test User',
    phone     : '+91 99999 99999',
    email     : 'test@example.com',
    sport     : 'Football',
    date      : '2025-01-01',
    time      : '06:00 PM – 07:00 PM',
    players   : '10',
    message   : 'This is a test booking.'
  };

  var fakeEvent = {
    postData: { contents: JSON.stringify(testData) }
  };

  var result = doPost(fakeEvent);
  Logger.log(result.getContent());
}

/**
 * =============================================
 * LUMIÈRE SALON — Google Apps Script
 * =============================================
 * SETUP INSTRUCTIONS:
 *
 * STEP 1 — Create a Google Sheet:
 *   • Go to sheets.google.com and create a new spreadsheet
 *   • Rename the first sheet tab to: "Bookings"
 *   • Add these column headers in Row 1:
 *     A: Timestamp
 *     B: Full Name
 *     C: Phone
 *     D: Email
 *     E: Preferred Date
 *     F: Preferred Time
 *     G: Service
 *     H: Message
 *     I: Source
 *     J: Status
 *
 * STEP 2 — Open Apps Script:
 *   • In the Google Sheet, click Extensions > Apps Script
 *   • Delete any existing code
 *   • Paste ALL of this code
 *   • Click Save (Ctrl+S / Cmd+S)
 *
 * STEP 3 — Deploy as Web App:
 *   • Click "Deploy" > "New deployment"
 *   • Click the gear icon ⚙ next to "Select type" > choose "Web app"
 *   • Description: "Lumiere Salon Booking Form"
 *   • Execute as: "Me"
 *   • Who has access: "Anyone"
 *   • Click "Deploy"
 *   • Click "Authorize access" and follow the prompts
 *   • COPY the Web App URL — it looks like:
 *     https://script.google.com/macros/s/AKfycb.../exec
 *
 * STEP 4 — Update your website:
 *   • Open script.js in your website folder
 *   • Find the line: const GOOGLE_SHEET_URL = "https://script.google.com/..."
 *   • Replace the URL with your copied Web App URL
 *   • Save script.js
 *
 * STEP 5 — Test it:
 *   • Open your website and submit the booking form
 *   • Check your Google Sheet — a new row should appear!
 *
 * =============================================
 */

// ─── CONFIGURATION ────────────────────────────
const SHEET_NAME = "Bookings";        // The sheet tab name
const NOTIFY_EMAIL = "";              // Optional: your email to get notified on each booking
                                      // e.g. "youremail@gmail.com" — leave "" to disable

// ─── MAIN HANDLER ─────────────────────────────

/**
 * Handles POST requests from the salon booking form.
 * Writes data to Google Sheet and optionally sends email.
 */
function doPost(e) {
  try {
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);

    // Get the active spreadsheet and target sheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create the sheet with headers if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      const headers = [
        "Timestamp",
        "Full Name",
        "Phone",
        "Email",
        "Preferred Date",
        "Preferred Time",
        "Service",
        "Message",
        "Source",
        "Status"
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

      // Style the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1A1510");
      headerRange.setFontColor("#C9A84C");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);

      // Set column widths for readability
      sheet.setColumnWidth(1, 180); // Timestamp
      sheet.setColumnWidth(2, 160); // Name
      sheet.setColumnWidth(3, 130); // Phone
      sheet.setColumnWidth(4, 200); // Email
      sheet.setColumnWidth(5, 180); // Date
      sheet.setColumnWidth(6, 160); // Time
      sheet.setColumnWidth(7, 180); // Service
      sheet.setColumnWidth(8, 250); // Message
      sheet.setColumnWidth(9, 150); // Source
      sheet.setColumnWidth(10, 120); // Status
    }

    // Prepare the row data
    const rowData = [
      data.timestamp || new Date().toLocaleString("en-IN"),
      data.name        || "",
      data.phone       || "",
      data.email       || "Not provided",
      data.date        || "",
      data.time        || "",
      data.service     || "",
      data.message     || "None",
      data.source      || "Not specified",
      "Pending"        // Default status — update manually to Confirmed/Cancelled
    ];

    // Append the row to the sheet
    sheet.appendRow(rowData);

    // Highlight the new row with alternating colors
    const lastRow = sheet.getLastRow();
    const rowColor = lastRow % 2 === 0 ? "#FAF6EE" : "#FFFFFF";
    sheet.getRange(lastRow, 1, 1, rowData.length).setBackground(rowColor);

    // ─── OPTIONAL: Send Email Notification ────────
    if (NOTIFY_EMAIL && NOTIFY_EMAIL.length > 0) {
      sendNotificationEmail(data, NOTIFY_EMAIL);
    }

    // ─── Return success response ───────────────────
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: "Booking received!" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log the error and return error response
    Logger.log("Error in doPost: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles GET requests — useful for testing the deployment.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "Lumière Salon Booking API is active ✦",
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Sends a notification email when a new booking arrives.
 * Only runs if NOTIFY_EMAIL is set above.
 */
function sendNotificationEmail(data, email) {
  try {
    const subject = `✦ New Booking at Lumière — ${data.name} | ${data.service}`;

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF6EE; border-radius: 8px; overflow: hidden;">
        
        <div style="background: #1A1510; padding: 2rem; text-align: center;">
          <h1 style="color: #C9A84C; font-size: 1.8rem; font-weight: 400; margin: 0;">✦ Lumière Salon</h1>
          <p style="color: rgba(255,255,255,0.6); margin: 0.5rem 0 0; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">New Appointment Request</p>
        </div>

        <div style="padding: 2rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem; width: 40%;">Client Name</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #1A1510; font-weight: bold;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem;">Phone</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #1A1510;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem;">Email</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #1A1510;">${data.email}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem;">Service</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #C9A84C; font-weight: bold;">${data.service}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem;">Date</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #1A1510;">${data.date}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem;">Time Slot</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #1A1510;">${data.time}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #7A6A55; font-size: 0.85rem;">Message</td>
              <td style="padding: 0.7rem 0; border-bottom: 1px solid #E8D8C0; color: #1A1510;">${data.message}</td>
            </tr>
            <tr>
              <td style="padding: 0.7rem 0; color: #7A6A55; font-size: 0.85rem;">Heard via</td>
              <td style="padding: 0.7rem 0; color: #1A1510;">${data.source}</td>
            </tr>
          </table>
        </div>

        <div style="background: #C9A84C; padding: 1.2rem; text-align: center;">
          <p style="color: #1A1510; font-size: 0.82rem; font-weight: 600; margin: 0; letter-spacing: 0.08em; text-transform: uppercase;">
            Please call the client within 2 hours to confirm ✦
          </p>
        </div>

        <div style="padding: 1rem; text-align: center;">
          <p style="color: #7A6A55; font-size: 0.75rem; margin: 0;">
            Received at: ${data.timestamp} · Lumière Salon & Spa
          </p>
        </div>
      </div>
    `;

    GmailApp.sendEmail(email, subject, "", { htmlBody: htmlBody });
    Logger.log("Notification email sent to: " + email);

  } catch (emailError) {
    Logger.log("Failed to send notification email: " + emailError.toString());
    // Don't throw — email failure shouldn't break the booking
  }
}

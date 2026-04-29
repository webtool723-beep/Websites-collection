// =============================================
// BREWED HAVEN CAFÉ – GOOGLE APPS SCRIPT
// Paste this into: Extensions > Apps Script
// in your Google Spreadsheet
// =============================================

// ── STEP-BY-STEP SETUP ──────────────────────
// 1. Open Google Sheets: https://sheets.google.com
// 2. Create a new spreadsheet
// 3. Rename it: "Brewed Haven – Reservations"
// 4. Click Extensions > Apps Script
// 5. Delete any existing code in the editor
// 6. Paste THIS ENTIRE FILE into the editor
// 7. Click the floppy disk icon (Save)
// 8. Click "Deploy" > "New Deployment"
// 9. Click the gear icon next to "Type" > Select "Web App"
// 10. Set: Execute as = "Me"
// 11. Set: Who has access = "Anyone"
// 12. Click "Deploy"
// 13. Authorize the app when prompted
// 14. Copy the Web App URL
// 15. Paste it into main.js as GOOGLE_SHEETS_URL
// ─────────────────────────────────────────────

const SPREADSHEET_ID = "1KvO4fXJF79hmCsgJ1-lNCtEpCTUNm1ehyNwlAvkrv9w"; // Optional: paste your spreadsheet ID here for direct linking

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = e.parameter;
    const type = data.type || "Unknown";

    // Get or create the correct sheet tab
    let sheet = ss.getSheetByName(type === "Reservation" ? "Reservations" : "Enquiries");
    if (!sheet) {
      sheet = ss.insertSheet(type === "Reservation" ? "Reservations" : "Enquiries");
      // Add headers
      if (type === "Reservation") {
        sheet.appendRow([
          "Timestamp",
          "Type",
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Date",
          "Time",
          "Guests",
          "Occasion",
          "Special Notes"
        ]);
        // Style the header row
        const headerRange = sheet.getRange(1, 1, 1, 11);
        headerRange.setBackground("#1a0f0a");
        headerRange.setFontColor("#f5efe6");
        headerRange.setFontWeight("bold");
        headerRange.setFontSize(11);
        sheet.setFrozenRows(1);
        // Set column widths
        sheet.setColumnWidth(1, 160); // Timestamp
        sheet.setColumnWidth(3, 120); // First Name
        sheet.setColumnWidth(4, 120); // Last Name
        sheet.setColumnWidth(5, 200); // Email
        sheet.setColumnWidth(6, 150); // Phone
        sheet.setColumnWidth(7, 120); // Date
        sheet.setColumnWidth(8, 100); // Time
        sheet.setColumnWidth(9, 120); // Guests
        sheet.setColumnWidth(10, 150); // Occasion
        sheet.setColumnWidth(11, 250); // Notes
      } else {
        sheet.appendRow([
          "Timestamp",
          "Type",
          "First Name",
          "Last Name",
          "Email",
          "Phone",
          "Enquiry Type",
          "Message"
        ]);
        const headerRange = sheet.getRange(1, 1, 1, 8);
        headerRange.setBackground("#1a0f0a");
        headerRange.setFontColor("#f5efe6");
        headerRange.setFontWeight("bold");
        headerRange.setFontSize(11);
        sheet.setFrozenRows(1);
        sheet.setColumnWidth(1, 160);
        sheet.setColumnWidth(5, 200);
        sheet.setColumnWidth(7, 160);
        sheet.setColumnWidth(8, 350);
      }
    }

    // Append the new row of data
    if (type === "Reservation") {
      sheet.appendRow([
        data.timestamp || new Date().toLocaleString(),
        data.type || "",
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        data.phone || "",
        data.date || "",
        data.time || "",
        data.guests || "",
        data.occasion || "",
        data.notes || ""
      ]);
    } else {
      sheet.appendRow([
        data.timestamp || new Date().toLocaleString(),
        data.type || "",
        data.firstName || "",
        data.lastName || "",
        data.email || "",
        data.phone || "",
        data.enquiryType || "",
        data.message || ""
      ]);
    }

    // Style the newly added row (alternating colours)
    const lastRow = sheet.getLastRow();
    const colCount = type === "Reservation" ? 11 : 8;
    const newRowRange = sheet.getRange(lastRow, 1, 1, colCount);
    if (lastRow % 2 === 0) {
      newRowRange.setBackground("#fdf8f2");
    } else {
      newRowRange.setBackground("#ffffff");
    }
    newRowRange.setBorder(false, false, true, false, false, false, "#e8d5c0", SpreadsheetApp.BorderStyle.SOLID);

    // Send confirmation email to the café owner
    sendOwnerNotification(data);

    // Send confirmation email to the guest
    sendGuestConfirmation(data);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Error: " + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ──────────────────────────────────────────────
// SEND NOTIFICATION EMAIL TO CAFÉ OWNER
// ──────────────────────────────────────────────
function sendOwnerNotification(data) {
  try {
    const ownerEmail = Session.getActiveUser().getEmail(); // Sends to the script owner
    const isReservation = data.type === "Reservation";
    const subject = isReservation
      ? `🍽️ New Table Reservation – ${data.firstName} ${data.lastName} (${data.date} at ${data.time})`
      : `📬 New Enquiry – ${data.enquiryType || "General"} from ${data.firstName} ${data.lastName}`;

    const body = isReservation
      ? `
New Reservation Received
━━━━━━━━━━━━━━━━━━━━━━━━

Guest: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Date: ${data.date}
Time: ${data.time}
Guests: ${data.guests}
Occasion: ${data.occasion || "None"}
Special Requests: ${data.notes || "None"}
Submitted: ${data.timestamp}

──────────────────────────
Brewed Haven Café System
`
      : `
New Enquiry Received
━━━━━━━━━━━━━━━━━━━━━━━━

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Enquiry Type: ${data.enquiryType}
Message:
${data.message}

Submitted: ${data.timestamp}

──────────────────────────
Brewed Haven Café System
`;

    MailApp.sendEmail({ to: ownerEmail, subject, body });
  } catch (err) {
    Logger.log("Owner email error: " + err.toString());
  }
}

// ──────────────────────────────────────────────
// SEND CONFIRMATION EMAIL TO GUEST
// ──────────────────────────────────────────────
function sendGuestConfirmation(data) {
  try {
    if (!data.email) return;
    const isReservation = data.type === "Reservation";

    const subject = isReservation
      ? `✅ Reservation Confirmed – Brewed Haven Café`
      : `We've received your enquiry – Brewed Haven Café`;

    const htmlBody = isReservation
      ? `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a0f0a;">
  <div style="background: #1a0f0a; padding: 32px; text-align: center;">
    <h1 style="color: #f5efe6; font-size: 24px; margin: 0;">☕ Brewed Haven</h1>
    <p style="color: #c17f3a; margin: 8px 0 0; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;">Artisan Café & Bistro</p>
  </div>
  <div style="padding: 40px 32px; background: #fdf8f2; border: 1px solid #e8d5c0;">
    <h2 style="font-size: 22px; color: #1a0f0a; margin-bottom: 8px;">Your table is reserved, ${data.firstName}!</h2>
    <p style="color: #5c4030; line-height: 1.7; margin-bottom: 28px;">We're delighted to welcome you. Here's a summary of your reservation:</p>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 28px;">
      <tr style="border-bottom: 1px solid #e8d5c0;">
        <td style="padding: 12px 0; color: #8a6a55; font-size: 13px; width: 40%;">Date</td>
        <td style="padding: 12px 0; font-weight: 600;">${data.date}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e8d5c0;">
        <td style="padding: 12px 0; color: #8a6a55; font-size: 13px;">Time</td>
        <td style="padding: 12px 0; font-weight: 600;">${data.time}</td>
      </tr>
      <tr style="border-bottom: 1px solid #e8d5c0;">
        <td style="padding: 12px 0; color: #8a6a55; font-size: 13px;">Guests</td>
        <td style="padding: 12px 0; font-weight: 600;">${data.guests}</td>
      </tr>
      ${data.occasion ? `<tr style="border-bottom: 1px solid #e8d5c0;"><td style="padding: 12px 0; color: #8a6a55; font-size: 13px;">Occasion</td><td style="padding: 12px 0; font-weight: 600;">${data.occasion}</td></tr>` : ""}
      ${data.notes ? `<tr><td style="padding: 12px 0; color: #8a6a55; font-size: 13px;">Your Requests</td><td style="padding: 12px 0; font-weight: 600;">${data.notes}</td></tr>` : ""}
    </table>
    <div style="background: #fff8f0; border-left: 4px solid #c17f3a; padding: 16px 20px; margin-bottom: 28px; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; font-size: 14px; color: #5c4030; line-height: 1.6;">📍 <strong>42 Roast Lane, Brewtown</strong> · Near Central Station<br/>📞 <strong>+1 (555) 012-3456</strong> · Any changes? Call us or reply to this email.</p>
    </div>
    <p style="color: #5c4030; line-height: 1.7; margin-bottom: 0;">We look forward to serving you. If you have any questions or need to make changes, don't hesitate to reach out.</p>
  </div>
  <div style="background: #1a0f0a; padding: 20px 32px; text-align: center;">
    <p style="color: rgba(245,239,230,0.5); font-size: 12px; margin: 0;">© 2026 Brewed Haven Café · hello@brewedhaven.com</p>
  </div>
</div>
`
      : `
<div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; color: #1a0f0a;">
  <div style="background: #1a0f0a; padding: 32px; text-align: center;">
    <h1 style="color: #f5efe6; font-size: 24px; margin: 0;">☕ Brewed Haven</h1>
    <p style="color: #c17f3a; margin: 8px 0 0; font-size: 13px; letter-spacing: 0.12em; text-transform: uppercase;">Artisan Café & Bistro</p>
  </div>
  <div style="padding: 40px 32px; background: #fdf8f2; border: 1px solid #e8d5c0;">
    <h2 style="font-size: 22px; color: #1a0f0a; margin-bottom: 8px;">Thanks for getting in touch, ${data.firstName}!</h2>
    <p style="color: #5c4030; line-height: 1.7; margin-bottom: 24px;">We've received your enquiry about <strong>${data.enquiryType}</strong> and will get back to you within <strong>2 business hours</strong>.</p>
    <div style="background: #fff8f0; border-left: 4px solid #c17f3a; padding: 16px 20px; border-radius: 0 8px 8px 0;">
      <p style="margin: 0; font-size: 14px; color: #5c4030;">Can't wait? Call us directly at <strong>+1 (555) 012-3456</strong></p>
    </div>
  </div>
  <div style="background: #1a0f0a; padding: 20px 32px; text-align: center;">
    <p style="color: rgba(245,239,230,0.5); font-size: 12px; margin: 0;">© 2026 Brewed Haven Café · hello@brewedhaven.com</p>
  </div>
</div>
`;

    MailApp.sendEmail({ to: data.email, subject, htmlBody });
  } catch (err) {
    Logger.log("Guest email error: " + err.toString());
  }
}

// ──────────────────────────────────────────────
// TEST FUNCTION (run manually to verify setup)
// ──────────────────────────────────────────────
function testSetup() {
  const testData = {
    parameter: {
      type: "Reservation",
      firstName: "Test",
      lastName: "Guest",
      email: Session.getActiveUser().getEmail(),
      phone: "+1 (555) 000-0000",
      date: "2026-05-01",
      time: "10:00 AM",
      guests: "2 guests",
      occasion: "Birthday",
      notes: "Vegan menu please",
      timestamp: new Date().toLocaleString()
    }
  };
  const result = doPost(testData);
  Logger.log(result.getContent());
}

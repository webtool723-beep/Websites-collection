// =============================================
// BREWED HAVEN CAFÉ – MAIN JAVASCRIPT
// Google Sheets Integration + All Interactions
// =============================================

// ──────────────────────────────────────────────
// GOOGLE SHEETS CONFIGURATION
// ──────────────────────────────────────────────
// SETUP INSTRUCTIONS:
// 1. Go to: https://docs.google.com/spreadsheets/
// 2. Create a new spreadsheet named "Brewed Haven – Reservations"
// 3. In the spreadsheet, go to Extensions > Apps Script
// 4. Paste the Google Apps Script code from 'google-apps-script.js'
// 5. Deploy as Web App (Execute as: Me, Access: Anyone)
// 6. Copy the Web App URL and paste it below:

const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbzSfnChX27NqmpbRDW0QZMRcFPThJPFu0SjqVuG-isvovuQ-3MQuXY8bozkGPriLXuCuw/exec";
// Example: "https://script.google.com/macros/s/AKfycb.../exec"

// ──────────────────────────────────────────────
// NAVBAR SCROLL BEHAVIOUR
// ──────────────────────────────────────────────
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// Close mobile menu on link click
mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// ──────────────────────────────────────────────
// SCROLL FADE-IN ANIMATIONS
// ──────────────────────────────────────────────
function initScrollAnimations() {
  const elements = document.querySelectorAll(
    ".section-header, .about-grid, .tcard, .menu-card, .rd-item, .exp-stat, .gitem, .res-grid, .trust-bar"
  );
  elements.forEach((el) => el.classList.add("fade-in"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

// ──────────────────────────────────────────────
// MENU TABS & RENDERING
// ──────────────────────────────────────────────
function renderMenu(category) {
  const grid = document.getElementById("menuGrid");
  if (!grid) return;

  const items = menuData[category] || [];
  grid.innerHTML = items
    .map(
      (item) => `
    <div class="menu-card fade-in visible">
      <div class="mc-emoji">${item.emoji}</div>
      <h3 class="mc-name">${item.name}</h3>
      <p class="mc-desc">${item.desc}</p>
      <div class="mc-footer">
        <span class="mc-price">${item.price}</span>
        <span class="mc-tag">${item.tag}</span>
      </div>
    </div>
  `
    )
    .join("");
}

function initMenuTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const category = tab.dataset.tab;
      renderMenu(category);
    });
  });

  // Render default
  renderMenu("coffee");
}

// ──────────────────────────────────────────────
// FORM TABS (Reserve / Enquiry)
// ──────────────────────────────────────────────
function initFormTabs() {
  const ftabs = document.querySelectorAll(".ftab");
  const reservePanel = document.getElementById("reservePanel");
  const enquiryPanel = document.getElementById("enquiryPanel");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");

  ftabs.forEach((ftab) => {
    ftab.addEventListener("click", () => {
      ftabs.forEach((t) => t.classList.remove("active"));
      ftab.classList.add("active");

      const which = ftab.dataset.ftab;
      if (which === "reserve") {
        reservePanel.classList.add("active");
        enquiryPanel.classList.remove("active");
        if (btnText) btnText.textContent = "Confirm Reservation";
      } else {
        enquiryPanel.classList.add("active");
        reservePanel.classList.remove("active");
        if (btnText) btnText.textContent = "Send Enquiry";
      }
    });
  });
}

// ──────────────────────────────────────────────
// FORM VALIDATION
// ──────────────────────────────────────────────
function validateField(input) {
  const val = input.value.trim();
  if (!val && input.hasAttribute("required")) {
    input.classList.add("error");
    return false;
  }
  if (input.type === "email" && val) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(val)) {
      input.classList.add("error");
      return false;
    }
  }
  input.classList.remove("error");
  return true;
}

function getActiveFormData() {
  const activeTab = document.querySelector(".ftab.active");
  const isReservation = activeTab && activeTab.dataset.ftab === "reserve";
  const type = isReservation ? "Reservation" : "Enquiry";

  if (isReservation) {
    return {
      type,
      firstName: document.getElementById("firstName")?.value || "",
      lastName: document.getElementById("lastName")?.value || "",
      email: document.getElementById("email")?.value || "",
      phone: document.getElementById("phone")?.value || "",
      date: document.getElementById("date")?.value || "",
      time: document.getElementById("time")?.value || "",
      guests: document.getElementById("guests")?.value || "",
      occasion: document.getElementById("occasion")?.value || "",
      notes: document.getElementById("notes")?.value || "",
      message: "",
      enquiryType: "",
      timestamp: new Date().toLocaleString(),
    };
  } else {
    return {
      type,
      firstName: document.getElementById("eFirstName")?.value || "",
      lastName: document.getElementById("eLastName")?.value || "",
      email: document.getElementById("eEmail")?.value || "",
      phone: document.getElementById("ePhone")?.value || "",
      enquiryType: document.getElementById("enquiryType")?.value || "",
      message: document.getElementById("message")?.value || "",
      date: "",
      time: "",
      guests: "",
      occasion: "",
      notes: "",
      timestamp: new Date().toLocaleString(),
    };
  }
}

function validateActivePanel() {
  const activePanel = document.querySelector(".form-panel.active");
  if (!activePanel) return true;
  const required = activePanel.querySelectorAll("[required]");
  let valid = true;
  required.forEach((el) => {
    if (!validateField(el)) valid = false;
  });
  return valid;
}

// ──────────────────────────────────────────────
// SUBMIT TO GOOGLE SHEETS
// ──────────────────────────────────────────────
async function submitToGoogleSheets(data) {
  // If URL not configured, simulate success for demo
  if (
    !GOOGLE_SHEETS_URL ||
    GOOGLE_SHEETS_URL === "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE"
  ) {
    console.log("📋 Form Data (Google Sheets not connected yet):", data);
    await new Promise((r) => setTimeout(r, 1200)); // simulate delay
    return { result: "success" };
  }

  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => formData.append(key, val));

  const response = await fetch(GOOGLE_SHEETS_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Network error: " + response.status);
  return await response.json();
}

// ──────────────────────────────────────────────
// FORM SUBMIT HANDLER
// ──────────────────────────────────────────────
function initFormSubmit() {
  const form = document.getElementById("reservationForm");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");
  const formSuccess = document.getElementById("formSuccess");

  if (!form) return;

  // Live validation
  form.querySelectorAll("input, select, textarea").forEach((el) => {
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => {
      if (el.classList.contains("error")) validateField(el);
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateActivePanel()) {
      // Shake effect
      submitBtn.style.animation = "shake 0.4s ease";
      setTimeout(() => (submitBtn.style.animation = ""), 400);
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    if (btnText) btnText.style.display = "none";
    if (btnLoader) btnLoader.style.display = "inline";

    try {
      const data = getActiveFormData();
      const result = await submitToGoogleSheets(data);

      if (result.result === "success" || result.status === "success") {
        form.style.display = "none";
        if (formSuccess) formSuccess.style.display = "block";
      } else {
        throw new Error(result.error || "Submission failed");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      alert(
        "Sorry, there was an issue submitting your request. Please call us directly at +1 (555) 012-3456 or email hello@brewedhaven.com"
      );
      submitBtn.disabled = false;
      if (btnText) btnText.style.display = "inline";
      if (btnLoader) btnLoader.style.display = "none";
    }
  });
}

// ──────────────────────────────────────────────
// RESET FORM
// ──────────────────────────────────────────────
function resetForm() {
  const form = document.getElementById("reservationForm");
  const formSuccess = document.getElementById("formSuccess");
  const submitBtn = document.getElementById("submitBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  if (form) {
    form.reset();
    form.style.display = "block";
    form.querySelectorAll(".error").forEach((el) => el.classList.remove("error"));
  }
  if (formSuccess) formSuccess.style.display = "none";
  if (submitBtn) submitBtn.disabled = false;
  if (btnText) {
    btnText.style.display = "inline";
    btnText.textContent = "Confirm Reservation";
  }
  if (btnLoader) btnLoader.style.display = "none";
}

// ──────────────────────────────────────────────
// SMOOTH ANCHOR SCROLL
// ──────────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
}

// ──────────────────────────────────────────────
// SET MIN DATE FOR DATE PICKER
// ──────────────────────────────────────────────
function initDatePicker() {
  const dateInput = document.getElementById("date");
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }
}

// ──────────────────────────────────────────────
// SHAKE ANIMATION KEYFRAME (inject via JS)
// ──────────────────────────────────────────────
function injectShakeAnimation() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
  `;
  document.head.appendChild(style);
}

// ──────────────────────────────────────────────
// ACTIVE NAV LINK HIGHLIGHTING ON SCROLL
// ──────────────────────────────────────────────
function initActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-menu a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color = "";
            if (link.getAttribute("href") === `#${id}`) {
              link.style.color = "var(--gold)";
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => observer.observe(s));
}

// ──────────────────────────────────────────────
// GALLERY ITEMS – add subtle parallax on hover
// ──────────────────────────────────────────────
function initGalleryHover() {
  document.querySelectorAll(".gitem").forEach((item) => {
    item.addEventListener("mousemove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
      item.style.transform = `scale(1.03) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
    });
  });
}

// ──────────────────────────────────────────────
// INIT ALL
// ──────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  injectShakeAnimation();
  initScrollAnimations();
  initMenuTabs();
  initFormTabs();
  initFormSubmit();
  initSmoothScroll();
  initDatePicker();
  initActiveNavHighlight();
  initGalleryHover();

  console.log(
    "%c☕ Brewed Haven Café",
    "font-size:18px; font-family: serif; color:#c17f3a; font-weight:bold;"
  );
  console.log(
    "%cTo connect Google Sheets: update GOOGLE_SHEETS_URL in main.js",
    "font-size:12px; color:#888;"
  );
});

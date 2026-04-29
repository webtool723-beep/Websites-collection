/* =============================================
   LUMIÈRE SALON — JavaScript
   Features: Navbar, Scroll Animations,
   Form Submission → Google Sheets
   ============================================= */

// =============================================
// CONFIGURATION — UPDATE THESE VALUES
// =============================================

/**
 * HOW TO CONNECT TO GOOGLE SHEETS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions > Apps Script
 * 3. Paste the Apps Script code from google-sheets-script.js
 * 4. Deploy as a Web App (Anyone can access)
 * 5. Copy the Web App URL and paste it below
 */
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbx7XHwmu9L84AGhSd06Yhp9ylx8fngTHAg9UUBMytdBhoiYjvl_keHJZlrbHkvhNaXA_A/exec";

// =============================================
// NAVBAR — Scroll Effect
// =============================================
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// =============================================
// HAMBURGER MENU — Mobile
// =============================================
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
let menuOpen = false;

hamburger.addEventListener("click", () => {
  menuOpen = !menuOpen;
  mobileMenu.style.display = menuOpen ? "flex" : "none";
  hamburger.classList.toggle("active", menuOpen);
});

// Close mobile menu when a link is clicked
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    menuOpen = false;
    mobileMenu.style.display = "none";
    hamburger.classList.remove("active");
  });
});

// =============================================
// SCROLL ANIMATIONS — Intersection Observer
// =============================================
const observerOptions = {
  threshold: 0.12,
  rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add("visible");
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Apply fade-up animation to key elements
const animatedSelectors = [
  ".service-card",
  ".testi-card",
  ".tp",
  ".about-para",
  ".gal-item",
  ".trust-item",
  ".rb",
  ".section-header",
  ".booking-info",
  ".booking-form-wrap"
];

document.querySelectorAll(animatedSelectors.join(", ")).forEach(el => {
  el.classList.add("fade-up");
  observer.observe(el);
});

// =============================================
// SET MIN DATE — Prevent Past Date Selection
// =============================================
const dateInput = document.getElementById("fdate");
if (dateInput) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  dateInput.min = `${yyyy}-${mm}-${dd}`;

  // Set max date to 3 months from now
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const mxYYYY = maxDate.getFullYear();
  const mxMM = String(maxDate.getMonth() + 1).padStart(2, "0");
  const mxDD = String(maxDate.getDate()).padStart(2, "0");
  dateInput.max = `${mxYYYY}-${mxMM}-${mxDD}`;
}

// =============================================
// FORM SUBMISSION → GOOGLE SHEETS
// =============================================
const bookingForm = document.getElementById("bookingForm");
const formSuccess = document.getElementById("formSuccess");
const submitBtn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const btnLoader = document.getElementById("btnLoader");

if (bookingForm) {
  bookingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Basic validation
    const name = document.getElementById("fname").value.trim();
    const phone = document.getElementById("fphone").value.trim();
    const date = document.getElementById("fdate").value;
    const time = document.getElementById("ftime").value;
    const service = document.getElementById("fservice").value;

    if (!name || !phone || !date || !time || !service) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    if (!validatePhone(phone)) {
      showToast("Please enter a valid phone number.", "error");
      return;
    }

    // Collect form data
    const formData = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      name: name,
      phone: phone,
      email: document.getElementById("femail").value.trim() || "Not provided",
      date: formatDate(date),
      time: time,
      service: service,
      message: document.getElementById("fmessage").value.trim() || "None",
      source: document.getElementById("fsource").value || "Not specified"
    };

    // Show loading state
    setLoadingState(true);

    try {
      // Submit to Google Sheets
      await submitToGoogleSheets(formData);

      // Show success state
      bookingForm.style.display = "none";
      formSuccess.style.display = "block";
      showToast("Your appointment has been booked! 🎉", "success");

    } catch (error) {
      console.error("Submission error:", error);
      // Even if network fails, show success (fallback for demo)
      bookingForm.style.display = "none";
      formSuccess.style.display = "block";
      showToast("Appointment request received!", "success");
    } finally {
      setLoadingState(false);
    }
  });
}

// =============================================
// GOOGLE SHEETS SUBMISSION FUNCTION
// =============================================
async function submitToGoogleSheets(data) {
  // Check if URL is configured
  if (GOOGLE_SHEET_URL.includes("YOUR_SCRIPT_ID_HERE")) {
    console.warn("⚠️ Google Sheets URL not configured. Please update GOOGLE_SHEET_URL in script.js");
    // Simulate a delay for demo purposes
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { success: true, demo: true };
  }

  const response = await fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    mode: "no-cors", // Required for Google Apps Script
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });

  // no-cors mode returns opaque response, so we assume success
  return { success: true };
}

// =============================================
// HELPER FUNCTIONS
// =============================================

function setLoadingState(loading) {
  submitBtn.disabled = loading;
  btnText.style.display = loading ? "none" : "inline";
  btnLoader.style.display = loading ? "inline" : "none";
}

function validatePhone(phone) {
  // Accept Indian and international formats
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  return /^\d{10,13}$/.test(cleaned);
}

function formatDate(dateStr) {
  if (!dateStr) return "Not specified";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message, type = "success") {
  // Remove existing toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "2rem",
    right: "2rem",
    padding: "1rem 1.5rem",
    borderRadius: "6px",
    fontSize: "0.88rem",
    fontFamily: "'Jost', sans-serif",
    fontWeight: "500",
    zIndex: "9999",
    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
    transform: "translateY(20px)",
    opacity: "0",
    transition: "all 0.35s ease",
    maxWidth: "320px",
    lineHeight: "1.5"
  });

  if (type === "success") {
    toast.style.background = "#1A1510";
    toast.style.color = "#C9A84C";
    toast.style.border = "1px solid rgba(201,168,76,0.3)";
  } else {
    toast.style.background = "#2D1515";
    toast.style.color = "#E57373";
    toast.style.border = "1px solid rgba(229,115,115,0.3)";
  }

  document.body.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.transform = "translateY(0)";
    toast.style.opacity = "1";
  });

  // Auto remove
  setTimeout(() => {
    toast.style.transform = "translateY(10px)";
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// =============================================
// SMOOTH SCROLL — Nav Links
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  });
});

// =============================================
// ACTIVE NAV LINK — Highlight on Scroll
// =============================================
const sections = document.querySelectorAll("section[id]");
const navLinksAll = document.querySelectorAll(".nav-links a, .mobile-menu a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinksAll.forEach(link => {
    link.classList.remove("active-link");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active-link");
    }
  });
});

// =============================================
// GALLERY — Hover Effect Enhancement
// =============================================
document.querySelectorAll(".gal-item").forEach(item => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "scale(1.02)";
    item.style.zIndex = "2";
    item.style.transition = "transform 0.4s ease";
  });
  item.addEventListener("mouseleave", () => {
    item.style.transform = "scale(1)";
    item.style.zIndex = "1";
  });
});

// =============================================
// COUNTER ANIMATION — Stats
// =============================================
function animateCounter(el, target, suffix = "") {
  const duration = 2000;
  const step = 16;
  const increment = target / (duration / step);
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, step);
}

// Trigger counters when hero stats are visible
const statsSection = document.querySelector(".hero-stats");
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statNums = document.querySelectorAll(".stat-num");
        const targets = [12, 48, 5000, 4.9];
        const suffixes = ["+", "", "+", "★"];
        statNums.forEach((el, i) => {
          animateCounter(el, targets[i], suffixes[i]);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

// =============================================
// ADD ACTIVE LINK STYLE (CSS)
// =============================================
const styleEl = document.createElement("style");
styleEl.textContent = `
  .nav-links .active-link {
    color: var(--gold-light) !important;
  }
  .hamburger.active span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }
  .hamburger.active span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
`;
document.head.appendChild(styleEl);

// =============================================
// INIT LOG
// =============================================
console.log(
  "%c✦ Lumière Salon Website Loaded",
  "color: #C9A84C; font-size: 14px; font-weight: bold; font-family: Georgia, serif;"
);
console.log(
  "%cTo connect Google Sheets: Update GOOGLE_SHEET_URL in script.js",
  "color: #888; font-size: 11px;"
);

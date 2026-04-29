/* ==========================================================
   IRONPEAK GYM — script.js  (v2 — fully debugged)
   ========================================================== */

// ─── CONFIG ────────────────────────────────────────────────
// Replace with your Google Apps Script Web App URL
// (follow README.md → "Connecting the Form to Google Sheets")
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwOIepwTcBtSvcBo6viSVSw7_KtRo1AbGi_qow8YahlzMzoXgATSIuL7qKoNNzIeyQM/exec";
// ───────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {

  /* ────────────────────────────────────────
     1. NAVBAR — scroll shrink effecthttps://script.google.com/macros/s/AKfycbwOIepwTcBtSvcBo6viSVSw7_KtRo1AbGi_qow8YahlzMzoXgATSIuL7qKoNNzIeyQM/exec
  ──────────────────────────────────────── */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
    }, { passive: true });
  }

  /* ────────────────────────────────────────
     2. MOBILE MENU
  ──────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    mobileMenu.classList.add("open");
    document.body.style.overflow = "hidden";
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
    spans[1].style.opacity  = "0";
    spans[2].style.transform = "rotate(-45deg) translate(5px, -5px)";
  }

  function closeMenu() {
    menuOpen = false;
    mobileMenu.classList.remove("open");
    document.body.style.overflow = "";
    const spans = hamburger.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity  = "";
    spans[2].style.transform = "";
  }

  window.closeMenu = closeMenu;

  if (hamburger) {
    hamburger.addEventListener("click", () => menuOpen ? closeMenu() : openMenu());
  }

  /* ────────────────────────────────────────
     3. SCROLL REVEAL
  ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          setTimeout(() => entry.target.classList.add("visible"), delay);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ────────────────────────────────────────
     4. SMOOTH ANCHOR SCROLL
  ──────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });

  /* ────────────────────────────────────────
     5. COUNTER ANIMATION (hero stats)
     FIX: read suffix BEFORE animating so
     textContent overwrites do not corrupt it
  ──────────────────────────────────────── */
  function animateCounter(el, target, suffix, duration) {
    duration = duration || 1800;
    const isDecimal = !Number.isInteger(target);
    let startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const value    = isDecimal
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll(".stat-num");
  if (statNums.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el  = entry.target;
          const raw = el.textContent.trim();
          const match = raw.match(/^([\d,]+\.?\d*)(.*)/);
          if (match) {
            const num    = parseFloat(match[1].replace(/,/g, ""));
            const suffix = match[2].trim();
            animateCounter(el, num, suffix);
          }
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach((el) => statsObserver.observe(el));
  }

  /* ────────────────────────────────────────
     6. DATE PICKER — block past dates
  ──────────────────────────────────────── */
  const dateInput = document.getElementById("preferred_date");
  if (dateInput) {
    dateInput.setAttribute("min", new Date().toISOString().split("T")[0]);
  }

  /* ────────────────────────────────────────
     7. FORM VALIDATION & GOOGLE SHEETS
  ──────────────────────────────────────── */
  const form        = document.getElementById("enquiryForm");
  const submitBtn   = document.getElementById("submitBtn");
  const btnText     = document.getElementById("btnText");
  const btnLoader   = document.getElementById("btnLoader");
  const formSuccess = document.getElementById("form-success");

  function showFieldError(inputEl, message) {
    inputEl.style.borderColor = "#e63b2e";
    const parent = inputEl.closest(".form-group") || inputEl.parentElement;
    let errEl = parent.querySelector(".field-error");
    if (!errEl) {
      errEl = document.createElement("span");
      errEl.className = "field-error";
      errEl.style.cssText =
        "color:#e63b2e;font-size:11px;margin-top:5px;display:block;" +
        "font-family:var(--font-cond);letter-spacing:1px;";
      parent.appendChild(errEl);
    }
    errEl.textContent = message;
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach((el) => el.remove());
    document.querySelectorAll(
      "#enquiryForm input, #enquiryForm select, #enquiryForm textarea"
    ).forEach((el) => (el.style.borderColor = ""));
  }

  function validateForm(data) {
    let valid = true;

    if (!data.name || data.name.length < 2) {
      showFieldError(document.getElementById("name"), "Please enter your full name.");
      valid = false;
    }

    const phoneClean = data.phone.replace(/[\s\-()]/g, "");
    if (!phoneClean || !/^\+?\d{7,15}$/.test(phoneClean)) {
      showFieldError(document.getElementById("phone"), "Enter a valid phone number (7-15 digits).");
      valid = false;
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      showFieldError(document.getElementById("email"), "Enter a valid email address.");
      valid = false;
    }

    const consent = document.getElementById("consent");
    if (!consent.checked) {
      const consentWrapper = document.querySelector(".form-consent");
      let errEl = consentWrapper.querySelector(".field-error");
      if (!errEl) {
        errEl = document.createElement("span");
        errEl.className = "field-error";
        errEl.style.cssText =
          "color:#e63b2e;font-size:11px;margin-top:5px;display:block;" +
          "font-family:var(--font-cond);letter-spacing:1px;";
        consentWrapper.appendChild(errEl);
      }
      errEl.textContent = "Please tick the consent box to continue.";
      valid = false;
    }

    return valid;
  }

  function setLoading(isLoading) {
    submitBtn.disabled      = isLoading;
    btnText.style.display   = isLoading ? "none"   : "inline";
    btnLoader.style.display = isLoading ? "inline" : "none";
  }

  function showSuccess() {
    form.style.display        = "none";
    formSuccess.style.display = "block";
    formSuccess.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();

      const payload = {
        name:           document.getElementById("name").value.trim(),
        phone:          document.getElementById("phone").value.trim(),
        email:          document.getElementById("email").value.trim(),
        program:        document.getElementById("program").value,
        goal:           document.getElementById("goal").value,
        preferred_date: document.getElementById("preferred_date").value,
        message:        document.getElementById("message").value.trim(),
        timestamp:      new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        source:         "Website Enquiry Form",
      };

      if (!validateForm(payload)) return;

      setLoading(true);

      try {
        if (
          GOOGLE_SCRIPT_URL &&
          GOOGLE_SCRIPT_URL !== "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
        ) {
          await fetch(GOOGLE_SCRIPT_URL, {
            method:  "POST",
            mode:    "no-cors",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
          });
        } else {
          await new Promise((res) => setTimeout(res, 1500));
          console.group("IronPeak Form — DEMO MODE");
          console.log("Payload:", payload);
          console.log("Set GOOGLE_SCRIPT_URL in script.js to go live.");
          console.groupEnd();
        }

        showSuccess();

      } catch (err) {
        console.error("Submission error:", err);
        showSuccess();
      } finally {
        setLoading(false);
      }
    });
  }

  /* ────────────────────────────────────────
     8. HERO PARALLAX
     FIX: clamp opacity to [0,1]
  ──────────────────────────────────────── */
  const hero        = document.getElementById("hero");
  const heroContent = hero ? hero.querySelector(".hero-content") : null;

  if (heroContent) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const limit    = window.innerHeight;
      if (scrolled < limit) {
        heroContent.style.transform = "translateY(" + (scrolled * 0.18) + "px)";
        const fade = 1 - Math.max(0, (scrolled - limit * 0.3) / (limit * 0.6));
        heroContent.style.opacity = Math.max(0, Math.min(1, fade));
      }
    }, { passive: true });
  }

}); // end DOMContentLoaded

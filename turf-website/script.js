/* ===================================================
   GreenZone Turf — Main JavaScript
   - Navbar scroll effect
   - Mobile hamburger menu
   - Animated counters
   - Scroll-triggered animations
   - Booking form with Google Sheets integration
=================================================== */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity   = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }
});

// Close nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  });
});

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current;
  }, 16);
}

const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
    }
  });
}, { threshold: 0.4 });

const statsStrip = document.querySelector('.stats-strip');
if (statsStrip) counterObserver.observe(statsStrip);

// ===== SCROLL-TRIGGERED FADE-IN ANIMATIONS =====
const fadeEls = document.querySelectorAll(
  '.sport-card, .amenity-item, .testi-card, .gal-item, .cd-item'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = `${(i % 4) * 0.08}s`;
      entry.target.classList.add('animate-in');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeObserver.observe(el);
});

// When animate-in class is added, reveal element
const style = document.createElement('style');
style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
document.head.appendChild(style);

// ===== SET MIN DATE FOR BOOKING FORM =====
const dateInput = document.getElementById('date');
if (dateInput) {
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${yyyy}-${mm}-${dd}`;
}

// ===== GOOGLE SHEETS FORM SUBMISSION =====
/*
  HOW TO CONNECT TO GOOGLE SHEETS:
  ─────────────────────────────────────────────────────────────────
  1. Open Google Sheets → create a new spreadsheet.
  2. Name columns: Timestamp | Name | Phone | Email | Sport |
     Date | Time | Players | Message
  3. Go to Extensions → Apps Script → paste the code from
     "google-apps-script.js" (included in this ZIP).
  4. Click "Deploy" → "New Deployment" → Web App.
     - Execute as: Me
     - Who has access: Anyone
  5. Copy the Web App URL and paste it as the value of
     GOOGLE_SHEET_URL below.
  ─────────────────────────────────────────────────────────────────
*/
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzv9Inyim7eX0gVM_ViDRfa33xkD7dknokOYC6Q6-Bgqk6EkXZl_6Ody4j0jdi2_45F/exec';

const bookingForm  = document.getElementById('bookingForm');
const submitBtn    = document.getElementById('submitBtn');
const btnText      = document.getElementById('btnText');
const btnLoader    = document.getElementById('btnLoader');
const formSuccess  = document.getElementById('formSuccess');
const formError    = document.getElementById('formError');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic validation
    const required = bookingForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
        field.style.borderColor = '#ef4444';
        valid = false;
      }
    });
    if (!valid) {
      shakeForm();
      return;
    }

    // Phone validation (basic Indian number)
    const phone = document.getElementById('phone').value.trim();
    if (!/^[+\d\s\-()]{10,15}$/.test(phone)) {
      document.getElementById('phone').style.borderColor = '#ef4444';
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display  = 'none';
    btnLoader.style.display = 'inline';

    // Collect form data
    const formData = {
      timestamp : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name      : document.getElementById('name').value.trim(),
      phone     : document.getElementById('phone').value.trim(),
      email     : document.getElementById('email').value.trim(),
      sport     : document.getElementById('sport').value,
      date      : document.getElementById('date').value,
      time      : document.getElementById('time').value,
      players   : document.getElementById('players').value || 'Not specified',
      message   : document.getElementById('message').value.trim() || 'None',
    };

    // Submit to Google Sheets
    try {
      if (GOOGLE_SHEET_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
        // Demo mode — no real URL configured yet
        await simulateDelay(1200);
        showSuccess();
      } else {
        const response = await fetch(GOOGLE_SHEET_URL, {
          method : 'POST',
          mode   : 'no-cors',       // Google Apps Script requires no-cors
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify(formData),
        });
        // no-cors returns opaque response — we assume success
        showSuccess();
      }
    } catch (err) {
      console.error('Form submission error:', err);
      showError();
    }
  });
}

function showSuccess() {
  bookingForm.style.display  = 'none';
  formSuccess.style.display  = 'block';
  formError.style.display    = 'none';
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showError() {
  submitBtn.disabled         = false;
  btnText.style.display      = 'inline';
  btnLoader.style.display    = 'none';
  formError.style.display    = 'block';
}

function shakeForm() {
  const box = document.querySelector('.booking-form-box');
  box.style.animation = 'shake 0.4s ease';
  setTimeout(() => { box.style.animation = ''; }, 400);
}

function simulateDelay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-8px); }
    40%     { transform: translateX(8px); }
    60%     { transform: translateX(-6px); }
    80%     { transform: translateX(6px); }
  }
`;
document.head.appendChild(shakeStyle);

// Clear red border on input focus
bookingForm && bookingForm.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('focus', () => { el.style.borderColor = ''; });
});

// ===== SMOOTH ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) current = section.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--green-primary)';
    }
  });
});

// ===== SPORT CARD HOVER RIPPLE =====
document.querySelectorAll('.sport-card').forEach(card => {
  card.addEventListener('mouseenter', function(e) {
    const rect = card.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:10px; height:10px;
      background:rgba(34,197,94,0.15);
      transform:scale(0); pointer-events:none;
      left:${e.clientX - rect.left - 5}px;
      top:${e.clientY - rect.top - 5}px;
      transition: transform 0.6s ease, opacity 0.6s ease;
    `;
    card.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = 'scale(40)';
      ripple.style.opacity   = '0';
    });
    setTimeout(() => ripple.remove(), 700);
  });
});

console.log('%cGreenZone Turf 🏟️', 'color:#22c55e;font-size:20px;font-weight:bold;');
console.log('%cWebsite loaded successfully.', 'color:#ffffff;font-size:12px;');

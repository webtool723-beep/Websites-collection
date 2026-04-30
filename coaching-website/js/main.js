// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 30) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// ✅ Contact form sheet URL (already set up)
const CONTACT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwmZkkadMBoGDVz1rKZN6kLl0hXrMXrMUq2k9YV9eWVWFiN9Va318UwQbL3MQLFk9hV/exec";

// ✅ Enroll form sheet URL — paste your NEW script URL here
const ENROLL_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxn8u1Hxvc5BG5BMQnELfj-BDfcjeZ0zXF8fLYjVo5WJ5DCxYrm_4vPY6BO7REpiPlV/exec";

// Build payload based on which form is submitting
function buildPayload(form) {
  const formType = form.getAttribute('data-form');
  const inputs = [...form.querySelectorAll('input, select, textarea')];

  if (formType === 'enroll') {
    return {
      studentName: inputs[0]?.value || "",
      parentName:  inputs[1]?.value || "",
      phone:       inputs[2]?.value || "",
      altPhone:    inputs[3]?.value || "",
      email:       inputs[4]?.value || "",
      class:       inputs[5]?.value || "",
      board:       inputs[6]?.value || "",
      course:      inputs[7]?.value || "",
      timing:      inputs[8]?.value || "",
      source:      inputs[9]?.value || "",
      message:     inputs[10]?.value || ""
    };
  } else {
    return {
      name:    inputs[0]?.value || "",
      phone:   inputs[1]?.value || "",
      email:   inputs[2]?.value || "",
      class:   inputs[3]?.value || "",
      message: inputs[4]?.value || ""
    };
  }
}

// Form submission handler
const forms = document.querySelectorAll('form[data-form]');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formType = form.getAttribute('data-form');
    const scriptURL = formType === 'enroll' ? ENROLL_SCRIPT_URL : CONTACT_SCRIPT_URL;

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;

    const payload = buildPayload(form);

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      // Show success state
      const successMsg = form.closest('.enroll-form-box, .contact-form-box')?.querySelector('.success-msg');
      if (successMsg) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
      } else {
        btn.innerHTML = 'Submitted ✓';
        btn.style.background = '#22c55e';
        setTimeout(() => {
          form.reset();
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }

    } catch (err) {
      btn.innerHTML = 'Failed — Try Again';
      btn.style.background = '#ef4444';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
});

// Active nav link highlight
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  } else {
    a.classList.remove('active');
  }
});

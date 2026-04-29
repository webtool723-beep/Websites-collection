// ==========================================
// GREEN CUCINA — Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // ----------------------------------------
  // NAVBAR: Scroll effect + hamburger
  // ----------------------------------------
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    // Animate hamburger to X
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close nav on link click (mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ----------------------------------------
  // MENU TABS: Filter
  // ----------------------------------------
  const tabBtns = document.querySelectorAll('.tab-btn');
  const menuCards = document.querySelectorAll('.menu-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active state
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;

      menuCards.forEach(card => {
        if (tab === 'all' || card.dataset.cat === tab) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ----------------------------------------
  // SCROLL REVEAL ANIMATIONS
  // ----------------------------------------
  const revealEls = document.querySelectorAll(
    '.about__grid, .menu-card, .exp-item, .gallery-item, .reserve-wrap, .contact-grid, .section-header'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ----------------------------------------
  // STAGGERED ANIMATION for cards
  // ----------------------------------------
  const staggerGroups = [
    '.menu-card', '.exp-item', '.gallery-item'
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  // ----------------------------------------
  // RESERVATION FORM
  // ----------------------------------------
  const reserveForm = document.getElementById('reserveForm');

  // Set min date to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value;
      const guests = document.getElementById('guests').value;

      if (!name || !phone || !date || !time || !guests) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }

      // Simulate booking confirmation
      const btn = reserveForm.querySelector('button[type="submit"]');
      btn.textContent = 'Confirming...';
      btn.disabled = true;

      setTimeout(() => {
        showToast(`🎉 Thank you, ${name}! Your table for ${guests} on ${formatDate(date)} at ${time} is confirmed. We'll reach you at ${phone}.`, 'success');
        reserveForm.reset();
        btn.textContent = 'Confirm Reservation';
        btn.disabled = false;
      }, 1400);
    });
  }

  // ----------------------------------------
  // TOAST NOTIFICATION
  // ----------------------------------------
  function showToast(message, type = 'success') {
    // Remove existing toast
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;

    toast.style.cssText = `
      position: fixed;
      bottom: 32px;
      right: 32px;
      max-width: 420px;
      padding: 16px 24px;
      border-radius: 12px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.9rem;
      line-height: 1.5;
      color: white;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: slideInToast 0.4s ease forwards;
      background: ${type === 'success' ? '#2d5a3d' : '#c0392b'};
    `;

    document.body.appendChild(toast);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInToast {
        from { transform: translateX(120%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    if (!document.getElementById('toast-styles')) {
      style.id = 'toast-styles';
      document.head.appendChild(style);
    }

    setTimeout(() => {
      toast.style.animation = 'none';
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(120%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 5000);
  }

  // ----------------------------------------
  // SMOOTH ANCHOR SCROLL
  // ----------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ----------------------------------------
  // UTILITY
  // ----------------------------------------
  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-IN', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  }

});

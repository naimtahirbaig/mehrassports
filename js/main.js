// === MOBILE NAV TOGGLE ===
function toggleNav() {
  document.querySelector('.main-nav').classList.toggle('open');
}

// === SCROLL ANIMATIONS ===
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// === SCROLL TO TOP BUTTON ===
window.addEventListener('scroll', () => {
  const btn = document.querySelector('.scroll-top');
  if (btn) {
    if (window.scrollY > 400) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }
});

// === HERO SLIDER ===
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.slider-dots span');
if (slides.length > 0) {
  function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }
  function changeSlide(dir) { goToSlide(currentSlide + dir); }
  setInterval(() => changeSlide(1), 5000);
  window.goToSlide = goToSlide;
  window.changeSlide = changeSlide;
}

// === COUNTER ANIMATION ===
function animateCounters() {
  document.querySelectorAll('.stat-item .number').forEach(el => {
    const target = parseInt(el.textContent);
    const suffix = el.textContent.replace(/[0-9]/g, '');
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current + suffix;
    }, 25);
  });
}
const statsBanner = document.querySelector('.stats-banner');
if (statsBanner) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounters(); statsObserver.unobserve(e.target); }
    });
  }, { threshold: 0.3 });
  statsObserver.observe(statsBanner);
}

// === TABS (Product Detail) ===
document.querySelectorAll('.tab-nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-nav button').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// === CONTACT FORM ===
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you within 24 hours.');
    contactForm.reset();
  });
}

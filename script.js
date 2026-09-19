/**
 * Tayruni Kashitsu — Cosplay Portfolio
 * script.js — Comportamiento interactivo profesional
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Año actual en el footer ──────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;

  // ── 2. Navbar: scroll shadow + active link ──────────────────────────────
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sombra de navegación al hacer scroll
  const onScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 50);
    }
    updateActiveLink();
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // Resaltar enlace activo según sección visible
  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  // ── 3. Menú hamburguesa ─────────────────────────────────────────────────
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navMenu.classList.toggle('active');
      document.body.style.overflow = !expanded ? 'hidden' : '';
    });

    // Cerrar al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Cerrar al hacer clic fuera
    document.addEventListener('click', e => {
      if (navMenu.classList.contains('active') &&
          !navToggle.contains(e.target) &&
          !navMenu.contains(e.target)) {
        closeMenu();
      }
    });

    // Cerrar con Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) closeMenu();
    });

    function closeMenu() {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // ── 4. Scroll Reveal con IntersectionObserver ───────────────────────────
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback para navegadores sin soporte
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  // ── 5. Carrusel interactivo (Proyecto Destacado) ────────────────────────
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides      = carousel.querySelectorAll('.carousel-slide');
    const dots        = carousel.querySelectorAll('.carousel-dot');
    const counter     = carousel.querySelector('.carousel-counter');
    const prevBtn     = carousel.querySelector('.carousel-btn.prev');
    const nextBtn     = carousel.querySelector('.carousel-btn.next');
    const totalSlides = slides.length;
    let currentIndex  = 0;
    let autoplayTimer;

    function goToSlide(index) {
      // Wrap alrededor
      currentIndex = ((index % totalSlides) + totalSlides) % totalSlides;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentIndex);
      });

      dots.forEach((dot, i) => {
        const active = i === currentIndex;
        dot.classList.toggle('active', active);
        dot.setAttribute('aria-selected', String(active));
      });

      if (counter) counter.textContent = `${currentIndex + 1} / ${totalSlides}`;

      // Reiniciar autoplay al navegar manualmente
      resetAutoplay();
    }

    // Autoplay cada 4 segundos
    function startAutoplay() {
      autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), 4000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    // Pausar al hacer hover / focus en el carousel
    carousel.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carousel.addEventListener('mouseleave', startAutoplay);
    carousel.addEventListener('focusin',    () => clearInterval(autoplayTimer));
    carousel.addEventListener('focusout',   startAutoplay);

    prevBtn?.addEventListener('click', e => { e.stopPropagation(); goToSlide(currentIndex - 1); });
    nextBtn?.addEventListener('click', e => { e.stopPropagation(); goToSlide(currentIndex + 1); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', e => { e.stopPropagation(); goToSlide(i); });
    });

    // Swipe táctil
    let touchStartX = 0, touchStartY = 0;

    carousel.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    carousel.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        goToSlide(dx < 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });

    // Teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft')  { goToSlide(currentIndex - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { goToSlide(currentIndex + 1); e.preventDefault(); }
    });

    startAutoplay();
  }

  // ── 6. Formulario de contacto ───────────────────────────────────────────
  const contactForm  = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();

      const name    = contactForm.querySelector('[name="name"]')?.value.trim();
      const email   = contactForm.querySelector('[name="email"]')?.value.trim();
      const message = contactForm.querySelector('[name="message"]')?.value.trim();

      if (!name || !email || !message) {
        setFeedback('Por favor, completa todos los campos requeridos.', 'var(--pink)');
        return;
      }

      // Simulación de envío
      const sendBtn = contactForm.querySelector('.send');
      if (sendBtn) {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Enviando…';
      }

      setTimeout(() => {
        setFeedback('¡Gracias por tu mensaje! Me pondré en contacto contigo pronto ♡', 'var(--cyan)');
        contactForm.reset();
        if (sendBtn) {
          sendBtn.disabled = false;
          sendBtn.innerHTML = 'Enviar mensaje <span aria-hidden="true">→</span>';
        }
        setTimeout(() => setFeedback('', ''), 6000);
      }, 900);
    });

    function setFeedback(msg, color) {
      if (!formFeedback) return;
      formFeedback.textContent = msg;
      formFeedback.style.color = color;
    }
  }

});

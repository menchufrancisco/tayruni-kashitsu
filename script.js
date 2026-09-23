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
      clearInterval(autoplayTimer);
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

  // ── 6. Copiar correo en contacto ───────────────────────────────────────
  const formFeedback = document.getElementById('form-feedback');
  const copyEmailBtn = document.getElementById('copy-email');

  function setFeedback(msg, color) {
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.style.color = color;
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.dataset?.email || 'tayrunikshitsu@gmail.com';

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(email);
          setFeedback('Correo copiado ✓', 'var(--cyan)');
        } else {
          throw new Error('Clipboard unavailable');
        }
      } catch (error) {
        setFeedback(`No se pudo copiar automáticamente. Correo: ${email}`, 'var(--pink)');
      }

      setTimeout(() => {
        if (formFeedback) {
          formFeedback.textContent = '';
          formFeedback.style.color = '';
        }
      }, 3000);
    });
  }

  // ── 7. Lightbox para las fotos principales ─────────────────────────────
  const lightbox = document.getElementById('image-lightbox');
  const lightboxImage = lightbox?.querySelector('.lightbox-image');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');
  const zoomablePhotos = document.querySelectorAll('.zoomable-photo');
  let lastFocusedPhoto;

  function closeLightbox() {
    if (!lightbox || !lightboxImage) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lightboxImage.src = '';
    lastFocusedPhoto?.focus();
  }

  function openLightbox(photo) {
    if (!lightbox || !lightboxImage) return;
    lastFocusedPhoto = photo;
    lightboxImage.src = photo.currentSrc || photo.src;
    lightboxImage.alt = photo.alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose?.focus();
  }

  zoomablePhotos.forEach(photo => {
    photo.addEventListener('click', () => openLightbox(photo));
    photo.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(photo);
      }
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && lightbox?.classList.contains('is-open')) {
      closeLightbox();
    }
  });

});

/**
 * Tayruni Kashitsu — Cosplay Portfolio
 * Comportamiento interactivo y navegación responsive (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Menú de navegación responsive (móvil y tablet)
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
    });

    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (event) => {
      if (!navToggle.contains(event.target) && !navMenu.contains(event.target) && navMenu.classList.contains('active')) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
      }
    });
  }

  // 2. Manejo del formulario de contacto
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validación simple
      const name = contactForm.querySelector('input[name="name"]')?.value.trim();
      const email = contactForm.querySelector('input[name="email"]')?.value.trim();
      const message = contactForm.querySelector('textarea[name="message"]')?.value.trim();

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.textContent = 'Por favor, completa todos los campos requeridos.';
          formFeedback.style.color = 'var(--pink)';
        }
        return;
      }

      // Mensaje de éxito amigable
      if (formFeedback) {
        formFeedback.textContent = '¡Gracias por tu mensaje! Me pondré en contacto contigo pronto ♡';
        formFeedback.style.color = 'var(--cyan)';
      }

      contactForm.reset();

      setTimeout(() => {
        if (formFeedback) {
          formFeedback.textContent = '';
        }
      }, 6000);
    });
  }

  // 3. Carrusel interactivo para Proyecto Destacado (Ahri)
  const carousel = document.querySelector('.carousel-container');
  if (carousel) {
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const counter = carousel.querySelector('.carousel-counter');
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    let currentIndex = 0;
    const totalSlides = slides.length;

    function goToSlide(index) {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('active', isActive);
      });

      dots.forEach((dot, i) => {
        const isActive = i === currentIndex;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${totalSlides}`;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        goToSlide(i);
      });
    });

    // Soporte para gestos táctiles (Swipe en móviles y tablets)
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      // Verificar que el desplazamiento horizontal sea mayor al vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          goToSlide(currentIndex + 1); // Swipe hacia la izquierda
        } else {
          goToSlide(currentIndex - 1); // Swipe hacia la derecha
        }
      }
    }

    // Navegación con teclado
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
      }
    });
  }
});


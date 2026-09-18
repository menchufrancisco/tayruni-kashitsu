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
});

/**
 * Crypt Tech - Main JavaScript
 * Optimized for performance and accessibility
 */

(function() {
  'use strict';

  // DOM Elements
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.querySelector('.btn-submit');

  // Phone number for WhatsApp
  const PHONE = '5598982344038';

  // ================================
  // Mobile Menu
  // ================================
  function initMobileMenu() {
    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
      
      // Trap focus in mobile menu when open
      if (isOpen) {
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
      }
    });
  }

  // ================================
  // Navbar Scroll Effect
  // ================================
  function initNavbarScroll() {
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.pageYOffset;
          
          if (currentScroll > 50) {
            navbar.classList.add('scrolled');
          } else {
            navbar.classList.remove('scrolled');
          }

          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ================================
  // Smooth Scroll for Anchor Links
  // ================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          history.pushState(null, null, href);
        }
      });
    });
  }

  // ================================
  // Form Validation
  // ================================
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    
    formGroup.classList.add('error');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.setAttribute('role', 'alert');
    }
  }

  function clearError(input) {
    const formGroup = input.closest('.form-group');
    const errorSpan = formGroup.querySelector('.error-message');
    
    formGroup.classList.remove('error');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.removeAttribute('role');
    }
  }

  function validateForm() {
    let isValid = true;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    // Clear previous errors
    [nameInput, emailInput, messageInput].forEach(clearError);

    // Validate name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Por favor, insira seu nome.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'O nome deve ter pelo menos 2 caracteres.');
      isValid = false;
    }

    // Validate email
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Por favor, insira seu e-mail.');
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      showError(emailInput, 'Por favor, insira um e-mail válido.');
      isValid = false;
    }

    // Validate message
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Por favor, insira sua mensagem.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'A mensagem deve ter pelo menos 10 caracteres.');
      isValid = false;
    }

    return isValid;
  }

  // ================================
  // Form Submission
  // ================================
  function initContactForm() {
    if (!contactForm) return;

    // Real-time validation on blur
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        clearError(input);
        
        if (input.required && !input.value.trim()) {
          showError(input, 'Este campo é obrigatório.');
        } else if (input.type === 'email' && input.value.trim() && !validateEmail(input.value.trim())) {
          showError(input, 'Por favor, insira um e-mail válido.');
        }
      });

      input.addEventListener('input', () => {
        if (input.closest('.form-group').classList.contains('error')) {
          clearError(input);
        }
      });
    });

    // Form submission
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateForm()) {
        // Focus first error field
        const firstError = contactForm.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
        return;
      }

      // Show loading state
      submitBtn.classList.add('loading');
      submitBtn.disabled = true;

      // Simulate processing
      setTimeout(() => {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Build WhatsApp message
        let whatsappMessage = `Olá, me chamo ${name}.\n\n`;
        if (subject) whatsappMessage += `Assunto: ${subject}\n\n`;
        whatsappMessage += message;
        whatsappMessage += `\n\n(Enviado via site - ${email})`;

        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${PHONE}?text=${encodedMessage}`;

        // Open WhatsApp
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

        // Reset form
        contactForm.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;

        // Show success message
        showNotification('Mensagem enviada com sucesso!', 'success');
      }, 800);
    });
  }

  // ================================
  // Notification System
  // ================================
  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'status');
    notification.setAttribute('aria-live', 'polite');
    notification.innerHTML = `
      <span class="notification-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
      <span class="notification-text">${message}</span>
    `;

    // Add styles dynamically
    notification.style.cssText = `
      position: fixed;
      bottom: 100px;
      right: 32px;
      background: ${type === 'success' ? '#10b981' : '#6366f1'};
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      z-index: 1001;
      animation: slideIn 0.3s ease;
      font-weight: 500;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  // ================================
  // Scroll Animations (Intersection Observer)
  // ================================
  function initScrollAnimations() {
    if ('IntersectionObserver' in window) {
      const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-card, .stat-card, .tech-item'
      );

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger animation
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * 100);
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
      });
    }
  }

  // ================================
  // Active Navigation Highlight
  // ================================
  function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn-nav)');

    if (!sections.length || !navItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${id}`) {
              item.classList.add('active');
            }
          });
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-80px 0px -50% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  // ================================
  // Keyboard Navigation
  // ================================
  function initKeyboardNav() {
    // Enable keyboard navigation for service cards
    document.querySelectorAll('.service-card, .portfolio-card').forEach(card => {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  // ================================
  // Performance: Debounce Utility
  // ================================
  function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // ================================
  // Initialize Everything
  // ================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initMobileMenu();
    initNavbarScroll();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initActiveNavHighlight();
    initKeyboardNav();

    // Log successful initialization
    console.log('🚀 Crypt Tech site initialized successfully');
  }

  // Run initialization
  init();

})();
/**
 * LuxeMart — Main JavaScript
 * Handles navigation, cart, wishlist, search, and newsletter.
 */

(function () {
  'use strict';

  /* --- DOM References --- */
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const searchBtn = document.getElementById('searchBtn');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const cartCountEl = document.getElementById('cartCount');
  const toast = document.getElementById('toast');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');

  /* --- State --- */
  let cartCount = 0;
  let toastTimer = null;

  /* --- Utility: Toast Notification --- */
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('toast--visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('toast--visible');
    }, 2800);
  }

  /* --- Utility: Animate Cart Badge --- */
  function animateCartBadge() {
    if (!cartCountEl) return;
    cartCountEl.classList.remove('nav__cart-count--bounce');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('nav__cart-count--bounce');
  }

  /* --- Header Scroll Effect --- */
  function handleScroll() {
    if (!header) return;
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* --- Mobile Navigation --- */
  function toggleNav() {
    const isOpen = navMenu.classList.toggle('nav__menu--open');
    navToggle.classList.toggle('nav__toggle--active', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeNav() {
    navMenu.classList.remove('nav__menu--open');
    navToggle.classList.remove('nav__toggle--active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }

  if (navMenu) {
    navMenu.querySelectorAll('.nav__link').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* --- Search Overlay --- */
  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('search-overlay--open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    searchOverlay.querySelector('.search-form__input').focus();
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('search-overlay--open');
    searchOverlay.setAttribute('aria-hidden', 'true');
  }

  if (searchBtn) searchBtn.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });

    const searchForm = searchOverlay.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = e.target.querySelector('.search-form__input').value.trim();
        if (!query) return;

        if (document.body.classList.contains('shop-page')) {
          return;
        }

        closeSearch();
        window.location.href = 'pages/shop.html?q=' + encodeURIComponent(query);
      });
    }
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      closeNav();
    }
  });

  /* --- Add to Cart (event delegation for dynamic products) --- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.product-card__cart');
    if (!btn) return;

    const name = btn.dataset.name;
    cartCount++;
    if (cartCountEl) cartCountEl.textContent = cartCount;
    animateCartBadge();
    showToast(name + ' added to cart');
  });

  /* --- Wishlist Toggle (event delegation) --- */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.product-card__wishlist');
    if (!btn) return;

    const isActive = btn.classList.toggle('product-card__wishlist--active');
    const card = btn.closest('.product-card');
    const nameEl = card && card.querySelector('.product-card__name');
    const name = nameEl ? nameEl.textContent : 'Product';

    showToast(isActive ? name + ' added to wishlist' : name + ' removed from wishlist');
  });

  /* --- Newsletter Form --- */
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      newsletterMessage.className = 'newsletter__message';

      if (!email) {
        newsletterMessage.textContent = 'Please enter your email address.';
        newsletterMessage.classList.add('newsletter__message--error');
        emailInput.focus();
        return;
      }

      if (!emailPattern.test(email)) {
        newsletterMessage.textContent = 'Please enter a valid email address.';
        newsletterMessage.classList.add('newsletter__message--error');
        emailInput.focus();
        return;
      }

      newsletterMessage.textContent = 'Thank you for subscribing! Check your inbox for a welcome offer.';
      newsletterMessage.classList.add('newsletter__message--success');
      emailInput.value = '';
      showToast('Successfully subscribed!');
    });
  }

  /* --- Scroll Reveal (subtle fade-in) --- */
  const revealElements = document.querySelectorAll(
    '.category-card, .product-card, .feature-card, .section__header'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(el);
    });
  }

})();

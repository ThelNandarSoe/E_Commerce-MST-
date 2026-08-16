/**
 * LuxeMart — Shop Page
 * Product catalog with filtering and sorting.
 */

(function () {
  'use strict';

  if (!document.body.classList.contains('shop-page')) return;

  /* --- Product Data --- */
  const PRODUCTS = [
    {
      id: 1,
      name: 'Silk Blend Blazer',
      category: 'fashion',
      categoryLabel: 'Fashion',
      price: 189.00,
      rating: 4.8,
      imageClass: 'product-card__image--1',
      badge: 'New'
    },
    {
      id: 2,
      name: 'Pro Wireless Earbuds',
      category: 'electronics',
      categoryLabel: 'Electronics',
      price: 129.99,
      rating: 4.9,
      imageClass: 'product-card__image--2'
    },
    {
      id: 3,
      name: 'Radiance Serum Set',
      category: 'beauty',
      categoryLabel: 'Beauty',
      price: 63.99,
      originalPrice: 79.99,
      rating: 4.7,
      imageClass: 'product-card__image--3',
      badge: '-20%',
      badgeType: 'sale'
    },
    {
      id: 4,
      name: 'Leather Crossbody Bag',
      category: 'accessories',
      categoryLabel: 'Accessories',
      price: 245.00,
      rating: 4.6,
      imageClass: 'product-card__image--4'
    },
    {
      id: 5,
      name: 'Classic Oxford Shirt',
      category: 'fashion',
      categoryLabel: 'Fashion',
      price: 79.50,
      rating: 4.5,
      imageClass: 'product-card__image--5'
    },
    {
      id: 6,
      name: 'Smart Watch Pro',
      category: 'electronics',
      categoryLabel: 'Electronics',
      price: 349.00,
      rating: 4.8,
      imageClass: 'product-card__image--6',
      badge: 'New'
    },
    {
      id: 7,
      name: 'Hydrating Face Cream',
      category: 'beauty',
      categoryLabel: 'Beauty',
      price: 42.00,
      rating: 4.6,
      imageClass: 'product-card__image--7'
    },
    {
      id: 8,
      name: 'Minimalist Sunglasses',
      category: 'accessories',
      categoryLabel: 'Accessories',
      price: 89.99,
      rating: 4.4,
      imageClass: 'product-card__image--8'
    },
    {
      id: 9,
      name: 'Wool Trench Coat',
      category: 'fashion',
      categoryLabel: 'Fashion',
      price: 320.00,
      rating: 4.9,
      imageClass: 'product-card__image--9'
    },
    {
      id: 10,
      name: 'Portable Bluetooth Speaker',
      category: 'electronics',
      categoryLabel: 'Electronics',
      price: 59.99,
      rating: 4.3,
      imageClass: 'product-card__image--10'
    },
    {
      id: 11,
      name: 'Velvet Lipstick Set',
      category: 'beauty',
      categoryLabel: 'Beauty',
      price: 38.00,
      rating: 4.7,
      imageClass: 'product-card__image--11',
      badge: '-15%',
      badgeType: 'sale'
    },
    {
      id: 12,
      name: 'Sterling Silver Necklace',
      category: 'accessories',
      categoryLabel: 'Accessories',
      price: 156.00,
      rating: 4.8,
      imageClass: 'product-card__image--12'
    }
  ];

  /* --- DOM References --- */
  const productsGrid = document.getElementById('productsGrid');
  const shopEmpty = document.getElementById('shopEmpty');
  const shopResults = document.getElementById('shopResults');
  const shopSearch = document.getElementById('shopSearch');
  const shopSort = document.getElementById('shopSort');
  const shopReset = document.getElementById('shopReset');
  const filterButtons = document.querySelectorAll('.shop-filters__btn');

  /* --- State --- */
  const state = {
    category: 'all',
    search: '',
    sort: 'default'
  };

  /* --- Helpers --- */
  function formatPrice(value) {
    return '$' + value.toFixed(2);
  }

  function renderStars() {
    return '★★★★★';
  }

  function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const valid = ['fashion', 'electronics', 'beauty', 'accessories'];
    return valid.includes(cat) ? cat : 'all';
  }

  function getSearchFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  }

  /* --- Filtering --- */
  function filterProducts() {
    return PRODUCTS.filter(function (product) {
      const matchesCategory =
        state.category === 'all' || product.category === state.category;

      const matchesSearch =
        state.search === '' ||
        product.name.toLowerCase().includes(state.search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }

  /* --- Sorting --- */
  function sortProducts(products) {
    const sorted = products.slice();

    switch (state.sort) {
      case 'price-asc':
        sorted.sort(function (a, b) { return a.price - b.price; });
        break;
      case 'price-desc':
        sorted.sort(function (a, b) { return b.price - a.price; });
        break;
      case 'rating':
        sorted.sort(function (a, b) { return b.rating - a.rating; });
        break;
      default:
        sorted.sort(function (a, b) { return a.id - b.id; });
    }

    return sorted;
  }

  /* --- Render Product Card --- */
  function buildProductCard(product) {
    const badgeClass = product.badgeType === 'sale'
      ? 'product-card__badge product-card__badge--sale'
      : 'product-card__badge';

    const badgeHTML = product.badge
      ? '<span class="' + badgeClass + '">' + product.badge + '</span>'
      : '';

    const priceHTML = product.originalPrice
      ? '<span class="product-card__price"><s class="product-card__price-old">' +
        formatPrice(product.originalPrice) + '</s> ' + formatPrice(product.price) + '</span>'
      : '<span class="product-card__price">' + formatPrice(product.price) + '</span>';

    return (
      '<article class="product-card" data-id="' + product.id + '">' +
        '<div class="product-card__image-wrap">' +
          '<div class="product-card__image ' + product.imageClass + '" role="img" aria-label="' + product.name + '"></div>' +
          badgeHTML +
          '<button class="product-card__wishlist" aria-label="Add ' + product.name + ' to wishlist" data-id="' + product.id + '">' +
            '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">' +
              '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="product-card__body">' +
          '<span class="product-card__category">' + product.categoryLabel + '</span>' +
          '<h3 class="product-card__name">' + product.name + '</h3>' +
          '<div class="product-card__rating" aria-label="Rating ' + product.rating + ' out of 5">' +
            '<span class="product-card__stars" aria-hidden="true">' + renderStars() + '</span>' +
            '<span class="product-card__rating-value">' + product.rating + '</span>' +
          '</div>' +
          '<div class="product-card__footer">' +
            priceHTML +
            '<button class="btn btn--primary btn--sm product-card__cart" data-id="' + product.id +
              '" data-name="' + product.name + '" data-price="' + product.price + '">Add to Cart</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  /* --- Render Grid --- */
  function renderProducts() {
    const filtered = filterProducts();
    const sorted = sortProducts(filtered);

    productsGrid.innerHTML = sorted.map(buildProductCard).join('');

    const count = sorted.length;
    const total = PRODUCTS.length;

    if (count === 0) {
      shopEmpty.hidden = false;
      productsGrid.hidden = true;
      shopResults.textContent = 'No products match your criteria.';
    } else {
      shopEmpty.hidden = true;
      productsGrid.hidden = false;
      shopResults.textContent =
        'Showing ' + count + ' of ' + total + ' product' + (total !== 1 ? 's' : '');
    }
  }

  /* --- Update Active Filter Button --- */
  function setActiveFilter(category) {
    filterButtons.forEach(function (btn) {
      btn.classList.toggle(
        'shop-filters__btn--active',
        btn.dataset.category === category
      );
    });
  }

  /* --- Reset Filters --- */
  function resetFilters() {
    state.category = 'all';
    state.search = '';
    state.sort = 'default';
    shopSearch.value = '';
    shopSort.value = 'default';
    setActiveFilter('all');
    renderProducts();
  }

  /* --- Event Listeners --- */
  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.category = btn.dataset.category;
      setActiveFilter(state.category);
      renderProducts();
    });
  });

  shopSearch.addEventListener('input', function () {
    state.search = shopSearch.value.trim();
    renderProducts();
  });

  shopSort.addEventListener('change', function () {
    state.sort = shopSort.value;
    renderProducts();
  });

  if (shopReset) {
    shopReset.addEventListener('click', resetFilters);
  }

  /* --- Nav search sync: populate shop search from header overlay --- */
  const navSearchForm = document.querySelector('.search-overlay .search-form');
  if (navSearchForm) {
    navSearchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const query = navSearchForm.querySelector('.search-form__input').value.trim();
      if (query) {
        shopSearch.value = query;
        state.search = query;
        renderProducts();
        document.getElementById('searchOverlay').classList.remove('search-overlay--open');
      }
    }, true);
  }

  /* --- Init --- */
  state.category = getCategoryFromURL();
  state.search = getSearchFromURL();
  if (state.search) {
    shopSearch.value = state.search;
  }
  setActiveFilter(state.category);
  renderProducts();

})();

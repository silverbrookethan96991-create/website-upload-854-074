(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var prev = document.querySelector('[data-hero-prev]');
  var next = document.querySelector('[data-hero-next]');
  var current = 0;
  var timer = null;

  function setSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === current);
    });
    dots.forEach(function (dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === current);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    stopHero();
    timer = window.setInterval(function () {
      setSlide(current + 1);
    }, 5600);
  }

  function stopHero() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (slides.length) {
    setSlide(0);
    startHero();
  }

  if (prev) {
    prev.addEventListener('click', function () {
      setSlide(current - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener('click', function () {
      setSlide(current + 1);
      startHero();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      setSlide(index);
      startHero();
    });
  });

  var searchInput = document.querySelector('[data-card-search]');
  var categorySelect = document.querySelector('[data-category-select]');
  var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-tab]'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-title][data-keywords]'));
  var emptyState = document.querySelector('[data-empty-state]');
  var activeFilter = 'all';

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function runCardsFilter() {
    var query = normalize(searchInput ? searchInput.value : '');
    var selected = categorySelect ? categorySelect.value : activeFilter;
    var visible = 0;

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-keywords'));
      var category = card.getAttribute('data-category') || '';
      var byQuery = !query || text.indexOf(query) !== -1;
      var byCategory = selected === 'all' || !selected || category === selected;
      var show = byQuery && byCategory;
      card.hidden = !show;
      if (show) {
        visible += 1;
      }
    });

    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (searchInput) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    if (query) {
      searchInput.value = query;
    }
    searchInput.addEventListener('input', runCardsFilter);
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', runCardsFilter);
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      activeFilter = button.getAttribute('data-filter-tab') || 'all';
      filterButtons.forEach(function (item) {
        item.classList.toggle('is-active', item === button);
      });
      runCardsFilter();
    });
  });

  if (cards.length && (searchInput || categorySelect || filterButtons.length)) {
    runCardsFilter();
  }
})();

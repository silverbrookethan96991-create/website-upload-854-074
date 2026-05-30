(function () {
  var navButton = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (navButton && nav) {
    navButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    if (!slides.length) {
      return;
    }
    var current = 0;
    function show(next) {
      slides[current].classList.remove('is-active');
      if (dots[current]) {
        dots[current].classList.remove('is-active');
      }
      current = (next + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) {
        dots[current].classList.add('is-active');
      }
    }
    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
      });
    });
    window.setInterval(function () {
      show(current + 1);
    }, 5200);
  });

  function bindFilters(scope) {
    var input = scope.querySelector('[data-local-search]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    if (!input || !cards.length) {
      return;
    }
    function apply(value) {
      var keyword = String(value || '').trim().toLowerCase();
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-text') || '').toLowerCase();
        card.classList.toggle('is-hidden', keyword && text.indexOf(keyword) === -1);
      });
    }
    input.addEventListener('input', function () {
      apply(input.value);
    });
    scope.querySelectorAll('[data-filter-chip]').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = button.getAttribute('data-filter-chip') || '';
        apply(input.value);
      });
    });
    scope.querySelectorAll('[data-filter-reset]').forEach(function (button) {
      button.addEventListener('click', function () {
        input.value = '';
        apply('');
      });
    });
    var query = new URLSearchParams(window.location.search).get('q');
    if (query) {
      input.value = query;
      apply(query);
    }
  }

  bindFilters(document);
})();

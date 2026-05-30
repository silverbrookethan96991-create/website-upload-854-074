(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function text(value) {
    return String(value || "").toLowerCase().trim();
  }

  function contains(source, needle) {
    return !needle || text(source).indexOf(text(needle)) !== -1;
  }

  function setupHeader() {
    var header = qs("[data-header]");
    var button = qs("[data-menu-button]");
    var menu = qs("[data-mobile-menu]");

    if (header) {
      var update = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
    }

    if (button && menu) {
      button.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }
  }

  function setupSearchForms() {
    qsa("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = qs("input[name='q']", form);
        var query = input ? input.value.trim() : "";
        var url = "./search.html";
        if (query) {
          url += "?q=" + encodeURIComponent(query);
        }
        window.location.href = url;
      });
    });
  }

  function setupHero() {
    var hero = qs("[data-hero]");
    if (!hero) {
      return;
    }

    var slides = qsa("[data-hero-slide]", hero);
    var dots = qsa("[data-hero-dot]", hero);
    var prev = qs("[data-hero-prev]", hero);
    var next = qs("[data-hero-next]", hero);
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 6200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        start();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        start();
      });
    }

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    qsa("[data-filter-panel]").forEach(function (panel) {
      var parent = panel.parentElement || document;
      var grid = qs("[data-filter-grid]", parent) || qs("[data-filter-grid]");
      if (!grid) {
        return;
      }

      var input = qs("[data-filter-search]", panel);
      var year = qs("[data-filter-year]", panel);
      var region = qs("[data-filter-region]", panel);
      var type = qs("[data-filter-type]", panel);
      var result = qs("[data-filter-result]", panel);
      var cards = qsa("[data-card]", grid);
      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");

      if (input && initialQuery) {
        input.value = initialQuery;
      }

      function update() {
        var query = input ? input.value : "";
        var selectedYear = year ? year.value : "";
        var selectedRegion = region ? region.value : "";
        var selectedType = type ? type.value : "";
        var visible = 0;

        cards.forEach(function (card) {
          var haystack = [
            card.getAttribute("data-title"),
            card.getAttribute("data-year"),
            card.getAttribute("data-region"),
            card.getAttribute("data-type"),
            card.getAttribute("data-genre"),
            card.getAttribute("data-tags")
          ].join(" ");
          var matched = contains(haystack, query) &&
            contains(card.getAttribute("data-year"), selectedYear) &&
            contains(card.getAttribute("data-region"), selectedRegion) &&
            contains(card.getAttribute("data-type"), selectedType);
          card.hidden = !matched;
          if (matched) {
            visible += 1;
          }
        });

        if (result) {
          result.textContent = visible > 0 ? "已显示匹配作品" : "暂无匹配作品";
        }
      }

      [input, year, region, type].forEach(function (control) {
        if (control) {
          control.addEventListener("input", update);
          control.addEventListener("change", update);
        }
      });

      update();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    setupHeader();
    setupSearchForms();
    setupHero();
    setupFilters();
  });
})();

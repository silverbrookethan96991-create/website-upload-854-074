(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function initMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    if (!toggle) {
      return;
    }
    toggle.addEventListener("click", function () {
      document.body.classList.toggle("menu-open");
    });
  }

  function initImages() {
    document.addEventListener("error", function (event) {
      var target = event.target;
      if (target && target.tagName === "IMG") {
        target.classList.add("image-hidden");
      }
    }, true);
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var title = document.querySelector("[data-hero-title]");
    var desc = document.querySelector("[data-hero-desc]");
    var link = document.querySelector("[data-hero-link]");
    var poster = document.querySelector("[data-hero-poster]");
    var meta = document.querySelector("[data-hero-meta]");
    if (!slides.length) {
      return;
    }
    var active = 0;

    function render(index) {
      active = index;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === active);
      });
      var current = slides[active];
      if (title) {
        title.textContent = current.getAttribute("data-title") || "";
      }
      if (desc) {
        desc.textContent = current.getAttribute("data-desc") || "";
      }
      if (link) {
        link.setAttribute("href", current.getAttribute("data-link") || "#");
      }
      if (poster) {
        poster.setAttribute("src", current.getAttribute("data-cover") || "");
        poster.classList.remove("image-hidden");
      }
      if (meta) {
        meta.innerHTML = "";
        var fields = [current.getAttribute("data-year"), current.getAttribute("data-region"), current.getAttribute("data-type")];
        fields.forEach(function (field) {
          if (field) {
            var span = document.createElement("span");
            span.className = "tag";
            span.textContent = field;
            meta.appendChild(span);
          }
        });
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        render(index);
      });
    });

    render(0);
    window.setInterval(function () {
      render((active + 1) % slides.length);
    }, 5200);
  }

  function initQuickSearch() {
    var form = document.querySelector("[data-quick-search]");
    if (!form) {
      return;
    }
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input");
      var query = input ? input.value.trim() : "";
      window.location.href = "library.html" + (query ? "?q=" + encodeURIComponent(query) : "");
    });
  }

  function initFilters() {
    var list = document.querySelector("[data-card-list]");
    if (!list) {
      return;
    }
    var cards = Array.prototype.slice.call(list.querySelectorAll("[data-movie-card]"));
    var search = document.querySelector("[data-card-search]");
    var region = document.querySelector("[data-region-filter]");
    var type = document.querySelector("[data-type-filter]");
    var year = document.querySelector("[data-year-filter]");
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var queryParam = params.get("q");
    if (queryParam && search) {
      search.value = queryParam;
    }

    function apply() {
      var q = normalize(search ? search.value : "");
      var r = region ? region.value : "";
      var t = type ? type.value : "";
      var y = year ? year.value : "";
      var visible = 0;
      cards.forEach(function (card) {
        var matchesQuery = !q || normalize(card.getAttribute("data-search")).indexOf(q) !== -1;
        var matchesRegion = !r || card.getAttribute("data-region") === r;
        var matchesType = !t || card.getAttribute("data-type") === t;
        var matchesYear = !y || card.getAttribute("data-year") === y;
        var show = matchesQuery && matchesRegion && matchesType && matchesYear;
        card.classList.toggle("hidden-card", !show);
        if (show) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("show", visible === 0);
      }
    }

    [search, region, type, year].forEach(function (control) {
      if (control) {
        control.addEventListener("input", apply);
        control.addEventListener("change", apply);
      }
    });
    apply();
  }

  ready(function () {
    initMenu();
    initImages();
    initHero();
    initQuickSearch();
    initFilters();
  });
})();

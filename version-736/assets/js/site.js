(function () {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }
    callback();
  }

  function setupMenu() {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-nav]");
    if (!toggle || !menu) {
      return;
    }
    toggle.addEventListener("click", function () {
      menu.classList.toggle("is-open");
    });
  }

  function setupHero() {
    var hero = document.querySelector("[data-hero]");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector("[data-hero-prev]");
    var next = hero.querySelector("[data-hero-next]");
    var active = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(active + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener("click", function () {
        show(index);
        start();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(active - 1);
        start();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(active + 1);
        start();
      });
    }
    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  function setupFilters() {
    var groups = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    groups.forEach(function (scope) {
      var search = scope.querySelector("[data-search-input]");
      var year = scope.querySelector("[data-year-filter]");
      var type = scope.querySelector("[data-type-filter]");
      var cards = Array.prototype.slice.call(scope.querySelectorAll("[data-search]"));
      var empty = scope.querySelector("[data-empty]");

      function apply() {
        var query = search ? search.value.trim().toLowerCase() : "";
        var chosenYear = year ? year.value : "";
        var chosenType = type ? type.value : "";
        var visible = 0;
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var match = true;
          if (query && text.indexOf(query) === -1) {
            match = false;
          }
          if (chosenYear && cardYear !== chosenYear) {
            match = false;
          }
          if (chosenType && cardType !== chosenType) {
            match = false;
          }
          card.style.display = match ? "" : "none";
          if (match) {
            visible += 1;
          }
        });
        if (empty) {
          empty.classList.toggle("is-visible", visible === 0);
        }
      }

      if (search) {
        search.addEventListener("input", apply);
      }
      if (year) {
        year.addEventListener("change", apply);
      }
      if (type) {
        type.addEventListener("change", apply);
      }
      apply();
    });
  }

  function initMoviePlayer(videoId, wrapperId, source) {
    var video = document.getElementById(videoId);
    var wrapper = document.getElementById(wrapperId);
    if (!video || !wrapper || !source) {
      return;
    }
    var overlay = wrapper.querySelector(".play-overlay");
    var message = wrapper.querySelector(".player-message");
    var started = false;
    var hls = null;

    function showError() {
      if (message) {
        message.style.display = "block";
      }
    }

    function attach() {
      if (started) {
        return;
      }
      started = true;
      if (overlay) {
        overlay.classList.add("is-hidden");
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        hls.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showError();
          }
        });
        return;
      }
      video.src = source;
      video.play().catch(showError);
    }

    if (overlay) {
      overlay.addEventListener("click", attach);
    }
    wrapper.addEventListener("click", function (event) {
      if (event.target === video && !started) {
        attach();
      }
    });
    video.addEventListener("error", showError);
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;

  onReady(function () {
    setupMenu();
    setupHero();
    setupFilters();
  });
})();

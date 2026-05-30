(function () {
  function getElement(selector) {
    return document.querySelector(selector);
  }

  function initMoviePlayer(config) {
    var video = getElement(config.video);
    var overlay = getElement(config.overlay);
    var playButton = getElement(config.playButton);
    var status = getElement(config.status);
    var hls = null;
    var connected = false;

    if (!video || !overlay || !config.source) {
      return;
    }

    function setStatus(message) {
      if (status) {
        status.textContent = message || "";
      }
    }

    function connect() {
      if (connected) {
        return;
      }
      connected = true;
      setStatus("加载中…");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = config.source;
        setStatus("");
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(config.source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          setStatus("");
        });
        hls.on(window.Hls.Events.ERROR, function (_, data) {
          if (!data || !data.fatal) {
            return;
          }
          if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
            setStatus("暂时无法播放");
            hls.startLoad();
            return;
          }
          if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
            setStatus("正在恢复播放");
            hls.recoverMediaError();
            return;
          }
          setStatus("暂时无法播放");
        });
        return;
      }

      setStatus("暂时无法播放");
    }

    function startPlayback(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      connect();
      overlay.classList.add("is-hidden");
      video.controls = true;
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          overlay.classList.remove("is-hidden");
        });
      }
    }

    overlay.addEventListener("click", startPlayback);
    if (playButton) {
      playButton.addEventListener("click", startPlayback);
    }
    video.addEventListener("click", function () {
      if (!connected) {
        startPlayback();
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();

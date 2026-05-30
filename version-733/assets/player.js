function initPlayer() {
  var box = document.querySelector("[data-player]");
  if (!box) {
    return;
  }
  var video = box.querySelector("video");
  var playButton = box.querySelector("[data-play-button]");
  var source = box.getAttribute("data-stream") || "";
  var Hls = window.Hls;
  var hlsInstance = null;

  function attachSource() {
    if (!video || !source || video.getAttribute("data-ready") === "1") {
      return;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = source;
    } else if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    video.setAttribute("data-ready", "1");
  }

  function startPlayback() {
    attachSource();
    box.classList.add("is-playing");
    var promise = video.play();
    if (promise && typeof promise.catch === "function") {
      promise.catch(function () {
        box.classList.remove("is-playing");
      });
    }
  }

  if (playButton) {
    playButton.addEventListener("click", startPlayback);
  }
  if (video) {
    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", function () {
      box.classList.add("is-playing");
    });
    video.addEventListener("pause", function () {
      box.classList.remove("is-playing");
    });
  }

  window.addEventListener("beforeunload", function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}

if (document.readyState !== "loading") {
  initPlayer();
} else {
  document.addEventListener("DOMContentLoaded", initPlayer);
}

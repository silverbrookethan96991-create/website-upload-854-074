(function () {
  function init(box) {
    var video = box.querySelector('video');
    var cover = box.querySelector('.player-cover');
    if (!video || !cover) {
      return;
    }
    var source = video.getAttribute('data-play');
    var active = false;
    function attach() {
      if (active || !source) {
        return;
      }
      active = true;
      cover.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        video.play().catch(function () {});
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          maxBufferLength: 30,
          enableWorker: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
          video.play().catch(function () {});
        });
        return;
      }
      video.src = source;
      video.play().catch(function () {});
    }
    cover.addEventListener('click', attach);
    box.addEventListener('click', function (event) {
      if (event.target === box) {
        attach();
      }
    });
    video.addEventListener('click', function () {
      if (!active) {
        attach();
      }
    });
  }
  document.querySelectorAll('[data-player]').forEach(init);
})();

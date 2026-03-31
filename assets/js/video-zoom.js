(function ($) {
  $(function () {
    $(document).on('click', 'video.js-video-zoom', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var $video = $(this);
      var src = $video.attr('src') || $video.find('source').first().attr('src') || '';
      var poster = $video.attr('poster') || '';

      if (!src || !$.fancybox || !$.fancybox.open) return;

      var html =
        '<div style="width: min(96vw, 1200px);">' +
          '<video controls autoplay playsinline style="display:block; width:100%; height:auto;"' +
          (poster ? ' poster="' + poster + '"' : '') +
          '>' +
            '<source src="' + src + '" type="video/mp4">' +
          '</video>' +
        '</div>';

      $.fancybox.open({
        type: 'html',
        content: html,
        padding: 0,
        margin: 20,
        autoSize: false,
        width: '80%',
        height: 'auto',
        scrolling: 'no',
        helpers: {
          overlay: {
            locked: false
          }
        }
      });
    });
  });
})(jQuery);

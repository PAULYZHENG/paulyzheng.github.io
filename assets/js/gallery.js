(function($){

  // Caption + Fancybox for images and videos
  $('.entry').each(function(i){
    var $entry = $(this);
    var groupName = 'article' + i;

    // 1) images: keep existing behavior
    $entry.find('img').each(function(){
      if ($(this).hasClass('nofancybox')) return;
      if ($(this).parent('a.fancybox').length) return;

      var alt = this.alt;
      if (alt) {
        $(this).after('<span class="caption">' + alt + '</span>');
      }

      $(this).wrap(
        '<a href="' + this.src + '" title="' + (alt || '') + '" class="fancybox" rel="' + groupName + '"></a>'
      );
    });

    // 2) videos: only process videos you explicitly mark
    $entry.find('video.fancybox-video').each(function(j){
      var $video = $(this);

      // avoid duplicate processing
      if ($video.data('fancybox-bound')) return;
      $video.data('fancybox-bound', true);

      var inlineId = $video.attr('id');
      if (!inlineId) {
        inlineId = 'fancybox-video-' + i + '-' + j;
        $video.attr('id', inlineId);
      }

      // move the original video into a hidden inline container
      // and leave behind a clickable clone as the visible poster/player
      var $inlineWrap = $('<div></div>', {
        id: inlineId + '-inline',
        css: {
          display: 'none',
          width: '960px',
          maxWidth: '90vw'
        }
      });

      // clone a fresh video for fancybox content
      var $videoClone = $video.clone();
      $videoClone.removeAttr('id');
      $videoClone.prop('controls', true);
      $videoClone.css({
        width: '100%',
        height: 'auto'
      });

      $inlineWrap.append($videoClone);
      $('body').append($inlineWrap);

      // wrap the on-page video with fancybox trigger
      if (!$video.parent('a.fancybox').length) {
        $video.wrap(
          '<a href="#' + inlineId + '-inline" class="fancybox fancybox-video-trigger" rel="' + groupName + '"></a>'
        );
      }
    });
  });

  // Gallery
  var play = function(parent, item, callback){
    var width = parent.width();
    item.imagesLoaded(function(){
      var _this = this[0],
          nWidth = _this.naturalWidth,
          nHeight = _this.naturalHeight;
      callback();
      this.animate({opacity: 1}, 500);
      parent.animate({height: width * nHeight / nWidth}, 500);
    });
  };

  $('.gallery').each(function(){
    var $this = $(this),
        current = 0,
        photoset = $this.children('.photoset').children(),
        all = photoset.length,
        loading = true;

    play($this, photoset.eq(0), function(){
      loading = false;
    });

    $this.on('click', '.prev', function(){
      if (!loading){
        var next = (current - 1 + all) % all;
        loading = true;
        play($this, photoset.eq(next), function(){
          photoset.eq(current).animate({opacity: 0}, 500);
          loading = false;
          current = next;
        });
      }
    }).on('click', '.next', function(){
      if (!loading){
        var next = (current + 1) % all;
        loading = true;
        play($this, photoset.eq(next), function(){
          photoset.eq(current).animate({opacity: 0}, 500);
          loading = false;
          current = next;
        });
      }
    });
  });

})(jQuery);

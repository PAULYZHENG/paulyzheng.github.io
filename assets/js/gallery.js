(function($){

  $('.entry').each(function(i){
    var $entry = $(this);
    var groupName = 'article' + i;

    // 1) 先处理图片：保留你原来的逻辑
    $entry.find('img').each(function(){
      var $img = $(this);

      if ($img.hasClass('nofancybox')) return;
      if ($img.parent('a.fancybox').length) return;

      var alt = this.alt || '';
      if (alt) {
        $img.after('<span class="caption">' + alt + '</span>');
      }

      $img.wrap(
        '<a href="' + this.src + '" title="' + alt + '" class="fancybox" rel="' + groupName + '"></a>'
      );
    });

    // 2) 给想加入浮层的 video 打标号
    $entry.find('video.fancybox-video').each(function(j){
      var $video = $(this);

      if (!$video.attr('data-fancybox-video-id')) {
        $video.attr('data-fancybox-video-id', groupName + '-video-' + j);
      }
    });

    // 3) 点击 video 时，主动构建同一 entry 内的 gallery
    $entry.off('click.fancyboxVideo', 'video.fancybox-video');
    $entry.on('click.fancyboxVideo', 'video.fancybox-video', function(e){
      e.preventDefault();

      var $clickedVideo = $(this);
      var items = [];
      var startIndex = 0;

      // 按页面出现顺序，把 img/video 都放进同一个组
      $entry.find('img, video.fancybox-video').each(function(){
        var $node = $(this);

        // 图片：取它外层 fancybox 链接
        if ($node.is('img')) {
          if ($node.hasClass('nofancybox')) return;

          var $a = $node.parent('a.fancybox');
          if (!$a.length) return;

          var item = {
            href: $a.attr('href'),
            title: $a.attr('title') || ''
          };

          if (this === $clickedVideo[0]) {
            startIndex = items.length;
          }

          items.push(item);
          return;
        }

        // 视频：用 inline html 项
        if ($node.is('video')) {
          var poster = $node.attr('poster') || '';
          var src = $node.attr('src') || $node.find('source').first().attr('src') || '';

          if (!src) return;

          var html =
            '<div style="width:960px;max-width:90vw;">' +
              '<video controls playsinline autoplay style="width:100%;height:auto;"' +
              (poster ? ' poster="' + poster + '"' : '') +
              '>' +
                '<source src="' + src + '">' +
              '</video>' +
            '</div>';

          if (this === $clickedVideo[0]) {
            startIndex = items.length;
          }

          items.push({
            type: 'html',
            content: html
          });
        }
      });

      if (!items.length) return;

      $.fancybox.open(items, {
        index: startIndex
      });
    });
  });

  // 原来的 gallery 逻辑保留
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

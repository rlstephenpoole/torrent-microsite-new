/*videojs("video", {}, function() {
  var timeline = new Timeline({
    videojs: this,
    fps: 24,
    keyframes: [0, 2.7, 4.5, 5.5, 7.6, 8.5],
    mode: 'video'
  });
});*/

var timeline = new Timeline({   //handles animation of video/sequence
    fps: 24,
    keyframes: ['00000', '00060', '00096', '00097', '00120', '00168', '00201', '00250', '00278', '00305', '00327', '00348', '00374', '00395', '00420', '00449'],
    border: true,
    mode: 'sequence'
});
var scroller = new CoverScroller({duration: 1},timeline);    //handles scrolling of page
var slick;  //gallery on 12th slide
var youtubePlayers = {};


$(document).ready(function(){
    timeline.redraw();

    //force correct positiong, temp
    $('#timeline img').animate({'marginTop':'-3%'});

    //scroll the page on mousewheel scroll
    $('.cover-wrapper').mousewheel(function(event) {
        if (event.deltaY > 0) {
            scroller.scroll(1);
        } else if (event.deltaY < 0) {
            scroller.scroll(0);
        }
    });
    
    scroller.on('scroll', function() {
        //make sure blender is visible when a background is being displayed
        if (this.direction == 0) {
            console.log(this.curCover); 
            if (this.curCover == 0 || this.curCover == 10 || this.curCover == 11) $('#timeline').css('zIndex','1001');
            else $('#timeline').css('zIndex','999');
        } else {
            if (this.curCover == 11) $('#timeline').css('zIndex','1001');
        }

        if (this.curCover == 0 || this.curCover == 11) {
            timeline.hideBorder();
        }

        //force correct positioning, temp
        if (this.curCover == 0) $('#timeline img').animate({'marginTop':'-3%'});
        else if (this.curCover == 3) $('#timeline img').animate({'marginTop':'7%'});
        else if (this.curCover == 4) $('#timeline img').animate({'marginTop':'2%'});
        else if (this.curCover == 6) $('#timeline img').animate({'marginTop':'-3%'});
        else if (this.curCover == 7) $('#timeline img').animate({'marginTop':'-5%'});
        else if (this.curCover == 11) $('#timeline img').animate({'marginTop':'4%'});
        else if (this.curCover == 12) $('#timeline img').animate({'marginTop':'-5%'});
        else $('#timeline img').animate({'marginTop':'0'});

        //play the video
        timeline.playTo(this.curCover);
    });

    scroller.on('scrollEnd', function() {
        //make sure we're on the right slick slide when navigating past the gallery
        if (this.curCover > 11) {
            slick.slickGoTo(slick.slideCount - 1, true);
        } else if (this.curCover < 11) {
            slick.slickGoTo(0, true);
        }

        //make sure blender is visible when a background is being displayed
        if (this.direction == 1) {
            if (this.curCover == 0 || this.curCover == 11) $('#timeline').css('zIndex','1001');
            else $('#timeline').css('zIndex','999');
        } else {
            if (this.curCover == 11) $('#timeline').css('zIndex','1001');
            else if (this.curCover != 0) $('#timeline').css('zIndex','999');
        }

        if (this.curCover != 0 && this.curCover != 11) {
            timeline.showBorder();
        }
    });

    $('#spin-right').click(function() {
        timeline.playTo(timeline.currentKeyframe+1);
    });

    $('#spin-left').click(function() {
        if (timeline.currentKeyframe > 12) {
            timeline.playTo(timeline.currentKeyframe-1);
        } else {
            scroller.scroll(0);
        }
    });

    //init slick gallery
    $('.cover-item-12 .slick').on('init', function(e, _slick) {
        _slick.edged = true;
        slick = _slick;
    }).slick({
        prevArrow: "<img class='slick-prev' src='../assets/images/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='../assets/images/arrow.png'></img>",
        infinite: false
    }).on('setPosition', function(e, slick) {
        if (scroller.curCover !== 11) return;
        if (slick.edged && slick.currentSlide == slick.slideCount-1) {  //reached end of slideshow
            scroller.scroll(1); //scroll down
        }
        if (slick.edged && slick.currentSlide == 0) {  //reached start of slideshow
            scroller.scroll(0); //scroll up
        }

        if (slick.currentSlide == slick.slideCount-1 || slick.currentSlide == 0) {
            slick.edged = true;
        } else {
            slick.edged = false;
        }
    });

    //init photo slick gallery
    $('#view-photo .slick').slick({
        prevArrow: "<img class='slick-prev' src='../assets/images/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='../assets/images/arrow.png'></img>",
        lazyLoad: 'progressive'
    });

    //init video slick gallery
    $('#play-video .slick').slick({
        prevArrow: "<img class='slick-prev' src='../assets/images/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='../assets/images/arrow.png'></img>",
        centerMode: true,
        lazyLoad: 'progressive'
    }).on('beforeChange', function(e, slick, currentSlide, nextSlide) {
        //pause youtube videos when nav'ing off of them
        for (var i in youtubePlayers) {
            youtubePlayers[i].stopVideo();
        }
        $('.youtube-embed img').fadeIn();
    });

    //on gallery background/close click, close the gallery
    $('.close-overlay,.close-x').click(function() {
        $('#view-photo,#play-video,#show-recipe').fadeOut();

        //pause youtube videos
        for (var i in youtubePlayers) {
            youtubePlayers[i].stopVideo();
        }
        $('.youtube-embed img').fadeIn();
    });

    //on view photos button click, show photo gallery
    $('.view-photos').click(function() {
        $('#view-photo').css('display', 'none').css('left', 'initial').fadeIn();
    });

    //on view videos button click, show video gallery
    $('.play-video').click(function() {
        $('#play-video').css('display', 'none').css('left', 'initial').fadeIn();
    });

    //on view recipes button click, show recipe
    $('#recipe').click(function() {
        $('#show-recipe').css('display', 'none').css('left', 'initial').fadeIn();
    });

    //on color click, change the timeline's sequence
    $('.color-picker li').click(function(e) {
        let source = $(e.currentTarget).attr('data-source');
        timeline.changeSource(source);
    });

    //on youtube poster click, embed the video and play it
    $('.youtube-embed').click(function() {
        if (YT) {
            let id = $(this).attr('data-id');
            let v = this;

            if (youtubePlayers.id) {
                $(v).find('img').fadeOut("fast", function() {
                    youtubePlayers.id.playVideo();
                });
            } else {
                let width = $(this).width();
                let height = $(this).height();
                $(this).append(`<iframe id="${id}" style="position: absolute;" src="http://www.youtube.com/embed/${id}?autoplay=1&controls=0&enablejsapi=1" height="${height}" width="${width} type="text/html" frameborder="0"/>`);

                setTimeout(function() {
                    $(v).find('img').fadeOut();
                    youtubePlayers.id = new YT.Player(id);
                },1000);
            }
        } else {
            console.log('youtube failed to load');
        }
    });
});
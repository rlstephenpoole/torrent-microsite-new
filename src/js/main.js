var isMobile = Modernizr.mobile;
var isPhone = Modernizr.phone;
var isTablet = Modernizr.tablet;
var youtubePlayers = {};
var timeline = undefined;

if (!isMobile) {
    timeline = new Timeline({ //handles animation of video/sequence
        fps: 20,
        keyframes: ['00000','00030','00055','00071','00084','00103','00138','00153','00168','00224','00238','00267','00281','00295','00309'],
        animation: {
            1: [
                {
                    'startDown': function() {
                        let dW = $('.blender-1').width();
                        let dX = parseInt($('.cover-item-1 .desktop .col-xs-3').eq(0).width())-dW-parseInt($('.blender-1').css('margin-right'));
                        let dY = parseInt($('.blender-1').offset().top) - parseInt($('.blender-1').css('margin-top')) + parseInt($('.blender-1').css('margin-bottom'));
                        let pW = $('#timeline').width();
                        let pH = $('#timeline').height();
                        let xOffset = (pW - $(window).width()) / 2;
                        let yOffset = (pH - $(window).height()) / 2;
                        let oW = pW * 0.1944921875;
                        let oX = (pW * 0.334890625) - xOffset;
                        let oY = (pH * 0.21188888888889) - yOffset + 60;

                        let blender = $('.blender-1').clone().css({'left':dX,'top':dY,'width':dW,'position':'absolute','zIndex':6049}).removeClass('blender-1').addClass('blender-2 timeline-animation').appendTo('body');
                        $('.blender-1').hide();
                        $('#timeline').hide();
                        $('.blender-2').animate({'left':oX,'top':oY,'width':oW},600);
                    },
                    'endDown': function() {
                        setTimeout(function() {
                            $('#timeline').show();
                            $('.blender-2').remove();
                            $('.blender-1').show();
                        },500);
                    },
                    'startUp': function() {
                        let dW = $('.blender-1').width();
                        let pW = $('#timeline').width();
                        let pH = $('#timeline').height();
                        let xOffset = (pW - $(window).width()) / 2;
                        let yOffset = (pH - $(window).height()) / 2;
                        let oW = pW * 0.1944921875;
                        let oX = (pW * 0.334890625) - xOffset;
                        let oY = (pH * 0.21188888888889) - yOffset + 60;
                        let dX = parseInt($('.cover-item-1 .desktop .col-xs-3').eq(0).width())-dW-parseInt($('.blender-1').css('margin-right'));
                        let dY = parseInt($('.blender-1').offset().top) - parseInt($('.blender-1').css('margin-top')) + parseInt($('.blender-1').css('margin-bottom')) + $('.cover').height();
                        
                        let blender = $('.blender-1').clone().css({'left':oX,'top':oY,'width':oW,'position':'absolute','zIndex':6049}).removeClass('blender-1').addClass('blender-2 timeline-animation').appendTo('body');
                        $('.blender-1').hide();
                        $('#timeline').hide();
                        $('.blender-2').animate({'left':dX,'top':dY,'width':dW},600);
                    },
                    'endUp': function() {
                        setTimeout(function() {
                            $('#timeline').hide();
                            $('.blender-2').remove();
                            $('.blender-1').show();
                        },500);
                    }
                }
            ],
            3: [
                {
                    'startDown': function() {
                        $('.cover-item-4 .desktop ul li img').each(function(id) {
                            $(this).css('opacity',0);
                        });
                    },
                    'endDown': function() {
                        $('.cover-item-4 .desktop ul li img').each(function(id) {
                            let self = this;
                            $(this).css('opacity',1);
                            var dX = $(this).offset().left;
                            var dY =  $(this).offset().top;
                            $(this).css('opacity',0);

                            var width = $(this).width();
                            var oX = $(window).width() / 2 - width / 2;
                            var marginTop = $('#timeline').height() * (parseInt($('.timeline-frame').css('margin-top'))/100);
                            var oY = $('.timeline-frame').offset().top + $('.timeline-frame').height() * 0.5 - $(this).height() / 2;
                            var newElement = $(this).clone().css({'opacity':0,'position':'absolute','zIndex':6049}).addClass('timeline-animation');
                            var delay = 100;

                            $('body').append(newElement);
                            $(newElement).css({left:oX, top:oY, width:width}).delay(id*delay).animate({
                                left: dX,
                                top: dY,
                                opacity: 1
                            }, 200, function() {
                                $(newElement).remove();
                                $(self).css('opacity',1);
                            });

                        });
                    }
                }
            ],
            7: [
                {
                    'endDown': function() {
                        let arrow = $(`<div style="opacity:0;" class="arrow-animation timeline-animation"></div>`);
                        $('body').append(arrow);
                        $(arrow).animate({'opacity':1},400);

                        let resetPos = 1000;
                        let posIncrement = 250;
                        let posMod = posIncrement;
                        let startDelay = 300;
                        let arrowsPerColumn = 3;
                        let resetTop = 70;

                        let up = '<img class="arrow1 up" src="./images/torrent/arrows1.png"./>';
                        let down = '<img class="arrow2 down" src="./images/torrent/arrows1.png"./>';
                        let up2 = '<img class="arrow3 up" src="./images/torrent/arrows1.png"./>';

                        let iteration = 0;
                        let iterations = 2;
                        

                        function loop(el,mod=1) {
                            $(el).fadeIn('fast');
                            $(el).css({top:50*mod*-1});
                            let sign = mod == 1 ? '+' : '-';
                            $(el).animate ({
                                top: sign+'='+posIncrement,
                            }, 700, 'linear', function() {
                                if ($('.arrow-animation').length) {
                                    $(el).fadeOut('fast', function() {

                                        //reset this if we've gone far enough
                                        let top = $(el).css('top');
                                        if ((top < -resetPos && mod) || (top > resetPos && !mod)) {
                                            $(el).fadeOut(1, function() {
                                                $(el).css('top', mod ? -resetTop : resetTop);
                                                loop(el,mod);
                                            });
                                        } else {
                                            loop(el,mod);
                                        }
                                    });
                                }
                            });
                        }

                        function queSet(i) {
                            start(down,i);
                            start(up,i,0);
                            start(up2,i,0);
                        }

                        function start(el,i,mod=1) {
                            $('.arrow-animation').append(el);
                            el = $('.arrow-animation img').last();
                            $(el).addClass('arrow-column-'+i);
                            loop(el,mod);
                        }

                        for(var i = 0; i <= arrowsPerColumn-1; i++) {
                            setTimeout(function(){queSet(i);},i*startDelay);
                        }
                    }
                }
            ],
            8: [
                {
                   'endUp': function() {
                        let arrow = $(`<div style="opacity:0;" class="arrow-animation timeline-animation"></div>`);
                        $('body').append(arrow);
                        $(arrow).animate({'opacity':1},400);

                        let resetPos = 1000;
                        let posIncrement = 250;
                        let posMod = posIncrement;
                        let startDelay = 300;
                        let arrowsPerColumn = 3;
                        let resetTop = 70;

                        let up = '<img class="arrow1 up" src="./images/torrent/arrows1.png"./>';
                        let down = '<img class="arrow2 down" src="./images/torrent/arrows1.png"./>';
                        let up2 = '<img class="arrow3 up" src="./images/torrent/arrows1.png"./>';

                        let iteration = 0;
                        let iterations = 2;
                        

                        function loop(el,mod=1) {
                            $(el).fadeIn('fast');
                            $(el).css({top:50*mod*-1});
                            let sign = mod == 1 ? '+' : '-';
                            $(el).animate ({
                                top: sign+'='+posIncrement,
                            }, 700, 'linear', function() {
                                if ($('.arrow-animation').length) {
                                    $(el).fadeOut('fast', function() {

                                        //reset this if we've gone far enough
                                        let top = $(el).css('top');
                                        if ((top < -resetPos && mod) || (top > resetPos && !mod)) {
                                            $(el).fadeOut(1, function() {
                                                $(el).css('top', mod ? -resetTop : resetTop);
                                                loop(el,mod);
                                            });
                                        } else {
                                            loop(el,mod);
                                        }
                                    });
                                }
                            });
                        }

                        function queSet(i) {
                            start(down,i);
                            start(up,i,0);
                            start(up2,i,0);
                        }

                        function start(el,i,mod=1) {
                            $('.arrow-animation').append(el);
                            el = $('.arrow-animation img').last();
                            $(el).addClass('arrow-column-'+i);
                            loop(el,mod);
                        }

                        for(var i = 0; i <= arrowsPerColumn-1; i++) {
                            setTimeout(function(){queSet(i);},i*startDelay);
                        }
                    }
                }
            ],
            9: [
                {
                    'endDown': function() {
                        let color = timeline.color;
                        let liquid = $(`<div style="opacity:0;"" class="liquid-animation timeline-animation"><img class="liquid" src="./images/torrent/mini-animations/${color}-juice.png"./></div>`);
                        $('body').append(liquid);

                        timeline.on('changeSource', function() {
                            $('.liquid-animation').fadeOut('fast');
                        }, 'liquid');

                        setPos();
                        $(window).on('resize',setPos);
                        function setPos() {
                            let liquid = $('.liquid-animation');
                            if (!liquid.length) {
                                $(window).off('resize',setPos);
                                timeline.off('changeSource','liquid')
                                return;
                            }
                            
                            let pW = $('#timeline').width();
                            let pH = $('#timeline').height();
                            let xOffset = (pW - $(window).width()) / 2;
                            let yOffset = (pH - $(window).height()) / 2;
                            let oW = pW * 0.1197421875;
                            let oX = (pW * 0.4035078125) - xOffset;
                            let oY = (pH * 0.56725) - yOffset + 54;

                            $(liquid).css({'left':oX,'top':oY,'width':oW}).animate({'opacity':1},400);
                        }
                    }
                }
            ],
            10: [
                {
                    'endUp': function() {
                        let color = timeline.color;
                        let liquid = $(`<div style="opacity:0;"" class="liquid-animation timeline-animation"><img class="liquid" src="./images/torrent/mini-animations/${color}-juice.png"./></div>`);
                        $('body').append(liquid);

                        setPos();
                        $(window).on('resize',setPos);
                        function setPos() {
                            let liquid = $('.liquid-animation');
                            if (!liquid.length) {
                                $(window).off('resize',setPos);
                                return;
                            }
                            
                            let pW = $('#timeline').width();
                            let pH = $('#timeline').height();
                            let xOffset = (pW - $(window).width()) / 2;
                            let yOffset = (pH - $(window).height()) / 2;
                            let oW = pW * 0.1197421875;
                            let oX = (pW * 0.4035078125) - xOffset;
                            let oY = (pH * 0.56725) - yOffset + 54;

                            $(liquid).css({'left':oX,'top':oY,'width':oW}).animate({'opacity':1},400);
                        }
                    }
                }
            ]
        },
        border: true,
        mode: 'sequence'
    });
    var scroller = new CoverScroller({ duration: 1.5 }, timeline); //handles scrolling of page
}
var circleLoader = new circleLoader();

$(document).ready(function(){
    //set header position
    if (isPhone) {
        $('.cover-wrapper').css('top', '50px');
    }
    if (isMobile) {
        $('#loader').fadeOut();
    }
    //set loader position
    $('#loader').css({'width':$(window).width(),'height':$(window).height()-116,'top':116});

    if (!isMobile) {
        //hide recipe button if necessary
        if ($('#show-recipe .'+scroller.color).length == 0) {
            $('.open-recipe').fadeOut();
        } else {
            $('.open-recipe').fadeIn();
        }

        //load all the things
        var colors = ['black','graphite','grey'];

        for (var i = 0; i <= 100; i++) {
            let j = i;
            timeline.on('loadedPercent'+i, function() {
                circleLoader.draw(j);
            })
        }
        timeline.on('loaded', function() {
            scroller.hideLoader();
            if (timeline.cached.indexOf(colors[0]) > -1) colors.shift();
            if (colors.length == 0) {
                circleLoader.remove();
                for (var i = 0; i <= 100; i++) {
                    timeline.off('loadedPercent'+i);
                }
                timeline.off('loaded');
            }
            if (colors.length == 0) return;
            let cacheNum = timeline.cached.length-1;
            circleLoader.init($('.color-picker .'+colors[0]));
            timeline.cacheColor = colors[0];
            let url = './images/torrent/sequence/'+colors[0]+'/'+colors[0].toUpperCase()+'_TORRENT_EDIT_00000.jpg';
            timeline._cache(false,url);
            
            //reposition color-picker elements
            $.each($('.color-picker li'), function(i,v) {
                if (i == 0) return;
                let t = $(this).find('div').eq(0).position().top;
                $(this).find('div').eq(1).css('top',t);
                //$('.color-picker li div').eq(1).css('top',t);
            });
        });

        //don't show scrollbar on desktop
        $('.cover-wrapper').css('overflow', 'hidden');

        //on nav arrow click, navigate to the next/prev cover
        $('.nav-up').click(function() {
            scroller.scroll(0);
        });
        $('.nav-down').click(function() {
            scroller.scroll(1);
        });

        //on cover-picker hover, show title overlay
        $('.cover-picker li').hover(function() {
            $(this).find('.title').stop(true).fadeIn('fast');
        }, function() {
            $(this).find('.title').stop(true).delay(200).fadeOut('fast');
        });

        //scroll the page on mousewheel scroll
        $('.cover-wrapper').mousewheel(function(event) {
            if (event.deltaY > 0) {
                scroller.scroll(1);
                if (scroller.curCover == 11) {
                    if (timeline.currentKeyframe == timeline.keyframes.length-1) timeline.playTo(11);
                    else timeline.next();
                }
            } else if (event.deltaY < 0) {
                scroller.scroll(0);
                if (scroller.curCover == 11) {
                    if (timeline.currentKeyframe > 12) {
                        timeline.prev();
                    } else {
                        scroller.scroll(0);
                    }
                }
            }
        });

        timeline.on('changeSource', function() {
            //change the blender on the first panel when the color changes
            let path = '/'+$('.blender-1').attr('id').replace(/-/g, '/')+'/';
            $('.blender-1').attr('src','.'+path+this.color+'.png');

            //toggle recipe button if the current color doesn't have one
            if ($('#show-recipe .'+timeline.color).length == 0) {
                $('.open-recipe').fadeOut();
            } else {
                $('.open-recipe').fadeIn();
            }

            //remove animations
            timeline.clearAnimation();
        });

        timeline.redraw();
        $('#timeline img').animate({'marginTop':'-3%'});
    
        scroller.on('scroll', function () {
            //make sure blender is visible when a background is being displayed
            if (!isMobile) {
                if (this.curCover == 0) {
                    timeline.hideBorder();
                }

                //force correct positioning, temp
                if (this.curCover == 0) $('#timeline *').animate({'marginTop':'-3%'});
                else if (this.curCover == 3) $('#timeline *').animate({'marginTop':'7%'});
                else if (this.curCover == 4) $('#timeline *').animate({'marginTop':'4%'});
                else if (this.curCover == 11) $('#timeline *').animate({'marginTop':'-7%'});
                else $('#timeline *').animate({'marginTop':'0'});

                //play the video
                if (self.currentFrame != 0 && !(this.curCover == 11 && timeline.currentKeyframe > 11)) {
                    timeline.playTo(this.curCover);
                }
            }

            //remove animations
            timeline.clearAnimation();

            //hide down arrow if necessary
            if (this.curCover == 11) {
                $('.nav-down').fadeOut('fast');
            } else {
                $('.nav-down').fadeIn('fast');
            }
        });

        scroller.on('scrollEnd', function() {
            if (this.curCover != 0) {
                timeline.showBorder();
            }
        });

        //play timeline on scroller at the bottom
        $('#spin-right').click(function () {
            timeline.next();
            if (timeline.currentKeyframe == timeline.keyframes.length-1) timeline.playTo(11);
        });

        //play timeline on scroller at the bottom
        $('#spin-left').click(function () {
            if (timeline.currentKeyframe > 12) {
                timeline.prev();
            } else {
                scroller.scroll(0);
            }
        });
    }

    //init mobile gallery
    $('#slick-colors .slick').slick({
        prevArrow: "<img class='slick-prev' src='./images/torrent/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='./images/torrent/arrow.png'></img>",
        lazyLoad: 'progressive'
    });

    //init photo slick gallery
    $('#view-photo .slick').slick({
        prevArrow: "<img class='slick-prev' src='./images/torrent/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='./images/torrent/arrow.png'></img>",
        lazyLoad: 'progressive',
        adaptiveHeight: true
    }).on('init', function(s) {
        placeCloseButton(s,'#view-photo');
    }).on('setPosition', function(s) {
        placeCloseButton(s,'#view-photo');
    }).on('beforeChange', function(s,c,n) {
        $('#view-photo .close-x').fadeOut('fast');
    }).on('afterChange', function(s,c) {
        placeCloseButton(s,'#view-photo');
    });

    function placeCloseButton(slick,element) {
        if (isPhone) return;
        let slick1 = slick.target.slick;
        let id = slick1.currentSlide;
        let width = $(element+' .slick-track div').eq(id+1).find('img').width();
        let pwidth = $(element+' .slick').width();
        let offsetLeft = slick.currentTarget.offsetLeft;
        let newLeft = offsetLeft + ((pwidth - width)/2) + width;
        $(element+' .close-x').css({'left': newLeft, 'top': parseInt(slick.currentTarget.offsetTop)-28}).fadeIn('fast');
    }

    //init video slick gallery
    $('#play-video .slick').slick({
        prevArrow: "<img class='slick-prev' src='./images/torrent/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='./images/torrent/arrow.png'></img>",
        lazyLoad: 'progressive'
    }).on('init', function(s) {
        placeCloseButton(s,'#play-video');
    }).on('setPosition', function(s) {
        placeCloseButton(s,'#play-video');
    }).on('beforeChange', function(s,c,n) {
        $('#view-photo .close-x').fadeOut('fast');
    }).on('afterChange', function(s,c) {
        placeCloseButton(s,'#play-video');
    });

    //init recipe slick gallery
    $('#show-recipe .slick').slick({
        prevArrow: "<img class='slick-prev' src='./images/torrent/arrow.png'></img>",
        nextArrow: "<img class='slick-next' src='./images/torrent/arrow.png'></img>",
        lazyLoad: 'progressive'
    }).on('init', function(s) {
        placeCloseButton(s,'#show-recipe');
    }).on('setPosition', function(s) {
        placeCloseButton(s,'#show-recipe');
    }).on('beforeChange', function(s,c,n) {
        $('#view-photo .close-x').fadeOut('fast');
    }).on('afterChange', function(s,c) {
        placeCloseButton(s,'#show-recipe');
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
        $('#view-photo').css('display', 'none').css('left', '0').fadeIn();
    });

    //on view videos button click, show video gallery
    $('.play-video').click(function() {
        $('#play-video').css('display', 'none').css('left', '0').fadeIn();
    });

    //on next/prev video click, pause the current video
    $('#play-video .slick-prev, #play-video .slick-next').click(function() {
        for (var i in youtubePlayers) {
            youtubePlayers[i].stopVideo();
        }
    });

    //on view recipes button click, show recipe
    $('.open-recipe').click(function() {
        $('.recipe-wrapper').css('display', 'none');
        var currentColor = isMobile ? "red" : scroller.color;
        $('.recipe-wrapper.'+currentColor).removeAttr('style');
        $('#show-recipe').css('display', 'none').css('left', '0').fadeIn();
    });

    //on color click, change the timeline's sequence
    $('.color-picker li').click(function (e) {
        var source = $(e.currentTarget).attr('data-source');
        let color = $(e.currentTarget).attr('data-color');
        if (timeline.animating || $(e.currentTarget).hasClass('unloaded')) return;
        scroller.color = color;
        timeline.color = color;
        timeline.changeSource(source);
    });

    //on youtube poster click, embed the video and play it
    $('.youtube-embed').click(function() {
        if (YT) {
            let id = $(this).attr('data-id');
            let v = this;

            if ($(v).find('iframe').length) return;

            if (youtubePlayers[id]) {
                $(v).find('img').fadeOut("fast", function() {
                    youtubePlayers[id].playVideo();
                });
            } else {
                let width = $(this).width();
                let height = $(this).height();
                $(this).append(`<iframe id="${id}" style="position: absolute;" src="https://www.youtube.com/embed/${id}?autoplay=1&enablejsapi=1" height="${height}" width="${width} type="text/html" frameborder="0"/>`);

                setTimeout(function() {
                    $(v).find('img').fadeOut();
                    youtubePlayers[id] = new YT.Player(id);
                },1000);
            }
        } else {
            console.log('youtube failed to load');
        }
    });

    redraw();
    //on window resize, resize components
    $(window).resize(redraw);
    function redraw() {
        if (!isMobile) {
            if ($(window).width() <= 768) {
                timeline.disable();
            } else {
                timeline.enable();
            }

            //don't show scrollbar on desktop
            $('.cover-wrapper').css('overflow', 'hidden');
            
            timeline.redraw();
            scroller.redraw();
            circleLoader.redraw();
        }
    }
});
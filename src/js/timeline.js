class Timeline extends Messenger {
	constructor(opts) {
    super();
    if (!opts) {this.log("opts is undefined, need an id", 1); return;}
    this.mode = opts.mode;
    if (opts.mode == 'video') {
      this._forwardVideo = undefined;
      this._backwardVideo = undefined;
      $('#timeline #forward').css('zIndex','2');
      $('#timeline #backward').css('zIndex','1');
      if (!opts.fps) {this.log("fps is undefined, assuming 30fps", 2); this.fps = 30;} else {this.fps = opts.fps;}
    }

    this.border = opts.border;
    this.playing = false;
    this.playInterval = undefined;
    this.keyframes = opts.keyframes;
    this.currentKeyframe = -1;
    this.currentFrame = parseInt(this.keyframes[0]);
    this.currentYoffset = window.pageYOffset;
    this.ready = false;
    this.forwardReady = false;
    this.backwardReady = false;

    let self = this;
    if (opts.mode == 'sequence') {
      console.log('sequence init');
      self.src = $('#timeline img').attr('src');
      self._setURL();
      $('#timeline img').attr('src', self._constructURL()).addClass('timeline-frame timeline-frame-0');
      self._cache();
    }

    if (this.border) {
      $('#timeline').append('<div style="display: none;" class="black-to-transparent-gradient-top"></div>')
        .append('<div style="display: none;" class="black-to-transparent-gradient-bottom"></div>')
        .append('<div style="display: none;" class="black-to-transparent-gradient-left"></div>')
        .append('<div style="display: none;" class="black-to-transparent-gradient-right"></div>');
    }

    var initInterval = setInterval(function() {
        if (self.redraw()) clearInterval(initInterval);
    },200);
  }

  init() {
    var self = this;
    var initInterval = setInterval(function() {
        if (self.redraw()) clearInterval(initInterval);
    },200);
    $(window).resize(self.redraw);

    self.forwardVideo.play();
    self.forwardVideo.pause();
    self.forwardVideo.currentTime(self.currentKeyframe);
    self.backwardVideo.play();
    self.backwardVideo.pause();
    self.backwardVideo.currentTime(self.backwardVideo.duration());

    self.forwardVideo.on('loadeddata', function(){loadedCallback(1);});
    self.backwardVideo.on('loadeddata', function(){loadedCallback(0);});

    function loadedCallback(dir) {
      if (dir) self.forwardReady = true;
      else self.backwardReady = true;
      if ((!dir && self.forwardReady) || (dir && self.backwardReady)) {
        self.duration = self.forwardVideo.duration();
        self.emit('loaded');
        self.ready = true;
      }
    }
  }

  redraw() {
    //make sure video's aspect/position is maintained
    let menuSize = isPhone ? 50 : 116;
    let width = $(window).width();
    let offset = $('#navbar-wrapper').height() + menuSize;
    let height = $(window).height() - offset;
    let viewportAspect = width/height;
    let imageAspect = 16/9;
    if (isNaN(imageAspect) || !imageAspect) return false;

    let mod = 1.0;

    $('.black-to-transparent-gradient-top,.black-to-transparent-gradient-bottom,.black-to-transparent-gradient-left,.black-to-transparent-gradient-right').removeClass('timeline-ignore');
    if (viewportAspect > imageAspect) {
      $('.black-to-transparent-gradient-top,.black-to-transparent-gradient-bottom').addClass('timeline-ignore').fadeOut();
      let nheight = height*mod;
      let nwidth = height*imageAspect*mod;
      let hdiff = nheight-height;
      let wdiff = nwidth-width;
      $('#timeline').css({
          'height': nheight,
          'width': nwidth,
          'top': offset - hdiff/2,
          'left': -wdiff/2
      });
    } else if (viewportAspect < imageAspect) {
      $('.black-to-transparent-gradient-left,.black-to-transparent-gradient-right').addClass('timeline-ignore').fadeOut();
      let nheight = (width/imageAspect)*mod;
      let nwidth = width*mod;
      let hdiff = nheight-height;
      let wdiff = nwidth-width;
      $('#timeline').css({  
          'height': nheight,
          'width': nwidth,
          'top': offset - hdiff/2,
          'left': -wdiff/2
      });
    } else {
      let nheight = height*mod;
      let nwidth = width*mod;
      let hdiff = nheight-height;
      let wdiff = nwidth-width;
      $('#timeline').css({
          'height': nheight,
          'width': nwidth,
          top: offset - hdiff/2,
          left: -wdiff/2
      });
    }
    return true;
  }

  showBorder(show=1) {
    if (show) {
      $('#timeline > div:not(.timeline-ignore,#forward,#backward)').fadeIn();
    } else {
      $('#timeline > div:not(.timeline-ignore,#forward,#backward)').fadeOut();
    }
  }

  hideBorder(hide=1) {
    if (hide) {
      $('#timeline > div:not(.timeline-ignore,#forward,#backward)').fadeOut();
    } else {
      $('#timeline > div:not(.timeline-ignore,#forward,#backward)').fadeIn();
    }
  }

  next() {
    this.playTo(self.currentKeyframe+1);
  }

  prev() {
    this.playTo(self.currentKeyframe-1);
  }

  playTo(id) {
    let self = this;
    if (id < 0 || id >= self.keyframes.length || id == self.currentKeyframe || self.playing || self.playInterval) return false;
    let idDiff = Math.abs(self.currentKeyframe - id);
    let timeDiff = Math.abs(self.keyframes[self.currentKeyframe] - self.keyframes[id]);
    console.log(idDiff,timeDiff);
    let speed = idDiff > 1 ? 1/timeDiff : undefined;
    self.keyframes[id] < self.keyframes[self.currentKeyframe] ? self.play(self.keyframes[id],0,speed) : self.play(self.keyframes[id],1,speed);
    self.log('playing to keyframe #'+id+', time '+self.keyframes[id]+'s');
    self.currentKeyframe = id;
    return true;
  }

  play(val,direction,speed) {
    var self = this;
    if (self.playing || self.playInterval) return;
    self.playing = true;
    self.emit('play');

    let primary = undefined, secondary = undefined;
    if (direction) {
      primary = self.forwardVideo;
      secondary = self.backwardVideo;
      $('#timeline #forward').css('zIndex','2');
      $('#timeline #backward').css('zIndex','1');
    } else {
      primary = self.backwardVideo;
      secondary = self.forwardVideo;
      $('#timeline #forward').css('zIndex','1');
      $('#timeline #backward').css('zIndex','2');
    }

    if (self.mode == 'video') {
      if (!speed) primary.play();

      val = direction ? val : Math.abs(self.duration-val);
      self.playInterval = setInterval(function() {
        let ct = primary.currentTime();
        if (speed) {
          ct += speed;
          console.log(speed*1000,ct);
          primary.currentTime(ct);
        }
        if (ct >= val) {
          //$('#timeline #poster').fadeOut();
          //$('#timeline #poster-'+id).fadeIn();
          clearInterval(self.playInterval);
          self.playInterval = false;
          self.playing = false;
          primary.pause();
          secondary.currentTime(Math.abs(ct-self.duration));
          self.emit('pause');
        }
      }, speed ? speed*1000 : 0.05);
    } else {
      if (val) self.currentKeyframe = parseInt(val);
      resetInterval(speed);

      function resetInterval(speed,allowReset=true) {
        clearInterval(self.playInterval);
        self.playInterval = setInterval(function() {
          let lastFrame = self.currentFrame;
          self.currentFrame += Math.round(speed) > 3 ? 3 : Math.round(speed); //skip some frames if playing super fast

          if (self.currentFrame >= self.keyframes[self.currentKeyframe-1] && allowReset) resetInterval(1,false);

          if (self.currentFrame >= parseInt(val)-1) {
            self.currentFrame = parseInt(val);
            clearInterval(self.playInterval);
            self.playInterval = false;
            self.playing = false;
            self.emit('pause');
            return;
          }
        }, self.deltaTime*1000/speed);
      }
    }
  }

  changeSource(url) {
    let self = this;
    if (self.mode == 'video') {
      //TODO implement transitioning video source
    } else if (self.mode == 'sequence') {
      self.src = url;
      self._setURL();
      url = self._constructURL();
      self.animating = true;

      $('#timeline').append(`<img src="${url}"/>`)
      $('#timeline img').eq(0).fadeOut("fast", function() {self.animating = false; $(this).css('zIndex','2'); self.emit('changeSource'); $('#timeline img').eq(0).remove();});
      $('#timeline img').eq(1).fadeIn("fast");
      self._cache();
    }
  }

  log(msg, type=0) {
    let prefix = "timeline.js";
    switch(type) {
      case 1:
        type = "ERROR";
        break;
      case 2:
        type = "INFO";
        break;
      default:
        type = "DEBUG";
        break;
    }

    console.log(`${prefix} ${type}: ${msg}`);
  }

  set forwardVideo(v) {
    this._forwardVideo = v;
    if (this._backwardVideo) this.init();
  }

  get forwardVideo(v) {
    return this._forwardVideo;
  }

  set backwardVideo(v) {
    this._backwardVideo = v;
    if (this._forwardVideo) this.init();
  }

  get backwardVideo(v) {
    return this._backwardVideo;
  }

  set fps(fps) {
    this.deltaTime = 1/fps;
    if (this.mode == 'video' && this.forwardVideo) {
      this.duration = this.forwardVideo.duration();
      this.totalFrames = fps * this.duration;
    }
    this._fps = fps;
  }

  get fps() {
    return this._fps;
  }

  _setURL() {
    let self = this;
    self.filetype = self.src.split('.').pop();
    self.suffix = self.src.match(/[0-9]{1,}/g);
    self.suffix = self.suffix[self.suffix.length-1];
    self.prefix = self.src.split(self.suffix)[0];
  }

  _constructURL(id=undefined) {
    let self = this;
    var suffix;
    if (id) suffix = Array(self.suffix.length-id.toString().length+1).join("0") + id.toString();
    else suffix = Array(self.suffix.length-self.currentFrame.toString().length+1).join("0") + self.currentFrame.toString();
    return self.prefix + suffix + '.' + self.filetype;
  }

  _cache() {
    /*for (var i = 0; i <= self.keyframes[self.keyframes.length-1]); i++) {
      $('#timeline').append(`<img src=""/>`);
    }*/
  }
} 


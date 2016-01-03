var raf = require('raf');
var now = require('right-now');

var NOOP = function(){};


module.exports = function create( obj ){


  var Class = function( cvs ){

    var opts = this.getContextOptions();
    this.gl = cvs.getContext( 'webgl', opts ) || cvs.getContext( 'experimental-webgl', opts ) || cvs.getContext( 'webgl');

    this.canvas = cvs;
    this.width = 0;
    this.height = 0;
    this.frame = this._frame.bind( this );
    this.previousTime = now();
    this._rafId = 0;
    this._playing = false;

    this.init();
  };

  var proto = Class.prototype;

  proto.getContextOptions = obj.getContextOptions || function(){
    return {};
  };

  proto.render = obj.render || NOOP;
  proto.resize = obj.resize || NOOP;
  proto.init   = obj.init   || NOOP;


  proto.dispose = function(){
    this.stop();
  };


  proto.play = function() {
    if( !this._playing ) {
      this._playing = true;
      this.frame();
      this.previousTime = now();
      this._requestFrame();
    }
  };


  proto.stop = function() {
    raf.cancel( this._rafId );
    this._playing = false;
    this._rafId = 0;
  };


  proto._checkSize = function( ){
    var css = getComputedStyle( this.canvas );
    var w = parseInt( css.getPropertyValue( 'width' ) );
    var h = parseInt( css.getPropertyValue( 'height' ) );
    if( isNaN( w ) || isNaN( h ) || w === 0 || h === 0 ){
      return false;
    }
    if( w !== this.width || h !== this.height ){
      this.width = w;
      this.height = h;
      this.resize( w, h );
    }
    return true;
  };


  proto._requestFrame = function( ){
    raf.cancel( this._rafId );
    this._rafId = raf( this.frame );
  };


  proto._frame = function( ) {
    if( ! this._playing ){
      return;
    }
    var time = now();
    var dt = (time - this.previousTime)/1000;
    this.previousTime = time;
    if( dt > 1/5 || dt < 1/180 ) {
      dt = 1/60;
    }
    if( this._checkSize() ){
      this.render( dt );
    }
    if( this._playing ) {
      this._requestFrame();
    }
  };

  return Class;

};
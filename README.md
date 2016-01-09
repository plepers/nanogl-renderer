[![Build Status](https://travis-ci.org/plepers/nanogl-renderer.svg?branch=master)](https://travis-ci.org/plepers/nanogl-renderer)


# nanogl-renderer

Simple webgl bootstrap

##### Subclass Renderer



```javascript
var Renderer = require( 'nanogl-renderer' );

// create a Renderer class providing some options
// all options are optional

var MyRenderer =  Renderer( {

  /**
  * your constructor
  * called after gl context creation
  * init your stuff here
  */
  init(){
    var gl = this.gl;
    // ...
  },

  /**
  * Called before gl context creation
  * return your own gl context parameters here
  */
  getContextOptions(){
    return {
      depth:                  true,
      stencil:                false,
      antialias:              true
      // ..
  },

  /**
  * The rendering loop function, called once you invoked renderer.play()
  * called with a dt argument representing last frame duration in seconds
  */
  render( dt ){
    // dt in seconds
    // ....
    // your magic stuffs here
  },


  /**
  * If set to true, the canvas drawing buffer is resized using window.devicePixelRatio
  * otherwise it assume 1:1 ratio
  * you can later change this property with this.hdpi property then this.updateSize() to force update
  * default to true
  */
  hdpi : false,

  /**
  * Specify a pixelRatio to use instead of window.devicePixelRatio, if greater than 0.
  * you can later change this property with this.pixelRatio property then this.updateSize() to force update
  * default to 0
  */
  pixelRatio : 1.5,


  /**
  * Called when the underlying canvas has been resized
  * and after the canvas drawing buffer has been resized too, based on this.hdpi or this.pixelRatio
  * w and h params are the size of the drawing buffer size (taking pixel ratio into account)
  */
  resize(){

    var w = this.width;
    var h = this.height;

    var elw = this.canvasWidth;
    var elh = this.canvasHeight;

    someStuff.setSize( w, h );
  }

});
```


##### Usage

```javascript

var renderer = new MyRenderer( canvas );

// run rendering loop
renderer.play()

// stop rendering loop
renderer.stop();

// change hdpi or pixel ratio
renderer.hdpi = false
renderer.pixelRatio = 1.0
renderer.updateSize();

```


##### available properties

 - `canvas`       : the initial canvas given in constructor
 - `width`        : the width of the webgl drawing buffer
 - `height`       : the height of the webgl drawing buffer
 - `canvasWidth`  : the css width of the canvas
 - `canvasHeight` : the css height of the canvas
 - `pixelRatio`   : Number - optional pixelRatio
 - `hdpi`         : Boolean - use devicePixelRatio to resize the drawing buffer



var Renderer = require( '../renderer' );

var expect  = require( 'expect.js' );
var sinon = require( 'sinon' );

function makeRenderer( o ) {

  var init   = sinon.spy();
  var resize = sinon.spy();
  var render = sinon.spy();

  var opt = {
    init : init,
    resize : resize,
    render : render
  }

  for( var k in o ){
    opt[k] = o[k];
  }

  var RendererClass = Renderer( opt )

  return {
    _class : RendererClass,
    init : init,
    resize : resize,
    render : render
  }
}


function makeResizeTest( o ){
  var rObj = makeRenderer( o );
  var cvs = document.createElement( 'canvas' );

  return new  rObj._class( cvs );
}


describe( "Renderer", function(){

  it( "should be exported", function(){
    expect( Renderer ).to.be.ok( );
  });


  it( "should have gl context", function(){
    var rObj = makeRenderer();
    var cvs = document.createElement( 'canvas' );

    var r = new  rObj._class( cvs );
    expect( r.gl ).to.be.ok()
    expect( r.canvas ).to.be.ok()
  });


  it( "should call resize with correct values 1", function( ){


    var r = makeResizeTest( )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'
    cvs.style.background = '#f00'
    cvs.style.padding = '10px'
    cvs.style.margin = '10px'

    r.play()
    expect( r.resize.calledOnce ).to.be.ok()
    expect( r.resize.calledBefore( r.render ) ).to.be.ok()

    expect( r.canvasWidth ).to.be.equal( 128 )
    expect( r.canvasHeight ).to.be.equal( 64 )
    expect( r.width ).to.be.equal( 128  * window.devicePixelRatio )
    expect( r.height ).to.be.equal( 64 * window.devicePixelRatio )

    r.dispose()
    document.body.removeChild( cvs )
  });


  it( "should call resize with correct values 2", function( ){

    var r = makeResizeTest( )
    var cvs = r.canvas;
    var div = document.createElement( 'div' );
    div.style.width = '128px';
    div.style.height = '128px';
    div.style.padding = '10px'
    div.style.margin = '10px'

    document.body.appendChild( div );
    div.appendChild( cvs );

    cvs.style.width = '100%'
    cvs.style.height = '100%'
    cvs.style.background = '#f00'
    r.play()

    expect( r.resize.calledOnce ).to.be.ok()
    expect( r.resize.calledBefore( r.render ) ).to.be.ok()
    expect( r.canvasWidth ).to.be.equal( 128 )
    expect( r.canvasHeight ).to.be.equal( 128 )
    expect( r.width ).to.be.equal( 128  * window.devicePixelRatio )
    expect( r.height ).to.be.equal( 128 * window.devicePixelRatio )

    r.dispose()
    document.body.removeChild( div )

  });



  it( "should use no hdpi", function( ){

    var r = makeResizeTest( { hdpi : false } )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()
    expect( r.canvasWidth ).to.be.equal( 128 )
    expect( r.canvasHeight ).to.be.equal( 64 )
    expect( r.width ).to.be.equal( 128  )
    expect( r.height ).to.be.equal( 64 )

    r.dispose()
    document.body.removeChild( cvs )

  });

  it( "should use pixelRatio", function( ){

    var r = makeResizeTest( { pixelRatio : .5 } )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()
    expect( r.canvasWidth ).to.be.equal( 128 )
    expect( r.canvasHeight ).to.be.equal( 64 )
    expect( r.width ).to.be.equal( 64  )
    expect( r.height ).to.be.equal( 32 )

    r.dispose()
    document.body.removeChild( cvs )

  });


  it( "should update hdpi", function( ){

    var r = makeResizeTest()
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()
    r.hdpi = false
    r.updateSize()

    expect( r.width ).to.be.equal( 128  )
    expect( r.height ).to.be.equal( 64 )

    r.dispose()
    document.body.removeChild( cvs )

  });

  it( "should update pixelRatio", function( ){

    var r = makeResizeTest( )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()
    r.pixelRatio = 0.5;
    r.updateSize()

    expect( r.width ).to.be.equal( 64  )
    expect( r.height ).to.be.equal( 32 )

    r.dispose()
    document.body.removeChild( cvs )

  });

  it( "should call render as soon as play called()", function( ){

    var r = makeResizeTest( )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()
    expect( r.render.calledOnce ).to.be.ok()
    r.dispose()
    document.body.removeChild( cvs )

  });


  it( "should not call render if cvs not added", function( ){

    var r = makeResizeTest( )
    var cvs = r.canvas;

    r.play()
    expect( r.render.calledOnce ).not.to.be.ok()

  });

  it( "should call once if played then stopped", function( done ){

    var r = makeResizeTest( )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()
    r.stop()

    setTimeout( function(){
      expect( r.render.calledOnce ).to.be.ok()
      r.dispose()
      document.body.removeChild( cvs )
      done()
    }, 200 )


  });

  it( "should call render few times", function( done ){

    var r = makeResizeTest( )
    var cvs = r.canvas;

    document.body.appendChild( cvs );
    cvs.style.width = '128px'
    cvs.style.height = '64px'

    r.play()

    setTimeout( function(){
      expect( r.render.callCount > 3 ).to.be.ok()
      r.dispose()
      document.body.removeChild( cvs )
      done()
    }, 200 )


  });

});


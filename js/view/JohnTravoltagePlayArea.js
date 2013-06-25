define( function( require ) {
  "use strict";
  var TabView = require( 'JOIST/TabView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( "view/BackgroundElementsNode" );
  var ArmNode = require( 'view/ArmNode' );
  var LegNode = require( 'view/LegNode' );
  var SparkNode = require( 'view/SparkNode' );
  var MinusChargeNode = require( 'view/MinusChargeNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var SoundToggleButton = require( 'SCENERY_PHET/SoundToggleButton' );

  function JohnTravoltagePlayArea( model ) {
    var self = this;

    TabView.call( this );

    this.addChild( new BackgroundElementsNode() );

    this.arm = new ArmNode( model.arm, self );
    this.addChild( this.arm );

    this.leg = new LegNode( model.leg, self );
    this.addChild( this.leg );

    this.addChild( new SparkNode( model.spark, model.arm, model.box2dModel ) );

    this.addChild( new SoundToggleButton( model.soundProperty ) );

    var startPoint, currentPoint;
    this.rotationObject = null;

    this.addInputListener( {
        down: function( event ) {
          startPoint = self.globalToLocalPoint( event.pointer.point );
        },
        up: function( event ) {
          self.rotationObject = null;
        },
        move: function( event ) {
          if ( self.rotationObject ) {
            currentPoint = self.globalToLocalPoint( event.pointer.point );
            if ( currentPoint.x !== self.rotationObject.x && currentPoint.y !== self.rotationObject.y ) {
              var angle = Math.atan2( currentPoint.y - self.rotationObject.model.rotationCenter.y, currentPoint.x - self.rotationObject.model.rotationCenter.x );
              angle -= Math.atan2( startPoint.y - self.rotationObject.model.rotationCenter.y, startPoint.x - self.rotationObject.model.rotationCenter.x );
              self.rotationObject.model.rotationAngle += angle;
              self.rotationObject.rotateAround( self.rotationObject.model.rotationCenter, angle );
              startPoint = currentPoint;
            }
          }
        }
      }

    );

    model.particlesLengthProperty.link( function updateLocation( length ) {
      if ( model.particles.length ) {
        var newElectron = new MinusChargeNode( model.particles[model.particles.length - 1] );
        model.particles[model.particles.length - 1].viewNode = newElectron;
        self.addChild( newElectron );
      }
    } );


    //if last 3 position of leg is correct, add Electron to body
    model.leg.link( 'rotationAngle', function legRotated( angle ) {
      var history = model.leg.angleHistory;
      var mustAddElectron = true;
      history.forEach( function( entry ) {
        if ( entry < 0.1 || entry > 0.8 ) {
          mustAddElectron = false;
        }
      } );
      if ( mustAddElectron ) {
        model.addElectron();
      }
    } );

    /* debug lines, body and forceline
     //TODO temp, remove this;
     var verts = model.verts;
     var customShape = new Shape();
     customShape.moveTo( verts[0][0], verts[0][1] );

     for ( var i = 1; i < verts.length; i++ ) {
     customShape.lineTo( verts[i][0], verts[i][1] );
     customShape.moveTo( verts[i][0], verts[i][1] );
     }
     var path = new Path( {
     shape: customShape,
     stroke: 'green',
     lineWidth: 1,
     pickable: false,
     renderer: 'svg',
     x: 255,
     y: -135
     } );
     this.addChild( path );

     var lines = model.forceLines;

     for ( i = 0; i < lines.length; i++ ) {
     customShape = new Shape();
     customShape.moveTo( lines[i][0], lines[i][1] );
     customShape.lineTo( lines[i][2], lines[i][3] );
     path = new Path( {
     shape: customShape,
     stroke: 'red',
     lineWidth: 1,
     pickable: false,
     renderer: 'svg',
     x: 0,
     y: 0
     } );
     this.addChild( path );
     }
     */
  }

  inherit( TabView, JohnTravoltagePlayArea );
  return JohnTravoltagePlayArea;
} )
;

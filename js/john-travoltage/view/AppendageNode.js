// Copyright 2013-2015, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );

  //Compute the distance (in radians) between angles a and b, using an inlined dot product (inlined to remove allocations)
  var distanceBetweenAngles = function( a, b ) {
    var dotProduct = Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b );
    return Math.acos( dotProduct );
  };

  var radiansToScale = function ( radian, stepsInScale, round) {
    var scaleValue = radian * (stepsInScale / ( 2 * Math.PI ) );

    console.log( 'scaleValue: ', scaleValue );
    return round ? Math.round(scaleValue): scaleValue;
  };

  var scaleToRadians = function ( scaleValue, stepsInScale) {
    var radian = scaleValue * ( Math.PI / ( stepsInScale / 2 ) );

    console.log( 'radian: ', radian );
    return radian;
  };

  /**
   * @param {Leg|Arm} appendage the body part to display
   * @param {Image} image
   * @param {Number} dx
   * @param {Number} dy
   * @param {Number} angleOffset the angle about which to rotate
   * @constructor
   */
  function AppendageNode( appendage, image, dx, dy, angleOffset ) {
    var appendageNode = this;

    Node.call( this, { cursor: 'pointer' } );

    this.model = appendage;
    var angle = 0;

    // add the image
    var imageNode = new Image( image );
    this.addChild( imageNode );

    var lastAngle = appendage.angle;
    var currentAngle = appendage.angle;
    this.dragging = false;

    var limitLegRotation = function( angle ) {
      if ( angle < -Math.PI / 2 ) {
        angle = Math.PI;
      }
      else if ( angle > -Math.PI / 2 && angle < 0 ) {
        angle = 0;
      }
      return angle;
    };

    imageNode.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      start: function( event ) {
        appendageNode.border.visible = false;
        appendageNode.dragging = true;
      },
      drag: function( event ) {
        lastAngle = currentAngle;
        var globalPoint = imageNode.globalToParentPoint( event.pointer.point );
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();
        currentAngle = angle;

        //Limit leg to approximately "half circle" so it cannot spin around, see #63
        if ( appendage instanceof Leg ) {
          angle = limitLegRotation( angle );
        }

        //if clamped at one of the upper angles, only allow the right direction of movement to change the angle, so it won't skip halfway around
        //Use 3d cross products to compute direction
        //Inline the vector creations and dot product for performance
        var z = Math.cos( currentAngle ) * Math.sin( lastAngle ) - Math.sin( currentAngle ) * Math.cos( lastAngle );

        if ( appendage.angle === Math.PI && z < 0 ) {
          //noop, at the left side
        }
        else if ( appendage.angle === 0 && z > 0 ) {
          //noop, at the right side
        }
        else if ( distanceBetweenAngles( appendage.angle, angle ) > Math.PI / 3 && (appendage.angle === 0 || appendage.angle === Math.PI) ) {
          //noop, too big a leap, may correspond to the user reversing direction after a leg is stuck against threshold
        }
        else {
          appendage.angle = angle;
          // console.log( appendage.angle );

          var scale = 50;

          if ( appendage instanceof Leg ) {
            scale = 30;
          }

          var position = appendage.angle * ( scale / Math.PI );

          console.log( 'radian:', appendage.angle, 'position:',  position);
        }

      },
      end: function() {
        appendageNode.dragging = false;
      }
    } ) );

    //changes visual position
    appendage.angleProperty.link( function updatePosition( angle ) {
      imageNode.resetTransform();
      imageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      imageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
    } );

    this.border = new Rectangle( this.bounds.minX, this.bounds.minY, this.width, this.height, 10, 10, {
      stroke: 'green',
      lineWidth: 2,
      lineDash: [ 10, 10 ],
      pickable: false
    } );
    this.addChild( this.border );

    //For debugging
    var debugging = false;
    if ( debugging ) {
      var origin = new Circle( 22, {
        fill: '#080909',
        x: appendage.position.x,
        y: appendage.position.y,
        pickable: false
      } );
      this.addChild( origin );

      var mousePosition = new Circle( 7, { fill: 'blue', x: 0, y: 0, pickable: false } );
      this.addChild( mousePosition );
    }

    // Add accessible content for the leg, introducing keyboard navigation and arrow keys to rotate the appendage.

    if( appendage instanceof Leg ) {
      this.setAccessibleContent( {
        createPeer: function( accessibleInstance ) {
          var appendageType = 'foot';

          var motion = {
            min: 0,
            max: 30,
            step: 1,
            totalRange: 60
          };

          // foot
          var calculateValue = function () {
            return motion.max - radiansToScale( appendage.angle, motion.totalRange, true );
          };

          var calculateScaleValue = function () {
            return motion.max - domElement.value;
          };

          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();

          var domElement = document.createElement( 'input' );
          domElement.setAttribute( 'role', 'slider' );
          domElement.setAttribute( 'type', 'range' );
          domElement.id = appendageType + '-slider-' + uniqueId;

          domElement.setAttribute( 'min', motion.min );
          domElement.setAttribute( 'max', motion.max );
          domElement.setAttribute( 'step', motion.step );
          domElement.value = calculateValue();

          domElement.addEventListener( 'input', function ( event ) {
            console.log( 'original value:', domElement.value);
            var scaleValue = calculateScaleValue();

            appendage.angle = scaleToRadians(scaleValue, motion.totalRange);
          } );

          //changes visual position
          appendage.angleProperty.link( function updatePosition( angle ) {
            domElement.value = calculateValue();
          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      } );
    } else {
      this.setAccessibleContent( {
        createPeer: function( accessibleInstance ) {
          var appendageType = 'hand';

          var motion = {
            min: 0,
            max: 100,
            step: 1,
            totalRange: 100
          };

          var calculateValue = function () {
            return ( motion.max / 2 ) + radiansToScale( appendage.angle, motion.totalRange, true );
          };

          var calculateScaleValue = function () {
            return domElement.value - ( motion.max / 2 );
          };

          var trail = accessibleInstance.trail;
          var uniqueId = trail.getUniqueId();

          var domElement = document.createElement( 'input' );
          domElement.setAttribute( 'role', 'slider' );
          domElement.setAttribute( 'type', 'range' );
          domElement.id = appendageType + '-slider-' + uniqueId;

          domElement.setAttribute( 'min', motion.min );
          domElement.setAttribute( 'max', motion.max );
          domElement.setAttribute( 'step', motion.step );
          domElement.value = calculateValue();

          domElement.addEventListener( 'input', function ( event ) {
            console.log( 'original value:', domElement.value);
            var scaleValue = calculateScaleValue();

            appendage.angle = scaleToRadians(scaleValue, motion.totalRange);
          } );

          //changes visual position
          appendage.angleProperty.link( function updatePosition( angle ) {
            domElement.value = calculateValue();
          } );

          return new AccessiblePeer( accessibleInstance, domElement );
        }
      } );
    }
  }

  return inherit( Node, AppendageNode );
} );

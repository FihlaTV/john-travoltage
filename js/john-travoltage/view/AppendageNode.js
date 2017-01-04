// Copyright 2013-2015, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Util = require( 'DOT/Util' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var Sound = require( 'VIBE/Sound' );

  // audio
  var limitBonkAudio = require( 'audio!JOHN_TRAVOLTAGE/limit-bonk' );

  // strings
  // a11y strings should not be translatable for now, see
  // https://github.com/phetsims/john-travoltage/issues/130
  var positionTemplateString = 'Position {0}: {1}';

  /**
   * @param {Leg|Arm} appendage the body part to display
   * @param {Image} image
   * @param {number} dx
   * @param {number} dy
   * @param {number} angleOffset the angle about which to rotate
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {Array} rangeMap - an array of objects of the format {range: {max: Number, min: Number}, text: String}. This
   *                           is used to map a position value to text to use for the valueText of the related slider.
   * @param {Object} options -  optional configuration such as "keyboardMidPointOffset"; which is used to adjust the
   *                 centre position of the HTML slider for keyboard accessibility. For example it can be used to
   *                 align the doorknob as the centre position of the arm slider.
   * @constructor
   */
  function AppendageNode( appendage, image, dx, dy, angleOffset, soundEnabledProperty, rangeMap, options ) {
    var self = this;

    this.model = appendage;
    var angle = 0;

    options = _.extend( {
      keyboardMidPointOffset: 0,
      cursor: 'pointer',

      // a11y
      tagName: 'input',
      inputType: 'range',
      ariaRole: 'slider',
      focusable: true,

      parentContainerTagName: 'div'

    }, options );

    AccessibleNode.call( this, options );

    // add the image
    var imageNode = new Image( image );
    this.addChild( imageNode );

    // create the sound that will be played when the motion range is reached
    var limitBonkSound = new Sound( limitBonkAudio );

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
        self.border.visible = false;
        self.dragging = true;
      },
      drag: function( event ) {
        lastAngle = currentAngle;
        var globalPoint = imageNode.globalToParentPoint( event.pointer.point );
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();
        currentAngle = angle;

        //Limit leg to approximately "half circle" so it cannot spin around, see #63
        if ( appendage instanceof Leg ) {
          angle = limitLegRotation( angle );

          if ( JohnTravoltageQueryParameters.sonification > 1 && soundEnabledProperty.value ){
            // play a sound when the range of motion is reached
            if ( ( angle === 0 && lastAngle > 0 ) ||
                 ( angle === Math.PI && lastAngle > 0 && lastAngle < Math.PI ) ){
              limitBonkSound.play();
            }
          }
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
        else if ( self.distanceBetweenAngles( appendage.angle, angle ) > Math.PI / 3 && ( appendage.angle === 0 || appendage.angle === Math.PI ) ) {
          //noop, too big a leap, may correspond to the user reversing direction after a leg is stuck against threshold
        }
        else {
          appendage.angle = angle;
        }

      },
      end: function() {
        self.dragging = false;
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

    // a11y
    var focusCircle = new Circle( imageNode.width / 2, { stroke: 'rgba(250,40,135,0.9)', lineWidth: 5 } );
    this.focusHighlight = focusCircle;

    // limit ranges of input for the leg
    var maxMotion;
    var totalRange;
    if ( appendage instanceof Leg ) {
      maxMotion = 30;
      totalRange = 60;
    }
    else {
      maxMotion = 100;
      totalRange = 100;
    }
    var keyboardMotion = {
      min: 0,
      max: maxMotion,
      step: 1,
      totalRange: totalRange
    };

    // Safari seems to require that a range input has a width, otherwise it will not be keyboard accessible.
    this.domElement.style.width = '1px';

    this.setAttribute( 'min', keyboardMotion.min );
    this.setAttribute( 'max', keyboardMotion.max );
    this.setAttribute( 'step', keyboardMotion.step );

    var rangeValue = self.angleToPosition( appendage.angle, keyboardMotion.totalRange, keyboardMotion.max, options.keyboardMidPointOffset );
    this.setInputValue( rangeValue );

    if ( options.controls ) {
      this.setAttribute( 'aria-controls', options.controls.join( ',' ));
    }

    // Due to the variability of input and change event firing across browsers,
    // it is necessary to track if the input event was fired and if not, to
    // handle the change event instead.
    // see: https://wiki.fluidproject.org/pages/viewpage.action?pageId=61767683
    var keyboardEventHandled = false;
    var rotateAppendage = function () {
      appendage.angle = self.positionToAngle( self.domElement.value, keyboardMotion.totalRange, options.keyboardMidPointOffset );
      self.border.visible = false;
    };
    this.addDOMEventListener( 'change', function( event ) {
      if (!keyboardEventHandled) {
        rotateAppendage();
      }
      keyboardEventHandled = false;
      self.dragging = true;
    } );
    this.addDOMEventListener( 'input', function( event ) {
      rotateAppendage();
      keyboardEventHandled = true;
      self.dragging = true;
    } );

    // on blur, the appendage node is considered 'released' from dragging
    self.addDOMEventListener( 'blur', function( event ) {
      self.dragging = 'false';
    } );

    var updatePosition = function ( angle ) {
      var position = self.angleToPosition( appendage.angle, keyboardMotion.totalRange, keyboardMotion.max, options.keyboardMidPointOffset );
      var positionDescription = self.getPositionDescription( position, rangeMap );
      self.setInputValue( position );
      self.setAttribute( 'aria-valuetext', StringUtils.format( positionTemplateString, position, positionDescription ) );
      self.positionDescription = positionDescription;

      // updates the position of the focus highlight
      focusCircle.center = imageNode.center;
    };

    // Updates the PDOM with changes in the model
    appendage.angleProperty.link( updatePosition );

  }

  johnTravoltage.register( 'AppendageNode', AppendageNode );

  return inherit( AccessibleNode, AppendageNode, {

    /**
     * Compute the distance (in radians) between angles a and b, using an inlined dot product (inlined to remove allocations)
     * @private
     */
    distanceBetweenAngles: function( a, b ) {
      var dotProduct = Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b );
      return Math.acos( dotProduct );
    },

    /**
     * Converts a radian value to a scale value ( based on number of stepsInScale ).
     * @accessibility
     * @private
     */
    radiansToScale: function ( radian, stepsInScale, radianOffset ) {
      var radianWithOffset = radian - radianOffset;
      var scaleValue = ( radianWithOffset ) * ( ( stepsInScale / 2 ) / Math.PI );

      return Util.roundSymmetric( scaleValue );
    },

    /**
     * Converts a scale value ( based on number of stepsInScale ) to a radian value.
     * @accessibility
     * @private
     */
    scaleToRadians: function ( scaleValue, stepsInScale, radianOffset ) {
      var radian = scaleValue * ( Math.PI / ( stepsInScale / 2 ) );
      var radianWithOffset = radian + radianOffset;

      return radianWithOffset;
    },

    /**
     * Because the radian values for the complete range of motion is calculated from -1π to 1π radians,
     * the scale can become a negative value. This transforms the scale to a positive value, usable by the slider in
     * in the PDOM.
     * @accessibility
     * @private
     */
    scalePositionTransformation: function ( totalSteps, value ) {
      return ( totalSteps / 2 ) - value;
    },

    /**
     * Calculates the position of an appendage based on its angle. Useful for setting the position of the corresponding
     * slider in the PDOM.
     * @accessibility
     * @private
     */
    angleToPosition: function ( appendageAngle, motionRange, maxPosition, radianOffset ) {
      var scaleValue = this.radiansToScale( appendageAngle, motionRange, radianOffset );
      var position = this.scalePositionTransformation( motionRange, scaleValue );
      return position > maxPosition ? position % maxPosition : position;
    },

    /**
     * Calculates the angle of an appendage based on its position. Useful for setting the angle of the appendage from
     * the corresponding slider in the PDOM.
     * @accessibility
     * @private
     */
    positionToAngle: function ( position, motionRange, radianOffset ) {
      var scaleValue = this.scalePositionTransformation( motionRange, position );

      return this.scaleToRadians( scaleValue, motionRange, radianOffset );
    },

    /**
     * Determines the position description based on where the position falls in the supplied rangeMap.
     * @accessibility
     * @private
     */
    getPositionDescription: function ( position, rangeMap ) {
      var message = '';

      _.forEach(rangeMap, function (map) {
        if (position >= map.range.min && position <= map.range.max) {
          message = map.text;
          return false;
        }
      });

      return message;
    }
  } );
} );

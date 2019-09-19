// Copyright 2017-2019, University of Colorado Boulder

/**
 * A base type for appedages in this sim. Extended by Arm.js and Leg.js.  Appendages have a pivot point, and an
 * observable angle which is used for dragging.
 *
 * @author Jesse Greenberg
 */

define( require => {
  'use strict';

  // modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const Emitter = require( 'AXON/Emitter' );
  const inherit = require( 'PHET_CORE/inherit' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const NumberProperty = require( 'AXON/NumberProperty' );
  const Range = require( 'DOT/Range' );

  const MOVEMENT_DIRECTIONS = {
    CLOSER: 'CLOSER',
    FARTHER: 'FARTHER'
  };

  /**
   * @constructor
   * @param {Vector2} pivotPoint
   * @param {Tandem} tandem
   * @param {Object} options
   */
  function Appendage( pivotPoint, tandem, options ) {

    options = _.extend( {
      initialAngle: -0.5, // radians
      range: new Range( -Math.PI, Math.PI ),
      precision: 7
    }, options );

    // @private
    this.initialAngle = options.initialAngle;

    // @public
    this.angleProperty = new NumberProperty( this.initialAngle, {
      tandem: tandem.createTandem( 'angleProperty' ),
      units: 'radians',
      range: options.range
    } );

    // @public
    this.borderVisibleProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'borderVisibleProperty' )
    } );

    // @public (read-only)
    this.position = pivotPoint;

    // @public - Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;

    // @public - emits an event when the appendage is reset
    this.appendageResetEmitter = new Emitter();

    // @public - emits an event when the appendage begins dragging
    this.dragStartedEmitter = new Emitter();
  }

  johnTravoltage.register( 'Appendage', Appendage );

  return inherit( Object, Appendage, {

    /**
     * Reset the appendage.
     * @public
     */
    reset: function() {
      this.angleProperty.reset();
      this.appendageResetEmitter.emit();
    }
  }, {

    // @public @static
    MOVEMENT_DIRECTIONS: MOVEMENT_DIRECTIONS
  } );

} );

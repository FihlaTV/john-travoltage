// Copyright 2013-2015, University of Colorado Boulder

/**
 * Arm model of a John-Travoltage.
 * Can rotate around rotation center.
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  function Arm( tandem ) {
    this.angleProperty = new NumberProperty( -0.5, {
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioValueType: TNumber( { units: 'radians' } )
    } );
    Property.preventGetSet( this, 'angle' );

    //Arm pivot (elbow point) sampled using DebugPositions.js
    this.position = new Vector2( 423.6179673321235, 229.84969476984 );

    //Exact finger location sampled using DebugPositions.js
    var finger = new Vector2( 534.3076703633706, 206.63766358806117 );
    this.fingerVector = finger.minus( this.position );

    //Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;
  }

  johnTravoltage.register( 'Arm', Arm );

  return inherit( Object, Arm, {
    reset: function() {
      this.angleProperty.reset();
    },
    getFingerPosition: function() {

      //TODO: Reduce allocations, possibly move this to a field that mutates
      return this.fingerVector.rotated( this.angleProperty.get() ).plus( this.position );
    },
    deltaAngle: function() { return this.angleProperty.get(); }
  } );
} );
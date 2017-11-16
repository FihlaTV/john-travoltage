// Copyright 2013-2017, University of Colorado Boulder

/**
 * Model for John Travoltage's arm, which can rotate about the shoulder.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Appendage = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Appendage' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function Arm( tandem ) {

    // position determined empirically with DebugUtils
    var pivotPoint = new Vector2( 423.6179673321235, 229.84969476984 );

    Appendage.call( this, pivotPoint, tandem );

    // Exact finger location sampled using DebugUtils.js
    var finger = new Vector2( 534.3076703633706, 206.63766358806117 );

    // @public (read-only) - vector from pivot point to the finger
    this.fingerVector = finger.minus( this.position );
  }

  johnTravoltage.register( 'Arm', Arm );

  return inherit( Appendage, Arm, {

    /**
     * Reset the arm.
     * @public
     */
    reset: function() {
      this.angleProperty.reset();
      Appendage.prototype.reset.call( this );
    },

    /**
     * Gets the location of the finger with the current appendage rotation.
     * @returns {Vector2}
     * @public
     */
    getFingerPosition: function() {
      return this.fingerVector.rotated( this.angleProperty.get() ).plus( this.position );
    }
  } );
} );
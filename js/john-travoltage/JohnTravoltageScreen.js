// Copyright 2013-2015, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var JohnTravoltageView = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageView' );
  var Screen = require( 'JOIST/Screen' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // strings
  var johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  /**
   * @param tandem
   * @constructor
   */
  function JohnTravoltageScreen( tandem ) {
    Screen.call(
      this,
      johnTravoltageTitleString,
      null /* single-screen sim, no icon */,
      function() {
        return new JohnTravoltageModel( tandem.createTandem( 'model' ) );
      },
      function( model ) {
        return new JohnTravoltageView( model );
      }, {
        backgroundColor: '#9ddcf8'
      }
    );
  }

  johnTravoltage.register( 'JohnTravoltageScreen', JohnTravoltageScreen );
  
  return inherit( Screen, JohnTravoltageScreen );
} );
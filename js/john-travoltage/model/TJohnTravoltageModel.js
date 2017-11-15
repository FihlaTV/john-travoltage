// Copyright 2017, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TJohnTravoltageModel( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.johnTravoltage.JohnTravoltageModel );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'TJohnTravoltageModel', TJohnTravoltageModel, {}, {
    documentation: 'The model for John Travoltage',
    clearChildInstances: function( model ) {
      model.clearElectrons();
    },

    /**
     * Adds an Electron as specified by the phetioID and state.
     * @param {Object} model
     * @param {Tandem} tandem
     * @param {Object} electronStateObject
     */
    addChildInstance: function( model, tandem, electronStateObject ) {
      model.addElectron( tandem );
    }
  } );

  johnTravoltage.register( 'TJohnTravoltageModel', TJohnTravoltageModel );

  return TJohnTravoltageModel;
} );


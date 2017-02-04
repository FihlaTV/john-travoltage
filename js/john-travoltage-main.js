// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Sim = require( 'JOIST/Sim' );
  var JohnTravoltageScreen = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageScreen' );
  var Tandem = require( 'TANDEM/Tandem' );
  var JohnTravoltageKeyboardHelpContent = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageKeyboardHelpContent' );

  // strings
  var johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  //Workaround for #30
  var newChild = document.createElement( 'audio' );
  newChild.style.display = 'none';
  document.body.appendChild( newChild );

  var tandem = Tandem.createRootTandem();

  // help content to describe keyboard interactions
  var keyboardHelpContent = new JohnTravoltageKeyboardHelpContent( tandem.createTandem( 'keyboardHelpContent' ) );

  var simOptions = {
    credits: {
      leadDesign: 'Noah Podolefsky, Carl Wieman, Sam Reid',
      softwareDevelopment: 'Sam Reid',
      team: 'Wendy Adams, Trish Loeblein, Ariel Paul, Kathy Perkins',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team\n' +
              'to convert this simulation to HTML5.'
    },
    accessibility: true,
    keyboardHelpNode: keyboardHelpContent
  };

  //Create and start the sim
  SimLauncher.launch( function() {
    new Sim( johnTravoltageTitleString, [
      new JohnTravoltageScreen( tandem.createTandem( 'johnTravoltageScreen' ) )
    ], simOptions ).start();
  } );
} );
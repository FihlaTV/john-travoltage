// Copyright 2016, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * RangeMaps used by the AppendageNodes to associate a position with a position description.
 *
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Range = require( 'DOT/Range' );

  // strings - a11y strings should NOT be translatable yet
  // see https://github.com/phetsims/john-travoltage/issues/130
  var footOnCarpetString = JohnTravoltageA11yStrings.footOnCarpetString;
  var footOffCarpetString = JohnTravoltageA11yStrings.footOffCarpetString;

  var farthestFromDoorknobString = JohnTravoltageA11yStrings.farthestFromDoorknobString;
  var veryFarFromDoorknobString = JohnTravoltageA11yStrings.veryFarFromDoorknobString;
  var farFromDoorknobString = JohnTravoltageA11yStrings.farFromDoorknobString;
  var notSoCloseToDoorknobString = JohnTravoltageA11yStrings.notSoCloseToDoorknobString;
  var closeToDoorknobString = JohnTravoltageA11yStrings.closeToDoorknobString;
  var veryClosetoDoorknobString = JohnTravoltageA11yStrings.veryClosetoDoorknobString;
  var justAboveDoorknobString = JohnTravoltageA11yStrings.justAboveDoorknobString;
  var atDoorknobString = JohnTravoltageA11yStrings.atDoorknobString;
  var justBelowDoorknobString = JohnTravoltageA11yStrings.justBelowDoorknobString;

  var handPointingAwayString = JohnTravoltageA11yStrings.handPointingAwayString;
  var handPointingStraightUpString = JohnTravoltageA11yStrings.handPointingStraightUpString;
  var handPointingAtUpperDoorframeString = JohnTravoltageA11yStrings.handPointingAtUpperDoorframeString;
  var handPointingAtLowerDoorFrameString = JohnTravoltageA11yStrings.handPointingAtLowerDoorFrameString;
  var handPointingStraightDownString = JohnTravoltageA11yStrings.handPointingStraightDownString;

  var AppendageRangeMaps = {

    legMap: {
      regions: [
        {
          range: new Range( -15, -10 ),
          text: footOffCarpetString
        }, {
          range: new Range( -9, 6 ),
          text: footOnCarpetString
        }, {
          range: new Range( 7, 15 ),
          text: footOffCarpetString
        }
      ],
      landmarks: {}
    },

    armMap: {
      regions: [
        {
          range: new Range( -30, -30 ),
          text: farthestFromDoorknobString
        }, {
          range: new Range( -29, -24 ),
          text: veryFarFromDoorknobString
        }, {
          range: new Range( -23, -18 ),
          text: farFromDoorknobString
        }, {
          range: new Range( -17, -13 ),
          text: notSoCloseToDoorknobString
        }, {
          range: new Range( -12, -9 ),
          text: closeToDoorknobString
        }, {
          range: new Range( -8, -5 ),
          text: veryClosetoDoorknobString
        }, {
          range: new Range( -4, -2 ),
          text: justBelowDoorknobString
        }, {
          range: new Range( -1, 1 ),
          text: atDoorknobString
        }, {
          range: new Range( 2, 4 ),
          text: justAboveDoorknobString
        }, {
          range: new Range( 5, 8 ),
          text: veryClosetoDoorknobString
        }, {
          range: new Range( 9, 12 ),
          text: closeToDoorknobString
        }, {
          range: new Range( 13, 17 ),
          text: notSoCloseToDoorknobString
        }, {
          range: new Range( 18, 23 ),
          text: farFromDoorknobString
        }, {
          range: new Range( 24, 29 ),
          text: veryFarFromDoorknobString
        }, {
          range: new Range( 30, 30 ),
          text: farthestFromDoorknobString
        }
      ],

      landmarks: [
        {
          value: 26,
          text: handPointingAwayString
        },
        {
          value: 17,
          text: handPointingStraightUpString
        },
        {
          value: 11,
          text: handPointingAtUpperDoorframeString
        },
        {
          value: -7,
          text: handPointingAtLowerDoorFrameString
        },
        {
          value: -13,
          text: handPointingStraightDownString
        },
        {
          value: -26,
          text: handPointingAwayString
        }
      ]
    }
  };

  johnTravoltage.register( 'AppendageRangeMaps', AppendageRangeMaps );

  return AppendageRangeMaps;
} );

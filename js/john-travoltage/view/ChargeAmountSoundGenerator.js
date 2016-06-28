// Copyright 2016, University of Colorado Boulder

/**
 * a sound generator intended for use in portraying the quantity of charge present, created for sonification
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Sound = require( 'VIBE/Sound' );

  // audio
  var padForChargeLevel1 = require( 'audio!JOHN_TRAVOLTAGE/pad-for-charge-level-01.wav' );

  // constants
  var MIN_GAIN = 0.2;
  var MAX_GAIN = 1.0;
  var MIN_FILTER_CUTOFF = 100;
  var MAX_FILTER_CUTOFF = 5000;

  /**
   * @constructor
   * {Property.<boolean> soundEnabledProperty
   */
  function ChargeAmountSoundGenerator( soundEnabledProperty, numItemsProperty, minItems, maxItems ) {

    var sound = new Sound( padForChargeLevel1 );
    var soundLoaded = false;
    var soundIsPlaying = false;
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();
    var soundSource;

    // create a gain stage, makes the sound louder as the amount of charge increases
    var masterGainControl = audioContext.createGain();
    masterGainControl.gain.value = 0;
    masterGainControl.connect( audioContext.destination );

    // create a filter stage, lets more high frequencies through as the amount of change increases
    var filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = MIN_FILTER_CUTOFF;
    filter.connect( masterGainControl );

    // create a function to map the amount of charge to output gain
    var mapNumItemsToGain = LinearFunction( minItems, maxItems, MIN_GAIN, MAX_GAIN );

    // create a function to map the amount of charge to filter cutoff
    var mapNumItemsToFilterCutoff = LinearFunction( minItems, maxItems, MIN_FILTER_CUTOFF, MAX_FILTER_CUTOFF );

    // start and stop the sounds and adjust it based on the number of items
    numItemsProperty.link( function( numItems ){

      if ( numItems > 0 ) {

        // This is necessary because of the async load of the audio buffer.
        if ( !soundLoaded && typeof( sound.audioBuffer ) !== 'undefined' ) {
          soundLoaded = true;
        }

        if ( soundLoaded && !soundIsPlaying ) {

          // create the sound source and start it up
          soundSource = audioContext.createBufferSource();
          soundSource.buffer = sound.audioBuffer;
          soundSource.loop = true;
          soundSource.connect( filter );
          soundSource.start();
          soundIsPlaying = true;
        }

        // set the filter cutoff
        filter.frequency.value = mapNumItemsToFilterCutoff( numItems );

        // set the gain
        masterGainControl.gain.value = soundEnabledProperty.value ? mapNumItemsToGain( numItems ) : 0;
      }
      else{
        if ( soundIsPlaying ){
          soundSource.stop();
          soundIsPlaying = false;
        }
      }
    } );

    soundEnabledProperty.link( function( soundEnabled ){
      if ( !soundEnabled ){
        masterGainControl.gain.value = 0;
      }
    } );
  }

  johnTravoltage.register( 'ChargeAmountSoundGenerator', ChargeAmountSoundGenerator );

  return inherit( Object, ChargeAmountSoundGenerator );
} );
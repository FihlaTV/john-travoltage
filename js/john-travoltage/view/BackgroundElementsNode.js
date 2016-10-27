// Copyright 2013-2015, University of Colorado Boulder

/**
 * Background static elements of simulation
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Pattern = require( 'SCENERY/util/Pattern' );
  var Image = require( 'SCENERY/nodes/Image' );
  // var Vector2 = require( 'DOT/Vector2' );
  // var Property = require( 'AXON/Property' );
  // var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // images
  var wallpaper = require( 'image!JOHN_TRAVOLTAGE/wallpaper.png' );
  var floor = require( 'image!JOHN_TRAVOLTAGE/floor.png' );
  var rug = require( 'image!JOHN_TRAVOLTAGE/rug.png' );
  var body = require( 'image!JOHN_TRAVOLTAGE/body.png' );
  // var face = require( 'image!JOHN_TRAVOLTAGE/face.png' );
  // var head = require( 'image!JOHN_TRAVOLTAGE/head.png' );
  var door = require( 'image!JOHN_TRAVOLTAGE/door.png' );
  var window = require( 'image!JOHN_TRAVOLTAGE/window.png' );

  function BackgroundElementsNode() {

    Node.call( this, { pickable: true } );

    //wallpapers
    this.addChild( new Rectangle( -1000, -300, 3000, 1100, {
      fill: new Pattern( wallpaper )
    } ) );

    // add the Window image
    this.addChild( new Image( window, {
      x: 50,
      y: 60,
      scale: 0.93
    } ) );

    // add the floor image
    this.addChild( new Rectangle( -1000, 440, 3000, 1100, {
      fill: new Pattern( floor )
    } ) );

    // add the rug image
    this.addChild( new Image( rug, {
      x: 110,
      y: 446,
      scale: 0.58
    } ) );

    // add the door image
    this.addChild( new Image( door, {
      x: 513.5,
      y: 48,
      scale: 0.785
    } ) );

    var bodyImage = new Image( body, {
      x: 291.744,
      y: 62.299,
      scale: 0.74
    } );

    // var headImage = new Image( head, {
    //   scale: 0.72,
    //   x: 361.09,
    //   y: 65.33
    // } );

    // var imageLocationProperty = new Property( new Vector2( 0, 0 ) );
    // bodyImage.addInputListener( new MovableDragHandler( imageLocationProperty ) );

    // imageLocationProperty.link( function( position ) {
    //   console.log( 'x ' + bodyImage.x )
    //   console.log( 'y ' + bodyImage.y );
    //   bodyImage.translation = position;
    // } );

    this.addChild( bodyImage );
  }

  johnTravoltage.register( 'BackgroundElementsNode', BackgroundElementsNode );
  
  return inherit( Node, BackgroundElementsNode );
} );
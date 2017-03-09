// Copyright 2013-2017, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Line = require( 'SCENERY/nodes/Line' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/BackgroundNode' );
  var AppendageRangeMaps = require( 'JOHN_TRAVOLTAGE/john-travoltage/AppendageRangeMaps' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AppendageNode' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/SparkNode' );
  var ElectronLayerNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronLayerNode' );
  var Shape = require( 'KITE/Shape' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var DebugUtils = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/DebugUtils' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var platform = require( 'PHET_CORE/platform' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var JohnTravoltageAudio = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/audio/JohnTravoltageAudio' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Sound = require( 'VIBE/Sound' );
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );

  // audio
  var shockOuchAudio = require( 'audio!JOHN_TRAVOLTAGE/shock-ouch' );
  var shockAudio = require( 'audio!JOHN_TRAVOLTAGE/shock' );

  // images
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // constants
  var SONIFICATION_CONTROL = JohnTravoltageQueryParameters.sonification;

  // strings
  var johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  /**
   * @param {JohnTravoltageModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageView( model, tandem ) {
    var self = this;
    this.model = model;

    //The sim works best in most browsers using svg.
    //But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 ),

      // a11y
      accessibleLabel: johnTravoltageTitleString
    } );

    //add background elements
    this.addChild( new BackgroundNode( tandem.createTandem( 'backgroundNode' ) ) );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    //add an form element to contain all controls
    var accessibleFormNode = new Node( {
      tagName: 'form'
    } );
    this.addChild( accessibleFormNode );

    // @public (read-only) arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, model.soundProperty, AppendageRangeMaps.leg,
      tandem.createTandem( 'legNode' ), {
        labelTagName: 'label',
        label: JohnTravoltageA11yStrings.legSliderLabelString
      } );
    accessibleFormNode.addChild( this.leg );

    // @public (read-only) the keyboardMidPointOffset was manually calculated as a radian offset that will trigger a discharge with the
    // minimum charge level.
    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, model.soundProperty, AppendageRangeMaps.arm,
      tandem.createTandem( 'armNode' ), {
        keyboardMidPointOffset: 0.41,
        labelTagName: 'label',
        label: JohnTravoltageA11yStrings.armSliderLabelString
      } );
    accessibleFormNode.addChild( this.arm );

    // Show the dotted lines again when the sim is reset
    model.resetEmitter.addListener( function() {
      if ( !self.leg.dragging ) {
        model.leg.borderVisibleProperty.set( true );
      }
      if ( !self.arm.dragging ) {
        model.arm.borderVisibleProperty.set( true );
      }
    } );

    // spark
    accessibleFormNode.addChild( new SparkNode(
      model,
      function( listener ) { model.stepEmitter.addListener( listener ); },
      tandem.createTandem( 'sparkNode' )
    ) );

    // Sound button and reset all button
    var soundToggleButton = new SoundToggleButton( model.soundProperty, {
      tandem: tandem.createTandem( 'soundToggleButton' )
    } );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
        // model.reset.bind( model )

        // clear status content
        AriaHerald.clearPoliteWithStatus();
      },
      scale: 1.32,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );
    resetAllButton.scale( soundToggleButton.height / resetAllButton.height );
    accessibleFormNode.addChild( new HBox( {
      spacing: 10,
      children: [ soundToggleButton, resetAllButton ],
      right: this.layoutBounds.maxX - 7,
      bottom: this.layoutBounds.maxY - 7
    } ) );

    //add sonification if enabled
    if ( SONIFICATION_CONTROL !== 'none' ) {
      this.audioView = new JohnTravoltageAudio( model, this.arm, SONIFICATION_CONTROL );
    }

    //Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating
    //over all electrons to see if they are pickable?
    //Split layers before particle layer for performance
    var electronLayer = new ElectronLayerNode( model, JohnTravoltageModel.MAX_ELECTRONS, tandem.createTandem( 'electronLayer' ), {
      layerSplit: true,
      pickable: false
    } );
    accessibleFormNode.addChild( electronLayer );

    // after travolta picks up electrons the first time, this flag will modify descriptions slightly
    var hadElectrons = false;
    var updateDescription = function() {
      var chargeDescriptor = model.electrons.length === 1 ? JohnTravoltageA11yStrings.electronsDescriptionSingleString : JohnTravoltageA11yStrings.electronsDescriptionMultipleString;
      var chargeMessage = hadElectrons ? StringUtils.format( chargeDescriptor, model.electrons.length ) : '';

      self.accessibleDescription = StringUtils.format( JohnTravoltageA11yStrings.sceneDescriptionString, self.arm.positionDescription, chargeMessage );
    };

    // electrons observable array exists for the lifetime of the sim, so there is no need to remove these
    // listeners
    model.electrons.addItemAddedListener( function() {
      updateDescription();
      hadElectrons = true;
    } );

    model.electrons.addItemRemovedListener( function() {
      if ( model.electrons.length === 0 ) {
        updateDescription();
      }
    } );

    // properties exist for life of sim, no need to unlink
    this.arm.model.angleProperty.link( updateDescription );
    this.leg.model.angleProperty.link( updateDescription );

    // the form is described by the description through aria-describedby
    accessibleFormNode.setAriaDescribedByElement( this.descriptionElement );

    // debug lines, body and forceline
    // borders are approximately 8px = radius of particle from physical body,
    // because physical radius of electron = 1 in box2D
    if ( JohnTravoltageQueryParameters.showDebugInfo ) {
      this.showBody();

      accessibleFormNode.addChild( new Circle( 10, {
        x: model.bodyVertices[ 0 ].x,
        y: model.bodyVertices[ 0 ].y,
        fill: 'blue'
      } ) );
      accessibleFormNode.addChild( new Circle( 10, { x: 0, y: 0, fill: 'blue' } ) );

      //Debugging for finger location
      var fingerCircle = new Circle( 10, { fill: 'red' } );
      model.arm.angleProperty.link( function() {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      accessibleFormNode.addChild( fingerCircle );

      DebugUtils.debugLineSegments( this );
    }

    this.sounds = [
      new Sound( shockOuchAudio ),
      new Sound( shockAudio )
    ];

    model.sparkVisibleProperty.link( function( sparkVisible ) {
      if ( sparkVisible && model.soundProperty.get() ) {
        self.sounds[ Math.floor( phet.joist.random.nextDouble() * 2 ) ].play();
      }
    } );
  }

  johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

  return inherit( ScreenView, JohnTravoltageView, {

    /**
     * Step function for the view.
     * @param  {number} dt - seconds
     * @public
     */
    step: function( dt ) {

      // step the sonification
      this.audioView && this.audioView.step( dt );
    },

    /**
     * Only used for debugging.  Show debug information for the body and charges, and visual information
     * regarding how the model calculates charge positions.
     * @private
     */
    showBody: function() {
      //vertices and body path
      var customShape = new Shape();
      var lineSegment = null;
      for ( var i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        customShape.moveTo( lineSegment.x1, lineSegment.y1 );
        customShape.lineTo( lineSegment.x2, lineSegment.y2 );
      }

      //Show normals
      for ( i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        var center = lineSegment.center;
        var normal = lineSegment.normal.times( 50 );
        this.addChild( new Line( center.x, center.y, center.x + normal.x, center.y + normal.y, {
          lineWidth: 2,
          stroke: 'blue'
        } ) );
      }

      var path = new Path( customShape, {
        stroke: 'green',
        lineWidth: 1,
        pickable: false
      } );
      this.addChild( path );

      // forcelines, which attract particles
      var lines = this.model.forceLines;
      for ( i = 0; i < lines.length; i++ ) {
        customShape = new Shape();
        customShape.moveTo( lines[ i ].x1, lines[ i ].y1 );
        customShape.lineTo( lines[ i ].x2, lines[ i ].y2 );
        path = new Path( customShape, {
          stroke: 'red',
          lineWidth: 1,
          pickable: false,
          x: 0,
          y: 0
        } );
        this.addChild( path );
      }
    }
  } );
} );

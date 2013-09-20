// Copyright 2002-2013, University of Colorado Boulder

/**
 * Simple line segment model.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Vector2 = require( 'DOT/Vector2' );

  function LineSegment( x1, y1, x2, y2 ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  LineSegment.prototype = {
    getNormalVector: function() {

      //TODO: reduce allocations
      return new Vector2( this.x2 - this.x1, this.y2 - this.y1 ).perpendicular().normalized();
    }
  };

  return LineSegment;
} );
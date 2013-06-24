// Copyright 2002-2013, University of Colorado

/**
 * Model of a John-Travoltage.
 * Spark model between arm and door.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );

  var SparkModel = Fort.Model.extend(
    {
      defaults: {
        //created path of spark
        verticles: [],
        //number of points in spark path
        maxPoints: 100,
        //two main point (finger and door)
        source: new Vector2( 525, 198 ),
        sink: new Vector2( 545, 258 ),
        //maxAngle between next to points of spark's path
        maxDTheta :  Math.PI / 3.8,
        //max distance between point of spark;s path and sink
        threshold : 4,
        //length of 1 part of spark's path
        segLength : 6
      },
      init: function( armModel ) {
        this.update();
      },
      //redraw path
      update: function() {
        var prevPoint = this.source;
        var newVerticles = [];
        newVerticles.push(prevPoint);
        for ( var i = 0; i < this.maxPoints; i++ ) {
          var nextPoint = this.nextPoint( prevPoint );
          newVerticles.push( nextPoint );
          prevPoint = nextPoint;
        }

        this.verticles = newVerticles;

      },
      nextPoint: function( prevPoint ) {
        var diff = prevPoint.minus( this.sink);
        var theta = diff.angle();
        var dTheta = (Math.random()-0.5) *2 * this.maxDTheta;
        var thetaNew = theta + dTheta;
        return new Vector2( prevPoint.x - this.segLength * Math.cos( thetaNew ), prevPoint.y - this.segLength * Math.sin( thetaNew ) );
        //angle up or down.
      }
    } );

  return SparkModel;
} );

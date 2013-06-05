/**
 * @file grid.js Librería para pintar la rejilla de referencia
 * @author José Luis Molina Soria
 * @version 20130512
 */

/**
 * @class MM.Grid
 * @classdesc Render de grid. Pinta una rejilla
 * @constructor MM.Grid
 * @param {layer}  capa   capa donde pintar el grid
 * @param {int}    width  ancho de la rejilla
 * @param {int}    heigth alto de la rejilla
 */
MM.Grid = MM.Class.extend(/** @lends MM.Grid.prototype */{
    init: function (capa, width, height ) {
	this.capa = capa;
	this.width = width;
	this.height = height;
	this.render();
    }, 
 
    /**
     * @desc Función de pintado de la rejilla
     */
    render: function () {
	var minWidth = -2*this.width;
	var maxWidth = 2*this.width;
	var minHeight = -2*this.height;
	var maxHeight = 2*this.height;
	for ( var x = minWidth; x <= 2*this.width; x += 100 ) {
	     this.capa.add( new Kinetic.Line({
		points: [x, minHeight, x, maxHeight],
		stroke: 'grey',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round',
		dashArray: [0.8, 5]
	    }));
	} 
	for ( var y = -2*this.height; y <= 2*this.height; y += 100 ) {
	     this.capa.add( new Kinetic.Line({
		points: [minWidth, y, maxWidth, y],
		stroke: 'grey',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round',
		dashArray: [0.8, 5]
	    }));
	} 
	x = y = minWidth = maxWidth = minHeight = maxHeight = null;
    }
});


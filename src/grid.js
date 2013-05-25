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
	for ( var x = 100; x <= this.width; x += 100 ) {
	     this.capa.add( new Kinetic.Line({
		points: [x, 0, x, this.height],
		stroke: 'grey',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round',
		dashArray: [0.8, 5]
	    }));
	} 
	for ( var y = 100; y <= this.width; y += 100 ) {
	     this.capa.add( new Kinetic.Line({
		points: [0, y, this.width, y],
		stroke: 'grey',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round',
		dashArray: [0.8, 5]
	    }));
	} 
	x = y = null;
    }
});


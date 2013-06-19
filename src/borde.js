/**
 * @file borde.js Librería para pintar el borde del canvas
 * @author José Luis Molina Soria
 * @version 20130512
 */

/**
 * @class MM.Borde
 * @classdesc Render de borde. Pinta un border al canvas
 * @constructor MM.Borde
 * @param {layer}  capa   capa donde pintar el border
 * @param {int}    width  ancho del borde
 * @param {int}    heigth alto del borde
 */
MM.Borde = MM.Class.extend(/** @lends MM.Borde.prototype */{
    init: function (capa, width, height ) {
        this.capa = capa;
        this.width = width;
        this.height = height;
        this.render();
    }, 
 
    /**
     * @desc Función de pintado el border
     */
    render: function () {
        this.capa.add( new Kinetic.Line({
            points: [0, 0, this.width, 0],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: [4, 3]
        }));
        this.capa.add( new Kinetic.Line({
            points: [0, 0, 0, this.height],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: [4, 3]
        }));
        this.capa.add( new Kinetic.Line({
            points: [0, this.height, this.width, this.height],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: [4, 3]
        }));
        this.capa.add( new Kinetic.Line({
            points: [this.width, 0, this.width, this.height],
            stroke: 'grey',
            strokeWidth: 1,
            lineCap: 'round',
            lineJoin: 'round',
            dashArray: [4, 3]
        }));
    }
});


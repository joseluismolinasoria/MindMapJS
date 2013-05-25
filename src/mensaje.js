/**
 * @file mensaje.js Librería para imprimir mensajes de texto. Es la base para
 *                  el resto de nodos existentes en el MM.
 * @author José Luis Molina Soria
 * @version 20130513
 */

/**
 * @class MM.Mensaje
 * @classdesc Render de mensajes de texto.
 * @constructor MM.Mensaje
 * @param {stage}  escenario    Escenario donde pintar el mensaje
 * @param {layer}  capa         Capa donde pintar el grid
 * @param {Object} propiedades  Conjunto de propiedades a establecer al 
 *                              mensaje. Como Color fuente, posición, etc.
 *                              Ver refencia Kinetic.Text.
 */
MM.Mensaje = MM.Class.extend(/** @lends MM.Mensaje.prototype */{

    /**
     * @desc Valores por defecto para el texto
     * @memberof MM.Mensaje
     */
    defecto: {
	x: 5,
	y: 5,
	text: '',
	fontSize: 14,
	fontFamily: 'helvetica',
	fill: '#555',
	width: 'auto',
	align: 'center'
    },

    init: function(escenario, capa, propiedades) {
	this.escenario = escenario;
	this.capa = capa;
	var prop = MM.Properties.add(this.defecto, propiedades);
	this.kText = new Kinetic.Text(prop);
	capa.add ( this.kText );
    },

    /**
     * @desc Cambia el texto del mensaje
     * @param {String} texto Nuevo texto
     */
    setText: function (texto) {
	this.kText.setText(texto);
	this.capa.draw();
    },

    /**
     * @desc Texto del mensaje
     * @return {String} texto actual del mensaje
     */
    getText: function () {
	return this.kText.getText();
    },

    /**
     * @desc Mueve el esto a la posición x de la capa o contenedor
     * @param {number} x Posición en el eje x del texto
     */
    setX: function (x) { 
	this.kText.setX(x);
	this.capa.draw();
    },

    /**
     * @desc Obtiene la posición X absoluta del texto
     * @return {number} posición X del mensaje.
     */
    getX: function () {
	return this.kText.getAbsolutePosition().x;
    },

    /**
     * @desc Mueve el esto a la posición x de la capa o contenedor
     * @param {number} x Posición en el eje x del texto
     */
    setY: function (y) { 
	this.kText.setY(y);
	this.capa.draw();
    },

    /**
     * @desc Obtiene la posición Y absoluta del texto
     * @return {number} posición Y del mensaje.
     */
    getY: function () {
	return this.kText.getAbsolutePosition().y;
    },

    /**
     * @desc Obtiene el ancho del texto.
     * @return {number} Ancho del texto.
     */
    getWidth: function () {
	return this.kText.getWidth();
    },

    /**
     * @desc Obtiene el alto del texto.
     * @return {number} Alto del texto.
     */
    getHeight: function () {
	return this.kText.getHeight();
    }

});


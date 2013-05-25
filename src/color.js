/**
 * @file color.js Funciones y utiles para manejo de colores.
 * @author José Luis Molina Soria
 * @version 20130523
 */

/** 
 * @desc Función semialeatoria de colores en formato HSL. Esta función ha
 *       sido ajustada para evitar colores molestos o demasiado claros/oscuros.
 * @method randomHslColor 
 * @return {Object} Objecto con los campos h, s y l 
 * @memberof MM
 * @static
 */
MM.randomHslColor = function () {
    var rand = function (max, min) {
	return parseInt(Math.random() * (max-min+1), 10) + min;
    };

    var h = rand(1, 360);  // Tonalidad 1-360
    var s = rand(30, 100); // saturación 30-100%
    var l = rand(20, 50);  // brillo 20-50%
    return { h: h, s: s, l:l };
};


/** 
 * @desc Calcula la cadena hsl en formato CSS
 * @method hslToCSS
 * @param {Object} hsl          Objecto con los campos h, s y l 
 * @param {number} offsetBrillo Desplazamiento al brillo. 
 * @return {string} Cadena CSS del color en formato HSL
 * @memberof MM
 * @static
 */
MM.hslToCSS = function ( hsl, offsetBrillo ) {
    offsetBrillo = offsetBrillo || 0;
    return 'hsl(' + hsl.h + ',' + hsl.s + '%,' + (hsl.l + offsetBrillo) + '%)';
};

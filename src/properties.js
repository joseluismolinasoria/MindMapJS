/**
 * @file properties.js para manejos de propiedades
 * @author José Luis Molina Soria
 * @version 20130224
 */

/**
 * Funciones de utilidad para el manejo de propiedades
 * @namespace MM.Properties
 */
MM.Properties =  {};

/**
 * @desc Toma dos conjuntos de propiedades y crea una nueva con los valores de la primera y la segunda
 * @param {object} propA conjunto de propiedades inicial
 * @param {object} propB conjunto de propiedades a agregar
 * @return {object} Unión de todas las propiedades
 */
MM.Properties.add = function (propA, propB) {
    var nProp = {};
    for (var name in propA) {
	nProp[name] = propA[name];
    }
    for (var name in propB) {
	nProp[name] = propB[name];
    }
    return nProp;
};



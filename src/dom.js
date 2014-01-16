/**
 * @file element.js Funcionalidad para manejo del DOM
 * @author José Luis Molina Soria
 * @version 20130224
 */

/**
 * Funciones de utilidad para el manejo del árbol DOM
 * @namespace MM.DOM
 */
MM.DOM = {};

/**
 * @desc función para la creación de elementos DOM de forma comoda. 
 * @param {string} tagName Etíqueta del elemento DOM que deseemos crear
 * @param {object} prop Propiedades con los atributos que deseamos en el elemento DOM
 */
MM.DOM.create = function(tagName, prop) {
    var e = window.document.createElement(tagName);
    
    // recorremos el objeto que nos han pasado como parámetro...
    for (var name in prop) {
        if ( name === 'innerHTML' ) {
            e[name] = prop[name];
	} else {
            e.setAttribute(name, prop[name]);
	}
    }

    e.remove = function () {
        this.parentNode.removeChild(this);
    };

    return e; 
};


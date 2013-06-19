/**
 * @file klass.js Implementación de Classes
 * @author José Luis Molina Soria
 * @version 20130224
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
}

/**
 * @class MM.Class
 * @classdesc Clase base.
 * @constructor MM.Class 
 */

MM.Class = function (){ 
    this.init = function () {};
};


/**
 * @desc Función que nos permite extender sobre una clase existente
 * @param {object} prop Clase que deseamos extender.
 * @return {Class} una nueva clase. Clase hija hereda los métodos y propiedades de la clase padre.
 */    
MM.Class.extend = function(prop) {
    var _super = this.prototype || MM.Class.prototype; // prototype de la clase padre

    function F() {}
    F.prototype = _super;
    var proto = new F();
    var wrapperMetodo = function(name, fn) { // asociamos las funciones al nuevo contexto 
        return function() {
            var tmp = this._super;               // guardamos _super
            this._super = _super[name];          // función super => podemos hacer this._super(argumentos)
            var ret = fn.apply(this, arguments); // ejecutamos el método en el contexto de la nueva instancia
            this._super = tmp;                   // restauramos el _super
            return ret;
        };
    };
    
    // recorremos el objeto que nos han pasado como parámetro...
    for (var name in prop) {
        // Si estamos sobreescribiendo un método de la clase padre.
        if (typeof prop[name] === "function" && typeof _super[name] === "function") {
            proto[name] = wrapperMetodo(name, prop[name]);
        } else { // no sobreescribimos métodos ni p
            proto[name] = prop[name];
        }
    }
    
    function Klass() {
        if (this.init) {
            this.init.apply(this, arguments);
	}
    }
    
    Klass.prototype = proto;
    Klass.prototype.constructor = Klass;
    Klass.extend = this.extend;

    return Klass; 
};

/**
 * @desc Permite especificar un contexto concreto a una función dada
 * @param {object} ctx Contexto en que desea asociar a la función
 * @param {function} fn Función a la que le vamos a realizar el bind
 * @return {function} nueva función asociada al contexto dado.
 */    
MM.Class.bind = function (ctx, fn) {
    return function() {
        return fn.apply(ctx, arguments); 
    };
};

if ( typeof module !== 'undefined' ) {
    module.exports = MM.Class;
}

/**
 * @file arbol-n.js Implementación de un árbol eneario 
 * @author José Luis Molina Soria
 * @version 20130224
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./pubsub.js');
}

/**
 * @class MM.Arbol
 * @classdesc Implementación de árbol eneario. El constructor de la clase árból recibe un elemento y un array de árboles hijo.
 * @constructor MM.Arbol 
 * @param {*}     elemento  elemento del árbol
 * @param {Array} [hijos]   array de árboles hijo 
 */
MM.Arbol = MM.PubSub.extend( /** @lends MM.Arbol.prototype */ {
    init: function(elemento, hijos) {
	this.elemento = elemento;
	this.hijos = hijos || [];
    }
});

 
/**
 * @desc Recorrido preorden del arbol-n. preorden( a ) = e, preorden( a1 ), ..., preorden( an )    
 * @return {array} array de elementos resultados del recorrido preorden
 */
MM.Arbol.prototype.preOrden = function () {
    this.on('preOrden', this);
    var a = [this.elemento];
    this.hijos.forEach(function (hijo) {
        a = a.concat(hijo.preOrden());
    });

    this.on('postPreOrden', this);
    return a;
};

/**
 * @desc Recorrido inOrden del arbol-n. inorden( a ) = inorden( a1 ), e, inorden( a2 ), ..., inorden( an )
 * @return {array} array de elementos resultados del recorrido inorden
 */
MM.Arbol.prototype.inOrden = function () {
    if (this.ordenNodo() == 0)
        return [this.elemento];
    var a = [];
    this.hijos.forEach(function (hijo, idx) {
        a = a.concat(hijo.inOrden());
        if (idx == 0) {
            a = a.concat(this.elemento);
	    this.on('inOrden', this);
	}
    }, this);
    this.on('postInOrden', this);
    return a;
};

/**
 * @desc Recorrido postOrden del arbol-n. postorden( a ) = postorden( a1 ), ...., postorden( an ), e
 * @return {array} array de elementos resultados del recorrido en postOrden
 */
MM.Arbol.prototype.postOrden = function () {
    var a = [];
    this.hijos.forEach(function (hijo) {
        a = a.concat(hijo.postOrden());
    });
    this.on('postOrden', this);
    return a.concat(this.elemento);
};

/**
 * @desc calcula el orden del nodo actual
 * @return {number} 
 */
MM.Arbol.prototype.ordenNodo = function () {
    return this.hijos.length;
};

/**
 * @desc calcula el orden del árbol
 * @return {number} 
 */
MM.Arbol.prototype.orden = function () {
    var a = this.hijos.map(function (hijo) {
        return hijo.orden();
    });
    a.push(this.ordenNodo());
    return Math.max.apply(null, a);
};

/**
 * @desc calcula el peso del árbol
 * @return {number} 
 */
MM.Arbol.prototype.peso = function () {
    var p = 1;
    this.hijos.forEach(function (hijo) {
        p = p + hijo.peso();
    });
    return p;
};

/**
 * @desc calcula la altura del árbol
 * @return {number} 
 */
MM.Arbol.prototype.altura = function () {
    var max = 0;
    this.hijos.forEach(function (hijo) {
        max = Math.max(max, hijo.altura());
    });
    return max+1;
};

/**
 * @desc predicado para comprobar si el elemento actual es hoja o no
 * @return {boolean} true si el elemento es hoja y false en otro caso.
 */
MM.Arbol.prototype.esHoja = function () {
    return this.hijos.length === 0;
};

/**
 * @desc Comparador de elementos
 * @return {boolean} true si los elementos son iguales
 */
MM.Arbol.prototype.elementEqual = function (elemento){
    return elemento === this.elemento;
}

/**
 * @desc realiza una búsqueda en el árbol para encontrar un elemento dado. 
 * Para comparar los elementos hace uso de la función elementEqual
 * @return {MM.Arbol} devuelve el árbol cuyo elemento coincide o null en caso de no encontrarlo
 */
MM.Arbol.prototype.buscar = function (elemento) {
    if ( this.elementEqual (elemento) )
        return this;

    var arbol = null;
    this.hijos.forEach(function (hijo) {
        var encontrado = hijo.buscar(elemento);
        if ( encontrado != null )
            arbol = encontrado;
        encontrado = null;
    });
    return arbol;
};

/**
 * @desc calcula la profundidad de un elemento dado. Para las comparaciones hace uso de la 
 * función elementEqual. El elemento raíz tiene profundidad 0.
 * @return {number} 
 */
MM.Arbol.prototype.profundidad = function (elemento) {
    if ( this.elementEqual(elemento) )
	return 0;

    var profundidad = -1;
    this.hijos.forEach(function (hijo) {
	var p = hijo.profundidad(elemento);
        if  ( p != -1 ) 
	    profundidad = p + 1; 
    });
    return profundidad;
};

/**
 * @desc calcula el padre de un elemento dado.
 * @return {MM.Arbol} árbol padre o null en caso de no tener
 */
MM.Arbol.prototype.padreDe = function (elemento) {
    if ( this.elementEqual(elemento) ) 
	return null;
    
    var padre = false;
    this.hijos.forEach(function (hijo) {
	if ( hijo.elementEqual(elemento) )
	    padre = this;
    }, this);

    if ( padre )
	return this;
    
    padre = null;
    this.hijos.forEach(function (hijo) {
	if ( padre === null )
	    padre = hijo.padreDe (elemento);
    });
    
    return padre;
};

MM.Arbol.prototype.borrar = function (elemento) {
    var padre = this.padreDe(elemento);
    var hijoBorrado = null;
    if ( padre != null ) {
	for (var i = 0 ; i <= padre.hijos.length; i++ ) {
	    if ( padre.hijos[i].elementEqual(elemento) ) { 
		hijoBorrado = padre.hijos[i];
		padre.hijos.splice(i, 1);
		break;
	    }
	}
    }
    padre = null;
    return hijoBorrado;
};


// Azúcar sintáctico
var ArbolN = (function (elemento) { 
    hijos = Array.prototype.slice.call(arguments, 1);
    return new MM.Arbol (elemento, hijos);
});

if ( typeof module !== 'undefined' ) {
    module.exports.ArbolN = ArbolN;
    module.exports.Arbol = MM.Arbol;
}

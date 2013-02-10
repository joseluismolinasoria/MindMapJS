if ( typeof module !== 'undefined' ) {
    var Class = require('./klass.js');
}

var Arbol = Class.extend({
    init: function(elemento, hijos) {
	this.elemento = elemento;
	this.hijos = hijos || [];
    }
});

// preorden( a ) = e, preorden( a1 ), ..., preorden( an )    
Arbol.prototype.preOrden = function () {
    if ( this.preProceso )
        this.preProceso();
    var a = [this.elemento];
    this.hijos.forEach(function (hijo) {
        a = a.concat(hijo.preOrden());
    });

    if ( this.postProceso )
	this.postProceso();
    return a;
};

// inorden( a ) = inorden( a1 ), e, inorden( a2 ), ..., inorden( an )
Arbol.prototype.inOrden = function () {
    if (this.ordenNodo() == 0)
        return [this.elemento];
    var a = [];
    this.hijos.forEach(function (hijo, idx) {
        a = a.concat(hijo.inOrden());
        if (idx == 0)
            a = a.concat(this.elemento);
    }, this);
    return a;
};

// postorden( a ) = postorden( a1 ), ...., postorden( an ), e
Arbol.prototype.postOrden = function () {
    var a = [];
    this.hijos.forEach(function (hijo) {
        a = a.concat(hijo.postOrden());
    });
    return a.concat(this.elemento);
};

Arbol.prototype.ordenNodo = function () {
    return this.hijos.length;
};

Arbol.prototype.orden = function () {
    var a = this.hijos.map(function (hijo) {
        return hijo.orden();
    });
    a.push(this.ordenNodo());
    return Math.max.apply(null, a);
};

Arbol.prototype.peso = function () {
    var p = 1;
    this.hijos.forEach(function (hijo) {
        p = p + hijo.peso();
    });
    return p;
};

Arbol.prototype.altura = function () {
    var max = 0;
    this.hijos.forEach(function (hijo) {
        max = Math.max(max, hijo.altura());
    });
    return max+1;
};

Arbol.prototype.esHoja = function () {
    return this.hijos.length === 0;
};

Arbol.prototype.elementEqual = function (elemento){
    return elemento === this.elemento;
}

Arbol.prototype.buscar = function (elemento) {
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

Arbol.prototype.profundidad = function (elemento) {
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

Arbol.prototype.padreDe = function (elemento) {
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


// Azúcar sintáctico
var ArbolN = (function (elemento) { 
    hijos = Array.prototype.slice.call(arguments, 1);
    return new Arbol (elemento, hijos);
});

if ( typeof module !== 'undefined' ) {
    module.exports.ArbolN = ArbolN;
    module.exports.Arbol = Arbol;
}

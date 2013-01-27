var ArbolN = (function (elemento) {
    var arbol = {};

    arbol.elemento = elemento;
    arbol.hijos = Array.prototype.slice.call(arguments, 1);

    // preorden( a ) = e, preorden( a1 ), ..., preorden( an )    
    arbol.preOrden = function () {
        var a = [this.elemento];
        this.hijos.forEach(function (hijo) {
            a = a.concat(hijo.preOrden());
        });
        return a;
    };

    // inorden( a ) = inorden( a1 ), e, inorden( a2 ), ..., inorden( an )
    arbol.inOrden = function () {
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
    arbol.postOrden = function () {
        var a = [];
        this.hijos.forEach(function (hijo) {
            a = a.concat(hijo.postOrden());
        });
        return a.concat(this.elemento);
    };

    arbol.ordenNodo = function () {
        return this.hijos.length;
    };

    arbol.orden = function () {
        var a = this.hijos.map(function (hijo) {
            return hijo.orden();
        });
        a.push(this.ordenNodo());
        return Math.max.apply(null, a);
    };

    arbol.peso = function () {
        var p = 1;
        this.hijos.forEach(function (hijo) {
            p = p + hijo.peso();
        });
        return p;
    };

    arbol.altura = function () {
        var max = 0;
        this.hijos.forEach(function (hijo) {
            max = Math.max(max, hijo.altura());
        });
        return max+1;
    };

    arbol.esHoja = function () {
        return this.hijos.length === 0;
    };

    return arbol; 
});

module.exports = exports = ArbolN;


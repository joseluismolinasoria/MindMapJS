// Un árbol n-ario es una estructura recursiva, en la cual cada elemento tiene un número cualquiera de árboles n-arios asociados
// 
// RECORRIDOS:
// inorden( a ) = inorden( a1 ), e, inorden( a2 ), ..., inorden( an )
// preorden( a ) = e, preorden( a1 ), ..., preorden( an )
// postorden( a ) = postorden( a1 ), ...., postorden( an ), e
// 
// EJEMPLO DE ARBOL:
//                         a
//                       / | \
//                      b  c  \ 
//                        /|    d
//                       e f  / | \
//                           g  h  i
//                          /
//                       [j,k,l,m]
// el orden del árbol es 4
// el orden del elemento a es 3
// preorden = a, b, c, e, f, d, g, j, k, l, m, h, i
// inorden = b, a, e, c, f, j, g, k, l, m, d, h, i
// postorden = b, e, f, c, j, k, l, m, g, h, i, d, a
// niveles = a, b, c, d, e, f, g, h, i, j, k, l, m
// altura = 4
// peso = 13
// los hijos de g son los elementos j, k, l, m
// el ancestro común más próximo de k y h es d
// 
// URL: http://cupi2.uniandes.edu.co/libros/estructuras_de_datos/index.php?option=com_content&view=article&id=148&Itemid=131

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
        return max + 1;
    };

    arbol.esHoja = function () {
        return this.hijos.length === 0;
    };

    return arbol; 
});

module.exports = exports = ArbolN;

var a = ArbolN("a",
	       B=ArbolN("b"),
	       C=ArbolN("c",
			ArbolN("e"),
			ArbolN("f")),
	       D=ArbolN("d",
			G=ArbolN("g",
				 ArbolN("j", ArbolN("J1")),
				 ArbolN("k"),
				 ArbolN("l"),
				 ArbolN("m")),
			ArbolN("h"),
			ArbolN("i")));
	      

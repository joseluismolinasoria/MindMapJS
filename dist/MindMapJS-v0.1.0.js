/**
 * @file MindMapJS.js Definición del espacio de nombres de la aplicación MM
 * @author José Luis Molina Soria
 * @version 0.1.0
 * @date    2013-07-12
 */

/**
 * Espacio de nombres de la aplicación MindMapJS. Reducido a MM por comodidad
 * @namespace MM
 * @property {MM.Class}        Class      - Sistema de clases para MM
 * @property {MM.Arbol}        Arbol      - Constructor de Árboles enarios.
 * @property {MM.Properties}   Properties - Extensión para manejo de propiedades
 * @property {MM.DOM}          DOM        - Funciones para manejo del DOM
 * @property {MM.PubSub}       PubSub     - Patrón Publish/Subscribe
 * @property {MM.teclado}      teclado    - Gestión y manejo de eventos de teclado
 */
var MM = {}; 

if ( typeof module !== 'undefined' ) {
    module.exports = MM;
}


;/**
 * @file arbol-n.js Implementación de un árbol eneario 
 * @author José Luis Molina Soria
 * @version 20130316
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.PubSub = require('./pubsub.js');
}

/**
 * @class MM.Arbol
 * @classdesc Implementación de árbol eneario. El constructor de la clase árbol recibe un elemento y 
 * un array de árboles hijo.
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


MM.Arbol.prototype.generalPreOrden = function ( generador, operacion ) {
    this.on('preOrden', this);
    var generado = generador(this.elemento);
    this.hijos.forEach(function (hijo) {
        operacion ( generado, hijo.generalPreOrden(generador, operacion) );
    });

    this.on('postPreOrden', this);
    return generado;
};


/**
 * @desc Recorrido inOrden del arbol-n. inorden( a ) = inorden( a1 ), e, inorden( a2 ), ..., inorden( an )
 * @return {array} array de elementos resultados del recorrido inorden
 */
MM.Arbol.prototype.inOrden = function () {
    if (this.ordenNodo() === 0) {
        return [this.elemento];
    }
    var a = [];
    this.hijos.forEach(function (hijo, idx) {
        a = a.concat(hijo.inOrden());
        if (idx === 0) {
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
};

/**
 * @desc realiza una búsqueda en el árbol para encontrar un elemento dado. 
 * Para comparar los elementos hace uso de la función elementEqual
 * @param {object} elemento a buscar
 * @return {MM.Arbol} devuelve el árbol cuyo elemento coincide o null en caso de no encontrarlo
 */
MM.Arbol.prototype.buscar = function (elemento) {
    if ( this.elementEqual (elemento) ) {
        return this;
    }

    var arbol = null;
    this.hijos.forEach(function (hijo) {
        var encontrado = hijo.buscar(elemento);
        if ( encontrado !== null ) {
            arbol = encontrado;
	}
        encontrado = null;
    });
    return arbol;
};

/**
 * @desc calcula la profundidad de un elemento dado. Para las comparaciones hace uso de la 
 * función elementEqual. El elemento raíz tiene profundidad 0.
 * @param {object} elemento del que deseamos la profundidad
 * @return {number} 
 */
MM.Arbol.prototype.profundidad = function (elemento) {
    if ( this.elementEqual(elemento) ) {
        return 0;
    }

    var profundidad = -1;
    this.hijos.forEach(function (hijo) {
        var p = hijo.profundidad(elemento);
        if  ( p !== -1 ) {
            profundidad = p + 1; 
	}
    });
    return profundidad;
};

/**
 * @desc calcula el padre de un elemento dado.
 * @param {object} elemento del que deseamos conocer el padre
 * @return {MM.Arbol} árbol padre o null en caso de no tener
 */
MM.Arbol.prototype.padreDe = function (elemento) {
    if ( this.elementEqual(elemento) ) {
        return null;
    }
    
    var padre = false;
    this.hijos.forEach(function (hijo) {
        if ( hijo.elementEqual(elemento) ) {
            padre = this;
	}
    }, this);

    if ( padre ) {
        return this;
    }
    
    padre = null;
    this.hijos.forEach(function (hijo) {
        if ( padre === null ) {
            padre = hijo.padreDe (elemento);
	}
    });
    
    return padre;
};

/**
 * @desc Borrar un elemento y los elementos que cuelgan de él.
 * @param {object} elemento a borrar
 * @return {MM.Arbol} el subárbol donde el nodo raíz es el elemento borrado
 */
MM.Arbol.prototype.borrar = function (elemento) {
    var padre = this.padreDe(elemento);
    var hijoBorrado = null;
    if ( padre !== null ) {
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
var ArbolN = function (elemento) { 
    var hijos = Array.prototype.slice.call(arguments, 1);
    return new MM.Arbol (elemento, hijos);
};

if ( typeof module !== 'undefined' ) {
    module.exports.ArbolN = ArbolN;
    module.exports.Arbol = MM.Arbol;
}
;/**
 * @file arista.js Implementación de arsitas 
 * @author José Luis Molina Soria
 * @version 20130512
 */

/**
 * @class MM.Arista
 * @classdesc Render de arista. Capaz de dibujar una arista entre dos nodos
 * @constructor MM.Arista
 * @param {layer}  capa            capa donde pintar la arista
 * @param {Object} elementoOrigen  elemento del MM desde donde debe partir la arista
 * @param {Object} elementoDestino elemento del MM hasta donde debe llegar la arista
 * @param {int}    tamano          grosor de la arista
 */
MM.Arista = MM.Class.extend(/** @lends MM.Arista.prototype */{
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
        this.capa = capa;
        this.elementoOrigen = elementoOrigen;
        this.elementoDestino = elementoDestino;
        this.context = capa.getCanvas().getContext();
        this.tamano = tamano;
        this.render();
    },

    /**
     * @desc Calcula los puntos necesarios para pintar la arista
     */
    calcularPuntos: function () {
        var nodoOrigen = this.elementoOrigen.nodo;
        var nodoDestino = this.elementoDestino.nodo;
        this.x1 = (nodoOrigen.getX() + MM.render.offset.x + nodoOrigen.getWidth() / 2) 
            * MM.render.getEscala();
        this.y1 = (nodoOrigen.getY() + MM.render.offset.y + nodoOrigen.getHeight() / 2) 
            * MM.render.getEscala();
        this.x2 = (nodoDestino.getX() + MM.render.offset.x + nodoDestino.getWidth() / 2) 
            * MM.render.getEscala();
        this.y2 = (nodoDestino.getY() + MM.render.offset.y + nodoDestino.getHeight() / 2) 
            * MM.render.getEscala();
        this.c1x = this.x1 + (this.x2-this.x1)/2;
        this.c1y = this.y1;
        this.c2x = this.x1 + (this.x2-this.x1)/2;
        this.c2y = this.y2;
        nodoOrigen = nodoDestino = null;
    },

    /**
     * @desc Función de pintado de la arista en función de los elementos pasados
     */   
    render: function () {
        var c = this.context;
        this.calcularPuntos();

        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
        c.strokeStyle = '#555';
        c.lineWidth = this.tamano * MM.render.getEscala();
        c.stroke();
        c = null;
    }
});


/**
 * @class MM.Rama
 * @classdesc Render de rama. Capaz de dibujar una arista de tipo rama entre dos nodos
 * @constructor MM.Rama
 * @param {layer}  capa            capa donde pintar la arista
 * @param {Object} elementoOrigen  elemento del MM desde donde debe partir la arista
 * @param {Object} elementoDestino elemento del MM hasta donde debe llegar la arista
 * @param {int}    tamano          grosor de la arista
 */
MM.Rama = MM.Arista.extend(/** @lends MM.Rama.prototype */{
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
        this._super(capa, elementoOrigen, elementoDestino, tamano);
    },


    /**
     * @desc Cálculo de los puntos para poder pintar la Rama
     */   
    calcularPuntos: function () {
        var nodoOrigen = this.elementoOrigen.nodo;
        var nodoDestino = this.elementoDestino.nodo;
        this.x1 = (nodoOrigen.getX() + MM.render.offset.x + nodoOrigen.getWidth()) 
            * MM.render.getEscala();
        this.y1 = (nodoOrigen.getY() + MM.render.offset.y + nodoOrigen.getHeight()) 
            * MM.render.getEscala();
        this.x2 = nodoDestino.getX() + MM.render.offset.x 
            * MM.render.getEscala();
        this.y2 = (nodoDestino.getY() + MM.render.offset.y + nodoDestino.getHeight()) 
            * MM.render.getEscala();
        this.x3 = (nodoDestino.getX() + MM.render.offset.x + nodoDestino.getWidth()) 
            * MM.render.getEscala();
        this.y3 = (nodoDestino.getY() + MM.render.offset.x + nodoDestino.getHeight()) 
            * MM.render.getEscala();
        this.c1x = this.x1 + (this.x2-this.x1)/2;
        this.c1y = this.y1;
        this.c2x = this.x1 + (this.x2-this.x1)/2;
        this.c2y = this.y2;
        nodoOrigen = nodoDestino = null;
    },
    
    /**
     * @desc Función de pintado de la rama
     */   
    render: function () {
        var c = this.context;
        this.calcularPuntos();

        c.beginPath();
        c.moveTo(this.x1, this.y1);
        c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
        c.strokeStyle = this.elementoOrigen.nodo.color; 
        c.lineWidth = this.tamano * MM.render.getEscala();
        c.lineTo(this.x3, this.y3);
        c.stroke();
        c.beginPath();
        c.moveTo(this.x2, this.y2);
        c.strokeStyle = this.elementoDestino.nodo.color; 
        c.lineWidth = this.tamano * MM.render.getEscala();
        c.lineTo(this.x3, this.y3);
        c.stroke();
        c = null;
    }
});

;/**
 * @file atajos.js Contiene la configuración de atajos de teclado del MM.
 * @author José Luis Molina Soria
 * @version 20130520
 */

/**
 * @desc Define los atajos de teclado para el render
 * @memberof MM
 * @method definirAtajos
 * @inner
 */
MM.definirAtajos = function() {
    // teclado númerico
    MM.teclado.atajos.add('Ctrl+k', MM.render.zoomIn, MM);    
    MM.teclado.atajos.add('Ctrl+m', MM.render.zoomOut, MM);
    MM.teclado.atajos.add('Ctrl+0', MM.render.zoomReset, MM);
    // teclado alfanúmerico
    MM.teclado.atajos.add('Ctrl+»', MM.render.zoomIn, MM);    
    MM.teclado.atajos.add('Ctrl+½', MM.render.zoomOut, MM);

    // teclas de navegación
    MM.teclado.atajos.add('home', MM.root, MM);
    MM.teclado.atajos.add('left', MM.padre, MM);
    MM.teclado.atajos.add('right', MM.next, MM);
    MM.teclado.atajos.add('up', MM.prevHermano, MM);
    MM.teclado.atajos.add('down', MM.nextHermano, MM);

    // teclas de operciones
    MM.teclado.atajos.add('ins', MM.add, MM);
    MM.teclado.atajos.add('del', MM.borrar, MM);
    // definir Ctrl+Enter para editar el nodo actual
};

;/**
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

;/**
 * @file chain.js añade el patrón chainable al sistema
 * @author José Luis Molina Soria
 * @version 20130224
 */

/**
 * @desc Implementación del patrón Chainable, mendiante la extensión del prototitpo de la función
 * @return {function} función extendida
 */
Function.prototype.chain = function() {
  var self = this;
  return function() {
    var ret = self.apply(this, arguments);
    return ret === undefined ? this : ret;
  };
};

;/**
 * @file color.js Funciones y utiles para manejo de colores.
 * @author José Luis Molina Soria
 * @version 20130523
 */

MM.color = {};

/** 
 * @desc Función semialeatoria de colores en formato HSL. Esta función ha
 *       sido ajustada para evitar colores molestos o demasiado claros/oscuros.
 * @method randomHslColor 
 * @return {Object} Objecto con los campos h, s y l 
 * @memberof MM.color
 * @static
 */
MM.color.randomHslColor = function () {
    var rand = function (max, min) {
        return parseInt(Math.random() * (max-min+1), 10) + min;
    };

    // h = Tonalidad 1-360;  s = saturación 30-100%;  l = brillo 20-50%
    return { h: rand(1, 360), s: rand(30, 100), l:rand(20, 50) };
};

MM.color.addBrillo = function (hsl, offsetBrillo) {
    offsetBrillo = offsetBrillo || 0;
    return { h: hsl.h, s: hsl.s, l: hsl.l+offsetBrillo };
};


/** 
 * @desc Calcula la cadena hsl en formato CSS
 * @method hslToCSS
 * @param {Object} hsl          Objecto con los campos h, s y l 
 * @param {number} offsetBrillo Desplazamiento al brillo. 
 * @return {string} Cadena CSS del color en formato HSL
 * @memberof MM.color
 * @static
 */
MM.color.hslToCSS = function ( hsl, offsetBrillo ) {
    offsetBrillo = offsetBrillo || 0;
    return 'hsl(' + Math.floor(hsl.h) + ',' + Math.floor(hsl.s) + '%,' + Math.floor(hsl.l + offsetBrillo) + '%)';
};

MM.color.rgbToCSS = function ( rgb ) {
    return 'rgb(' + Math.floor(rgb.r) + ', ' + Math.floor(rgb.g) + ', ' + Math.floor(rgb.b) + ')';
};

MM.color.rgbToHexCSS = function ( rgb ) {
    
    return '#' + MM.color.intToHex (rgb.r) + MM.color.intToHex (rgb.g) + MM.color.intToHex (rgb.b);
};


MM.color.intToHex = function ( valor, longitud ) {
    longitud = longitud || 2;
    var hex = Math.floor(valor).toString(16);
    while ( hex.length < longitud ) { hex = '0' + hex; }
    return hex;
};


MM.color.hue = function  ( rgb, maximum, range ) {
    var hue = 0;
    if (range !== 0) {
        switch (maximum) {
        case rgb.r:
            hue = (rgb.g - rgb.b) / range * 60;
            if (hue < 0) { hue += 360; }
            break;
        case rgb.g:
          hue = (rgb.b - rgb.r) / range * 60 + 120;
          break;
        case rgb.b:
          hue = (rgb.r - rgb.g) / range * 60 + 240;
          break;
        }
    }
    return hue;
};

MM.color.rgbToHsl = function ( rgb ) {
    var maximum = Math.max(rgb.r, rgb.g, rgb.b);
    var range   = maximum - Math.min(rgb.r, rgb.g, rgb.b);
    var l = maximum / 255 - range / 510;
    
    return {
        'h' : MM.color.hue(rgb, maximum, range),
        's' : (range === 0 ? 0 : range / 2.55 / (l < 0.5 ? l * 2 : 2 - l * 2)),
        'l' : 100 * l
    };
};


MM.color.hslToRgb = function ( hsl ) {
    var rgb = {
        'r' : hsl.l * 2.55,
        'g' : hsl.l * 2.55,
        'b' : hsl.l * 2.55
    };

    if (hsl.s !== 0) {
        var p = hsl.l < 50
                ? hsl.l * (1 + hsl.s / 100)
                : hsl.l + hsl.s - hsl.l * hsl.s / 100;
        var q = 2 * hsl.l - p;
        
        rgb = {
            'r' : (hsl.h + 120) / 60 % 6,
            'g' : hsl.h / 60,
            'b' : (hsl.h + 240) / 60 % 6
        };

        for (var key in rgb) {
            if (rgb.hasOwnProperty(key)) {
                if (rgb[key] < 1) {
                    rgb[key] = q + (p - q) * rgb[key];
                } else if (rgb[key] < 3) {
                    rgb[key] = p;
                } else if (rgb[key] < 4) {
                    rgb[key] = q + (p - q) * (4 - rgb[key]);
                } else {
                    rgb[key] = q;
                }
                rgb[key] *= 2.55;
            }
        }
    }
    return rgb;
};

/**
  var rgb = { r: 250, g: 235, b: 215 };
  var hsl = { h: 34, s: 78, l: 91 };
  
*/
;MM.comandos = {};

MM.comandos.Insertar=MM.UndoManager.ComandoHacerDeshacer.extend({
    init: function ( idPadre, idHijo, texto ) {
	this._super('add', 
		    function () {
			var p = MM.arbol.buscar(idPadre);
			var h = new MM.Arbol ( { id: idHijo, texto: texto, nodo: null } );
			MM.ponerFoco(p);
			p.hijos.push ( h );
			MM.eventos.on ( 'add', p, h );
			p = h = null;
		    },
		    function () {
			var p = MM.arbol.buscar(idPadre);
			var h = MM.arbol.buscar(idHijo);
			MM.ponerFoco ( p );
			MM.arbol.borrar ( idHijo );
			MM.eventos.on ( 'borrar', p, h );
			p = h = null;
		    });
    }
});

MM.comandos.Borrar=MM.UndoManager.ComandoHacerDeshacer.extend({
    init: function ( padre, hijo ) {
	// generamos las funciones para crear una copia del subárbol.
	var generador = function (elemento) {
	    return new MM.Arbol( { id: elemento.id, texto: elemento.texto, nodo : null } );
	};
	var operador = function ( p, h ) {
	    p.hijos.push(h);
	};

	var preRecorrido = function (nodo) {
            MM.render.repartoEspacio(nodo);
	};
	
	var postRecorrido = function (nodo) {
            var elemento = nodo.elemento;
            nodo.hijos.forEach(function (hijo) {
		if ( MM.render.buscarArista(nodo, hijo) === null ) {
		    var arista = new MM.render.Arista(MM.render.capaAristas, elemento, hijo.elemento, '3');
		    MM.render.aristas.push(arista);
		}
		arista = null;
            });
            elemento = null;
	};
	
	var idPadre = padre.elemento.id;
	var subarbol = hijo.generalPreOrden(generador, operador);
	this._super('borrar', 
		    function () {
			var padre = MM.arbol.buscar(idPadre);
			MM.ponerFoco ( padre );
			var hijo = MM.arbol.borrar ( subarbol.elemento.id );
			MM.eventos.on ( 'borrar', padre, hijo );
			padre = hijo = null;
		    },
		    function () {
			var padre = MM.arbol.buscar(idPadre);
			MM.ponerFoco(padre);
			var hijo = subarbol.generalPreOrden(generador, operador);
			padre.hijos.push ( hijo );
			if ( MM.render )  {
			    var idSusPre = padre.suscribir('preOrden', preRecorrido);
			    var idSusPost = padre.suscribir('postPreOrden', postRecorrido);
			    padre.preOrden();
			    padre.desSuscribir(idSusPre);
			    padre.desSuscribir(idSusPost);
			    idSusPre = idSusPost = null;
			    MM.render.renderAristas();
			    MM.render.capaNodos.draw();
			}
			padre = hijo = null;
		    });
    }
});

// TODO pendiente
MM.comandos.Nuevo=MM.UndoManager.ComandoHacerDeshacer.extend({
    init: function ( arbolOriginal ) {
	this._super('nuevo', 
		    function () {
			// crear un nuevo árbol
		    },
		    function () {
			// restaurar el árbol anterior
		    });
    }
});

MM.comandos.Editar=MM.UndoManager.ComandoHacerDeshacer.extend({
    init: function  ( id, original, nuevo) {
	this._super('editar', 
		    function () { 
			var e = MM.arbol.buscar(id);
			e.elemento.texto = nuevo;
			if ( e.elemento.nodo )
			    e.elemento.nodo.setText(nuevo);
			e = null;
		    },
		    function () {
			var e = MM.arbol.buscar(id);
			e.elemento.texto = original;
			e.elemento.nodo.setText(original);
			e = null;
		    });
    }
});

MM.comandos.Zoom=MM.UndoManager.ComandoHacerDeshacer.extend({
    init: function (anterior, nuevo) {
	this._super('zoom', 
		    function () { 
			MM.render.setEscala(nuevo);
		    },
		    function () {
			MM.render.setEscala(anterior);
		    });
    }
});


;
MM.demo = {};

MM.demo.timerDeslizador = null;

MM.demo.deslizar = function( id, ids ){
    var min = "-500px";
    var max = "25px";
    var e = document.getElementById(id);
    ids = ids || [];

    if ( e.style.top === max ) {
        e.style.top = min;
    } else if ( e.style.top === min || e.style.top === "" ) {
	ids.forEach ( function (item) {
	    document.getElementById(item).style.top = min;
	});
        e.style.top = max;
	if ( MM.demo.timerDeslizador ) {
	    window.clearTimeout(MM.demo.timerDeslizador);
	}
        MM.demo.timerDeslizador = window.setTimeout(function(){if (e.style.top === max ) { e.style.top = min; } },5000);
    }
};


MM.demo.ayuda = function () {
    MM.demo.deslizar('ayuda', ['datosDelProyecto']);
};

MM.demo.datosDelProyecto = function (mostrar) {
    MM.demo.deslizar('datosDelProyecto', ['ayuda']);
};

MM.demo.hacer = function(){
    MM.undoManager.hacer();
};

MM.demo.deshacer = function(){
    MM.undoManager.deshacer();
};

MM.demo.cambioUndoManager = function() {
    var btnHacer = document.getElementById('btnHacer');
    var btnDeshacer = document.getElementById('btnDeshacer');

    if ( MM.undoManager.hacerNombre() === null ) {
    	btnHacer.setAttribute('disabled', 'disabled');
    	btnHacer.setAttribute('title', '');
    } else {
    	if ( btnHacer.hasAttribute('disabled') ) {
    	    btnHacer.removeAttribute('disabled');
    	}
    	btnHacer.setAttribute('title', 'Hacer ' + MM.undoManager.hacerNombre());
    }

    if ( MM.undoManager.deshacerNombre() === null ) {
    	btnDeshacer.setAttribute('disabled', 'disabled');
    	btnDeshacer.setAttribute('title', '');
    } else {
    	if ( btnDeshacer.hasAttribute('disabled') ) {
    	    btnDeshacer.removeAttribute('disabled');
    	}
    	btnDeshacer.setAttribute('title', 'Deshacer ' + MM.undoManager.deshacerNombre());
    }

    btnHacer = btnDeshacer = null;
};


window.onload = function () {
    MM.add('hijo1').add('hijo2').add('hijo3').add('hijo4').next().add('hijo11').add('hijo12').add('hijo13');
    MM.renderizar('contenedorEditor');
    MM.undoManager.eventos.suscribir('cambio', MM.demo.cambioUndoManager );
    MM.demo.cambioUndoManager();
};
;/**
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
 * @param {string} nombre del elemento DOM que deseemos crear
 * @param {object} objecto con los atributos que deseamos en el elemento DOM
 * @param {object} elemento DOM
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

;/**
 * @file exportar.js Contiene toda la funcionalidad de exporación de Mapas mentales
 * @author José Luis Molina Soria
 * @version 20130608
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./klass.js');
    MM.PubSub = require('./pubsub.js');
}


/**
 * Contiene la funcionalidad básica para soportar la exportaciones a ficheros.
 *
 * @namespace MM.exportar
 * @property {MM.exportar.FreeMind}   FreeMind  - Clase encargada de exportar a ficheros FreeMind
 */
MM.exportar = {};

MM.exportar.freemind = function() {
    var generar = function () {
        var wrapper = MM.DOM.create('div');
        var map = MM.DOM.create('map', {'version': '0.9.0'});
        var nodos = MM.arbol.generalPreOrden(generadorNodo, operarNodo);
        for ( var i = 0; i < nodos.length; i++ ) {
            map.appendChild(nodos[i]);
        }
        wrapper.appendChild(map);
        return wrapper.innerHTML;
    };

    var generadorNodo = function ( elemento ) {
        var time = (new Date()).getTime();    
        var nodo = MM.DOM.create('node', { 'BACKGROUND_COLOR': MM.color.rgbToHexCSS(MM.color.hslToRgb(MM.color.addBrillo(elemento.nodo.hslColor, 40))),
                                           'COLOR': MM.color.rgbToHexCSS(MM.color.hslToRgb(elemento.nodo.hslColor)),
                                           'CREATE': time, 
                                           'ID': 'ID_' + Math.floor((Math.random()*(10e+10))+1),
                                           'MODIFIED': time,
                                           'STYLE': 'bubble',
                                           'TEXT': elemento.texto }); // hay que escapar el texto
        var edge = MM.DOM.create('edge', { 'STYLE' : "bezier",
                                           'COLOR' : MM.color.rgbToHexCSS(MM.color.hslToRgb(elemento.nodo.hslColor)) });
	nodo.appendChild(edge);
        time = null;
        return [nodo];
    };

    var operarNodo = function ( nodoPadre, nodos ) {
        for ( var i = 0; i < nodos.length; i++ ) {
            nodoPadre[0].appendChild(nodos[i]);
        }
        i = null;
    };

    var grabar = function() {
        window.URL = window.URL || window.webkitURL;
        if ( !window.URL ) {
            alert('Operación no soportada por su navegador');
	}
        var blob = new Blob([generar()], {type: 'application/xml'});
        var link = window.document.createElement('a');
        link.download= MM.arbol.elemento.texto + ".mm";
        link.href = window.URL.createObjectURL(blob);
        link.click();
    };

    return {
        grabar: grabar
    };
}();
;/**
 * @file grid.js Librería para pintar la rejilla de referencia
 * @author José Luis Molina Soria
 * @version 20130512
 */

/**
 * @class MM.Grid
 * @classdesc Render de grid. Pinta una rejilla
 * @constructor MM.Grid
 * @param {layer}  capa   capa donde pintar el grid
 * @param {int}    width  ancho de la rejilla
 * @param {int}    heigth alto de la rejilla
 */
MM.Grid = MM.Class.extend(/** @lends MM.Grid.prototype */{
    init: function (capa, width, height ) {
        this.capa = capa;
        this.width = width;
        this.height = height;
        this.render();
    }, 
 
    /**
     * @desc Función de pintado de la rejilla
     */
    render: function () {
        var minWidth = -2*this.width;
        var maxWidth = 2*this.width;
        var minHeight = -2*this.height;
        var maxHeight = 2*this.height;
        for ( var x = minWidth; x <= 2*this.width; x += 100 ) {
             this.capa.add( new Kinetic.Line({
                points: [x, minHeight, x, maxHeight],
                stroke: 'grey',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: [0.8, 5]
            }));
        } 
        for ( var y = -2*this.height; y <= 2*this.height; y += 100 ) {
             this.capa.add( new Kinetic.Line({
                points: [minWidth, y, maxWidth, y],
                stroke: 'grey',
                strokeWidth: 1,
                lineCap: 'round',
                lineJoin: 'round',
                dashArray: [0.8, 5]
            }));
        } 
        x = y = minWidth = maxWidth = minHeight = maxHeight = null;
    }
});

;/**
 * @file importar.js Contiene toda la funcionalidad con respecto a la carga y/o importacion de ficheros.
 * @author José Luis Molina Soria
 * @version 20130512
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./pubsub.js');
}


/**
 * Contiene la funcionalidad básica para soportar la importaciones de ficheros.
 *
 * @namespace MM.importar
 * @property {MM.importar.XML}        XML       - Clase encargada de parsear un fichero XML genérico
 * @property {MM.importar.FreeMind}   FreeMind  - Clase encargada de importar ficheros FreeMind
 */
MM.importar = function() {

    var evento = new MM.PubSub();

    /**
     * @desc Inicia la carga de un fichero de texto
     * @param file {File} Fichero que deseamos cargar
     * @param [encoding] {string} Enconding del fichero a cargar
     */
    var texto = function (file, encoding) {
        if (file) {
            var reader = new FileReader();
            reader.onloadstart = cargarInicio;
            reader.onprogress = progreso;
            reader.onload = cargado;
            reader.onabort = abortado;
            reader.onerror = error;
            reader.onloadend = cargarFin;
            reader.readAsText(file, encoding || "UTF-8");
        }
    };

    /**
     * @desc Inicia la carga de un fichero como dataURL
     * @param file {File} Fichero que deseamos cargar
     */
    var dataURL = function (file) {
        if (file) {
            var reader = new FileReader();
            reader.onloadstart = cargarInicio;
            reader.onprogress = progreso;
            reader.onload = cargado;
            reader.onabort = abortado;
            reader.onerror = error;
            reader.onloadend = cargarFin;
            reader.readAsDataURL(file);
        }
    };

    var cargarInicio = function (evt) {
        evento.on("inicio", evt);
    };

    var cargarFin = function (evt) {
        evento.on("fin", evt);
    };

    var abortado = function (evt) {
        evento.on("abortado", evt);
    };

    var progreso = function (evt) {
        if (evt.lengthComputable) {
            var porcentaje = (evt.loaded / evt.total) * 100;
            if (porcentaje < 100) {
                evento.on("progreso", porcentaje, evt);
            }
        }
    };

    var cargado = function (evt) {
        evento.on("cargado", evt.target.result, evt );
    };

    var error = function (evt) {
        if (evt.target.error.name === "NotFoundError") {
            return;
        }
        if (evt.target.error.name === "SecurityError") {
            evento.on ( "error/seguridad", evt );
        }
        if (evt.target.error.name === "NotReadableError") {
            evento.on ( "error/lectura", evt );
        }
        if (evt.target.error.name === "EncodingError") {
            evento.on ( "error/encoding", evt );
        }
    };


    return {
        evento : evento,
        texto : texto,
        dataURL : dataURL
    };
}();


/**
 * @class MM.importar.XML
 * @classdesc Clase para parsear ficheros xml.
 * @constructor MM.importar.XML
 */
MM.importar.XML = function() {

    var f = MM.Class.extend( /** @lends MM.importar.XML.prototype */{

        /**
         * @desc Proceso de carga de un fichero XML
         * @param file       {File}     Fichero que deseamos cargar
         * @param [encoding] {String} Codifiación del fichero
         */
        cargar : function (file, encoding) {
            this.idSusCargado = MM.importar.evento.suscribir ( "cargado", cargado, this);
            this.idSusErrorSeg = MM.importar.evento.suscribir ( "error/seguridad", errorCarga, this );
            this.idSusErrorLec = MM.importar.evento.suscribir ( "error/lectura", errorCarga, this );
            this.idSusErrorEnc = MM.importar.evento.suscribir ( "error/encoding", errorCarga, this );
            MM.importar.texto(file, encoding);
        }
    });

    var cargado = function ( datos, evt ) {
        var xmlDoc = getXmlDoc ( datos );
        MM.importar.evento.on ( 'xml/parseado', xmlDoc );
        var json = procesar (xmlDoc.documentElement);
        MM.importar.evento.on ( 'xml/procesado', json );
        MM.importar.evento.desSuscribir(this.idSusCargado);
        MM.importar.evento.desSuscribir(this.idSusErrorSeg);
        MM.importar.evento.desSuscribir(this.idSusErrorLec);
        MM.importar.evento.desSuscribir(this.idSusErrorEnc);
    };

    var procesar = function ( elemento ) {
        var obj = { 
            nombre : elemento.nodeName,
            hijos : []
        };
        var i;

        // establecemos los atributos del nodo 
        if ( elemento.attributes ) {
            for ( i = 0; i < elemento.attributes.length; i++ ) {
                obj[elemento.attributes[i].name] = elemento.attributes[i].value;
            }
        }
        // procesamos los hijos del elemento
        if ( elemento.childNodes ) {
            for ( i = 0 ; i < elemento.childNodes.length; i++) {
                if ( elemento.childNodes[i].nodeType === 3 ) {
                    obj.texto = elemento.childNodes[i].nodeValue;
                } else if ( elemento.childNodes[i].nodeType === 1 ) {
                        obj.hijos.push ( procesar(elemento.childNodes[i]) );
                }
            }
        }
        i = null;
        return obj;
    };


    var errorCarga = function ( evt ) {
        console.log ( evt ); // TODO procesar errores
    };

    var getXmlDoc = function ( datos ) {
        var xmlDoc, parser;
        if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString ( datos, "text/xml" );
        } else { // Sólo para IE < 9
            xmlDoc = new ActiveXObject ( "Microsoft.XMLDOM" );
            xmlDoc.async = false;
            xmlDoc.loadXML ( datos );
            // document.write("Error code: " + xmlDoc.parseError.errorCode);
            // document.write("Error reason: " + xmlDoc.parseError.reason);
            // document.write("Error line: " + xmlDoc.parseError.line);
        }
        parser = null;
        return xmlDoc;
    };

    return f;
}();


/**
 * @class MM.importar.FreeMind
 * @classdesc Clase para parsear ficheros con el formato xml de FreeMind. Crea un nuevo
 * Mapa mental, borrando el existente, con los datos cargados del fichero.
 * @constructor MM.importar.FreeMind
 */
MM.importar.FreeMind = function() {

    
    var f = MM.importar.XML.extend(/** @lends MM.importar.FreeMind.prototype */{

        /**
         * @desc Proceso de carga de un fichero FreeMind
         * @param file {File} Fichero que deseamos cargar
         */
        cargar : function (file, encoding) {
            this.idSus = MM.importar.evento.suscribir ( "xml/procesado", procesado, this);
            this._super(file, encoding);
        }
    });

    var procesado = function ( obj ) {
        if ( obj.nombre !== 'map' || obj.hijos.length !== 1 ) {
            MM.importar.evento.on("freeMind/error", "No se trata de un fichero FreeMind válido");
            return;
        }
        var raiz = obj.hijos[0];
        MM.nuevo(raiz.TEXT);
        MM.importar.evento.on("freeMind/raiz", raiz.TEXT);
        procesarHijos(raiz);
        MM.importar.evento.on("freeMind/procesado");
        MM.importar.evento.desSuscribir(this.idSus);
        raiz = null;
    };

    var procesarHijo = function ( obj ) {
        MM.add(obj.TEXT).next().lastHermano();
        procesarHijos( obj );
        MM.padre();
    };


    var procesarHijos = function ( obj ) {
        for ( var i = 0; i < obj.hijos.length; i++ ) {
            if ( obj.hijos[i].nombre === "node" ) {
                procesarHijo(obj.hijos[i]);
            }
        }
        i = null;
    };

    return f;
}();


if ( typeof module !== 'undefined' ) {
    module.exports = MM.importar;
}



// function loadXMLDocErr(dname)
// {
//     try //Internet Explorer
//     {
//      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
//      xmlDoc.async=false;
//      xmlDoc.load(dname);     
//      if (xmlDoc.parseError.errorCode != 0)
//      {
//          alert("Error in line " + xmlDoc.parseError.line +
//                " position " + xmlDoc.parseError.linePos +
//                "\nError Code: " + xmlDoc.parseError.errorCode +
//                "\nError Reason: " + xmlDoc.parseError.reason +
//                "Error Line: " + xmlDoc.parseError.srcText);
//          return(null);
//      }
//     }
//     catch(e)
//     {
//      try //Firefox
//      {
//          xmlDoc=document.implementation.createDocument("","",null);
//          xmlDoc.async=false;
//          xmlDoc.load(dname);
//          if (xmlDoc.documentElement.nodeName=="parsererror")
//          {
//              alert(xmlDoc.documentElement.childNodes[0].nodeValue);
//              return(null);
//          }
//      }
//      catch(e) {alert(e.message)}
//     }
//     try
//     {
//      return(xmlDoc);
//     }
//     catch(e) {alert(e.message)}
//     return(null);
// }
;/**
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
;/**
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

;/**
 * @File mm.js Implementación del MM
 * @author José Luis Molina Soria
 * @version 20130520
 */
MM = function (mm) {

    /** 
     * @prop {number} idNodos Identificador de nodos. Cada vez que se crea un nodo se 
     *                        le asigna un nuevo identificador
     * @memberof MM
     * @inner
     */
    var idNodos = 1;

    /** 
     * @prop {MM.UndoManager} undoManager es el manejador de acciones hacer/deshacer (undo/redo)
     * @memberof MM
     * @inner
     */
    mm.undoManager = new MM.UndoManager(10);

    /** 
     * @desc Sobreescritura del método "equal" del MM.Arbol. La comparación se realiza a 
     *       nivel de identificador.  
     * @method elementEqual 
     * @memberof MM
     * @inner
     */
    MM.Arbol.prototype.elementEqual = function ( id ) {
        return id === this.elemento.id;
    };

    /** 
     * @desc Genera un nuevo Mapa mental. Eliminar el Mapa mental existente hasta el momento.
     *       Resetea el contador de nodos. 
     * @param {String} ideaCentral Texto de la idea central. Por cefecto 'Idea Central'
     * @method nuevo
     * @memberof MM
     * @instance
     */
    mm.nuevo = function ( ideaCentral ) {
        if ( this.arbol ) {

            this.ponerFoco ( this.arbol );

            for ( var i = 0; i < this.arbol.hijos.length; i ) {
                this.next();
                this.borrar();
            }

            this.eventos.on ( 'nuevo/pre' );
        }

        idNodos = 1;

        /** 
         * @prop {MM.PubSub} eventos Gestor de eventos del Mapa mental
         * @memberof MM
         * @inner
         */
        this.eventos = new MM.PubSub();

        /** 
         * @prop {MM.Arbol} arbol Arbol-eneario que representa al Mapa mental.
         * @memberof MM
         * @inner
         */
        this.arbol = this.foco = new MM.Arbol(
            { id: idNodos++,
              texto: ideaCentral || 'Idea Central',
              nodo: null }
        );
        this.ponerFoco ( this.arbol );
        this.eventos.on ( 'nuevo/post' );
    };

    /** 
     * @desc Añade un nodo al Mapa mental. Se añade un hijo al elemento activo (que tiene el foco).
     *       Todos los nodos del árbol tiene como elemento un id, texto y un nodo (instancia de 
     *       MM.NodoSimple o MM.Globo. Es Chainable, esto nos permite realizar operaciones encadenadas.
     *       Por ejemplo, MM.add('Abuelo').add('Padre').add('Hijo').add('Nieto');
     * @param {string} texto Texto del nuevo nodo. Valor por defecto "Nuevo".
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method add
     * @memberof MM
     * @instance
     */
    mm.add = function ( texto ) {
        texto = texto || "Nueva idea";
        var nuevo = new MM.Arbol ( { id: idNodos++, texto: texto, nodo: null } );
        this.foco.hijos.push ( nuevo );
	this.undoManager.add(new MM.comandos.Insertar(this.foco.elemento.id, nuevo.elemento.id, texto) );
        this.eventos.on ( 'add', this.foco, nuevo );
        nuevo = null;
    }.chain();

    /** 
     * @desc Borra el nodo que tiene el foco. Implementael patrón Chainable.
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method borrar
     * @memberof MM
     * @instance
     */
    mm.borrar = function () {
        if ( this.arbol === this.foco ) {
            this.nuevo();
            return;
        }

        var borrar = this.foco;
        this.padre();
        this.arbol.borrar ( borrar.elemento.id );
	this.undoManager.add(new MM.comandos.Borrar(this.foco, borrar));
        this.eventos.on ( 'borrar', this.foco, borrar );
        borrar = null;
    }.chain();

    /** 
     * @desc Cambia el foco a primer hijo del nodo que tiene actualmente el foco.
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method next
     * @memberof MM
     * @instance
     */
    mm.next = function () {
        if ( this.foco.ordenNodo() !== 0 ) {
            this.eventos.on ( 'next', this.foco, this.foco.hijos[0] );
            this.ponerFoco ( this.foco.hijos[0] );
        }
    }.chain();

    /** 
     * @desc Cambia el foco al padre del nodo activo.
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method padre
     * @memberof MM
     * @instance
     */
    mm.padre = function () {
        if ( !this.foco ) { return; }
        var padre = this.arbol.padreDe ( this.foco.elemento.id );
        if ( padre !== null ) {
            this.eventos.on ( 'padre', this.foco, padre );
            this.ponerFoco ( padre );
        }
        padre = null;
    }.chain();

    /** 
     * @desc Cambia el foco al siguiente hermano del nodo actual. Si llega al último 
     *       siguiente hermano se entiende que es el primero
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method nextHermano
     * @memberof MM
     * @instance
     */
    mm.nextHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre === null ) { return; }

        for ( var i = 0; i < padre.hijos.length; i++ ) {
            if ( padre.hijos[i].elementEqual ( this.foco.elemento.id ) ) {
                if ( i === padre.hijos.length - 1 ) {
                    this.eventos.on ( 'nextHermano', this.foco, padre.hijos[0] );
                    this.ponerFoco ( padre.hijos[0] );
                } else {
                    this.eventos.on ( 'nextHermano', this.foco, padre.hijos[i + 1] );
                    this.ponerFoco ( padre.hijos[i + 1] );
                }
                break;
            }
        }
        padre = null;
    }.chain();

    /** 
     * @desc Cambia el foco al hermano anterior del nodo actual. Si llega al primero
     *       en la siguiente llamada pasará al último de los hermanos. 
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method prevHermano
     * @memberof MM
     * @instance
     */
    mm.prevHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre === null ) { return; }

        for ( var i = 0; i < padre.hijos.length; i++ ) {
            if ( padre.hijos[i].elementEqual ( this.foco.elemento.id ) ) { 
                if ( i === 0 ) {
                    this.eventos.on ( 'prevHermano', this.foco, padre.hijos[padre.hijos.length - 1] );
                    this.ponerFoco ( padre.hijos[padre.hijos.length - 1] );
                } else {
                    this.eventos.on ( 'prevHermano', this.foco, padre.hijos[i - 1] );
                    this.ponerFoco ( padre.hijos[i - 1] );
                }
                return;
            }
        }
        padre = null;
    }.chain();

    /** 
     * @desc Cambia el foco al último hermano
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method lastHermano
     * @memberof MM
     * @instance
     */
    mm.lastHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre === null ) { return; }

        if ( padre.hijos.length >= 1 ) {
            this.ponerFoco ( padre.hijos[padre.hijos.length - 1] );
        }
        padre = null;
    }.chain();


    /** 
     * @desc Pasa el foco al elemento raiz (Idea central).
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method root
     * @memberof MM
     * @instance
     */
    mm.root = function () {
        this.eventos.on ( 'root', this.foco, this.arbol );
        this.ponerFoco ( this.arbol );
    }.chain();


    /** 
     * @desc Pone el foco en nodo (subárbol) dado.
     * @param {MM.Arbol} arbol Subárbol (nodo) donde poner el foco.
     * @method ponerFoco
     * @memberof MM
     * @instance
     */
    mm.ponerFoco = function ( arbol ) {
        this.eventos.on ( 'ponerFoco', this.foco, arbol );
        this.foco = arbol;
    };

    mm.nuevo( "Idea Central" );

    /** 
     * @prop {MM.Render} render Instancia de MM.Render. El valor por defecto es null
     *                          y se crea en el momento de renderizar el árbol.
     * @memberof MM
     * @inner
     */
    mm.render = null;

    /** 
     * @desc Realiza el renderizado del Mapa mental. El renderizado se realiza ajustando el escenario al contenedor.
     *       Una vez llamada a esta función queda establecido el valor de la propiedad MM.render.
     * @param {Element}                contenedor  Elemento del árbol DOM que contendrá el Mapa mental.
     * @param {MM.NodoSimple|MM.Globo} claseNodo   Clase de renderizado de nodo 
     * @param {MM.Arista|MM.Rama}      claseArista Clase de renderizado de aristas
     * @method renderizar
     * @memberof MM
     * @instance
     */
    mm.renderizar = function ( contenedor, claseNodo, claseArista ) {
        mm.render = new MM.Render ( contenedor, claseNodo, claseArista );
        mm.render.renderizar();
    };


    /** 
     * @desc Abre un cuadro de dialogo para seleccionar el fichero FreeMind que deseamos abrir. 
     *       Lo carga y redendiza el nuevo Mapa mental una vez terminado la carga.
     * @method cargarFreeMind
     * @memberof MM
     * @instance
     */
    mm.cargarFreeMind = function () {
        var importer = new MM.importar.FreeMind();

        var susR = MM.importar.evento.suscribir("freeMind/raiz", function () {
            MM.render.desuscribrirEventos();
        });
        var susP = MM.importar.evento.suscribir("freeMind/procesado", function () {
            MM.render.renderizar();
        });

        var input = MM.DOM.create('input', {
            'type' : 'file',
            'id'   : 'ficheros'
        });
        input.addEventListener("change", function(evt) {
            if ( input.files.length !== 0 ) {
                importer.cargar(input.files[0]);
            }
        }, false);
        input.click();

    };

    return mm;
}(MM);
;/**
 * @file nodo.js Librería para renderizar nodos del MM.
 * @author José Luis Molina Soria
 * @version 20130513
 */

/**
 * @class MM.NodoSimple
 * @classdesc Render de NodoSimple. Se trata de un nodo con un texto y una 
 *            simple línea inferior. El render crea un grupo donde incluye 
 *            los distintos elementos gráficos. 
 * @constructor MM.NodoSimple
 * @param {MM.Render} render    Escenario donde pintar el mensaje
 * @param {MM.Arbol}  arbol         Capa donde pintar el grid
 * @param {Object}    propiedades   Conjunto de propiedades a establecer al 
 *                                  nodo. Como Color fuente, posición, etc.
 *                                  Ver refencias Kinetic.Text, Kinetic.Blob,
 *                                  Kinetic.Line, Kinectic.Group.
 */
MM.NodoSimple = MM.Mensaje.extend(/** @lends MM.NodoSimple.prototype */{

    /**
     * @desc Valores por defecto para Nodo
     * @memberof MM.NodoSimple
     */
    defecto: {
        x: 0,
        y: 0,
        text: '',
        fontSize: 12,
        fontFamily: 'helvetica',
        fill: '#555',
        width: 'auto',
        padding: 5,
        align: 'center'
    },

    init: function (render, arbol, propiedades) {
        this.render = render;
        this.escenario = render.escenario;
        this.capa = render.capaNodos;
        this.arbol = arbol;
        this.hslColor = MM.color.randomHslColor();
        this.colorFondo = MM.color.hslToCSS(this.hslColor, 40);
        this.color = MM.color.hslToCSS(this.hslColor);

        var prop = MM.Properties.add(this.defecto, propiedades);
        prop.x = 0;
        prop.y = 0;
        prop.fill = this.color;
        this.kText = new Kinetic.Text(prop);

        this.group = new Kinetic.Group({
            x : propiedades.x,
            y : propiedades.y,
            width: this.kText.getWidth(),
            height: this.kText.getHeight(),
            draggable: true,
            dragBoundFunc: function (pos) {
                render.renderAristas();
                return pos;
            }
        });

        this.rect = new Kinetic.Blob({
            points: [ { x: 0, y: 0 }, 
                      { x: this.kText.getWidth(), y: 0 }, 
                      { x: this.kText.getWidth(), y: this.kText.getHeight() }, 
                      { x: 0, y: this.kText.getHeight() } ],
            stroke: this.color,
            strokeWidth: 2,
            fill: this.colorFondo,
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: [3, 3],
            shadowOpacity: 0.5,
            tension: 0.3
        });


        this.line = new Kinetic.Line({
            points: [{x:0, y: this.kText.getHeight()},
                     {x:this.kText.getWidth(), y:this.kText.getHeight()}],
            stroke: this.color,
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round'
        });
        this.group.add(this.rect);
        this.group.add(this.line);
        this.group.add(this.kText);
        this.capa.add(this.group);
        this.rect.hide();

        var bindEditar = MM.Class.bind(this, this.editar);
        var bindNOP = MM.Class.bind(this, this.nop);
        var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        this.group.on('click tap', bindPonerFoco);
        this.group.on('dblclick  dbltap', bindEditar);
        this.group.on('mouseout', bindNOP);
        this.group.on('mousemove', bindNOP);
        this.group.on('mousedown', bindNOP);
        this.group.on('mouseup', bindNOP);
        this.group.on('mouseenter', bindNOP);
        this.group.on('mouseLeave', bindNOP);
        this.group.on('dragstart', bindNOP);
        this.group.on('dragend', bindNOP);
    },


    /**
     * @desc Establece el foco en el nodo resaltándolo.
     */
    ponerFoco : function () {
        this.kText.setFontStyle('bold');
        this.kText.setText('<' + this.arbol.elemento.texto + '>' );
        this.capa.draw();
    },

    /**
     * @desc Quita el foco del nodo.
     */
    quitarFoco : function () {
        this.kText.setFontStyle('normal');
        this.kText.setLineHeight(1);
        this.kText.setText(this.arbol.elemento.texto);
        this.capa.draw();
    },

    /**
     * @desc Pone el nodo en la posición x
     * @param {number} x Posición x donde poner el nodo.
     */
    setX : function (x) {
        this.group.setX(x);
    },

    /**
     * @desc Posición x del nodo.
     * @return {number} Posición x del nodo.
     */
    getX : function () {
        return this.group.getX();
    },

    /**
     * @desc Pone el nodo en la posición y
     * @param {number} y Posición y donde poner el nodo.
     */
    setY : function (y) {
        this.group.setY(y);
    },

    /**
     * @desc Posición y del nodo.
     * @return {number} Posición y del nodo.
     */
    getY : function () {
        return this.group.getY();
    },

    getGroup: function () {
	return this.group;
    },

    /**
     * @desc Ancho del nodo
     * @return {number} Ancho que ocupa el nodo.
     */
    getWidth: function () {
        return this.group.getWidth();
    },

    /**
     * @desc Alto del nodo
     * @return {number} Alto que ocupa el nodo.
     */
    getHeight: function () {
        return this.group.getHeight();
    },

    /**
     * @desc Pone el nodo en modo edición
     */
    editar: function () {
        MM.teclado.atajos.activo = false;
        var input = new MM.DOM.create('input',
            { 'id': 'editNodo',
              'value': this.arbol.elemento.texto,
              'style': 'position: absolute; ' +
                    'top : ' + (this.getY() * MM.render.getEscala()) + 'px; ' +
                    'left: ' + (this.getX() * MM.render.getEscala()) + 'px; ' +
                    'width: ' + Math.floor((this.arbol.elemento.texto.length / 2)+2) + 'em; ' +
                    'min-width: 50px; ' +
                    'border: 3px solid ' + this.color + '; ' +
                    'border-radius: 5px;' +
                    'background-color: ' + this.colorFondo + '; ' +
                    'color: ' + this.color + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; height:auto;'
            });
        var self = this;
        input.onblur = MM.Class.bind(this, this.cerrarEdicion);

        this.escenario.content.appendChild(input);
        input.select();
        input.focus();
    },

    cerrarEdicion : function ( ) {
	this.arbol.elemento.texto = this.value;
        this.group.setWidth(this.kText.getWidth());
        this.group.setHeight(this.kText.getHeight());
        this.line.setPoints ( [ { x: 0, y: this.kText.getHeight() }, 
				{ x: this.kText.getWidth(), y: this.kText.getHeight() } ] );
        MM.teclado.atajos.activo = true;
        this.remove();
        MM.ponerFoco(this.arbol);
    },

    nop: function () {
    },

    /**
     * @desc Destruye el nodo actual.
     */
    destroy : function () {
        this.rect.destroy();
        this.kText.destroy();
        this.group.destroy();
        delete this.kText;
        delete this.group;
    }
});


/**
 * @class MM.Globo
 * @classdesc Render de Globo. Se trata de un nodo con un texto y dentro de
 *            un globo. El render crea un grupo donde incluye los distintos 
 *            elementos gráficos. Hereda del MM.NodoSimple.
 * @constructor MM.Globo
 * @param {MM.Render} render    Escenario donde pintar el mensaje
 * @param {MM.Arbol}  arbol         Capa donde pintar el grid
 * @param {Object}    propiedades   Conjunto de propiedades a establecer al 
 *                                  nodo. Como Color fuente, posición, etc.
 *                                  Ver refencias Kinetic.Text, Kinetic.Blob,
 *                                  Kinetic.Line, Kinectic.Group.
 */
MM.Globo = MM.NodoSimple.extend(/** @lends MM.Globo.prototype */{
    init: function (render, arbol, propiedades) {
        this._super(render, arbol, propiedades);

        this.line.hide();
        this.rect.show();

        var bindEditar = MM.Class.bind(this, this.editar);
        var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        this.group.on('click tap', bindPonerFoco);
        this.group.on('dblclick  dbltap', bindEditar);
    },

    /**
     * @desc Pone el foco el nodo
     */
    ponerFoco : function () {
        this.rect.setStroke(this.colorFondo);
        this.rect.setFill(this.color);
        this.rect.setShadowColor(this.color);
        this.kText.setFill(this.colorFondo);
        this.capa.draw();
    },

    /**
     * @desc Quita el foco del nodo
     */
    quitarFoco : function () {
        this.rect.setStroke(this.color);
        this.rect.setFill(this.colorFondo);
        this.rect.setShadowColor('black');
        this.kText.setFill(this.color);
        this.capa.draw();
    },

    /**
     * @desc Pone el nodo el modo edición.
     */
    editar: function () {
        MM.teclado.atajos.activo = false;
        var textarea = new MM.DOM.create('textarea',
            { 'id': 'editNodo',
                'innerHTML': this.getText(),
                'style': 'position: absolute; ' +
                    'top : ' + (this.getY() * MM.render.getEscala()) + 'px; ' +
                    'left: ' + (this.getX() * MM.render.getEscala())  + 'px; ' +
                    'width: ' + Math.floor((this.arbol.elemento.texto.length / 2)+2) + 'em; ' +
                    'min-width: 50px; ' +
                    'height: 2em; ' +
                    'border: 3px solid ' + this.color + '; ' +
                    'border-radius: 5px;' +
                    'background-color: ' + this.colorFondo + '; ' +
                    'color: ' + this.color + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden;'
            });
        var self = this;
        textarea.onblur = function () {
            self.arbol.elemento.texto = this.value;
            self.setText(this.value);
            self.group.setWidth(self.kText.getWidth());
            self.group.setHeight(self.kText.getHeight());
            self.rect.setPoints ( [ { x: 0, y: 0  }, 
                                    { x: self.kText.getWidth(), y: 0 }, 
                                    { x: self.kText.getWidth(), y: self.kText.getHeight() }, 
                                    { x: 0, y: self.kText.getHeight() } ] );
            MM.teclado.atajos.activo = true;
            this.remove();
            MM.ponerFoco(self.arbol);
            window.focus();
        };
        this.escenario.content.appendChild(textarea);
        textarea.select();
        textarea.focus();
    }

});
;/**
 * @file processable.js añade el patrón processable al sistema
 * @author José Luis Molina Soria
 * @version 20130224
 */

/**
 * @desc Implementación del patrón processable, mendiante la extensión del prototitpo de la función.
 * El patrón processable incorpora una función de pre y post procesado que se ejecutarán antes y después 
 * de la función extendida.
 * @return {function} función extendida
 */
Function.prototype.processable = function (prefn, postfn) {
    var fn = this;
    return function () {
	var postRet;
        if (prefn) {
            prefn.apply(this, arguments);
        }
        var ret = fn.apply(this, arguments);    
        
        if (postfn) {
            postRet = postfn.apply(this, arguments);
        }
        return (postRet === undefined)? ret : postRet;
    };
};

if ( typeof module !== 'undefined' ) {
    module.exports = Function.prototype.procesable;
}


;/**
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
    for (name in propB) {
        nProp[name] = propB[name];
    }
    return nProp;
};


;/**
 * @file pubsub.js Implementación del patrón Publish/Subscribe
 * @author José Luis Molina Soria
 * @version 20130227
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./klass.js');
}

/**
 * @class MM.PubSub
 * @classdesc Implementación del patrón Publish/Subscribe
 * @constructor MM.PubSub
 */
MM.PubSub = MM.Class.extend(/** @lends MM.PubSub.prototype */{

    eventos : {},

    idSus : 1,

    init : function () {
	this.eventos = {};
	this.idSus = 1;
    },

    /**
     * @desc Realiza la notificación a los suscriptores de que se a producido
     * una publicación o evento.
     * @param evento {string}    nombre del evento o publicación a notificar
     * @param args   {*}         argumentos para la función callback
     * @return {boolean} Si el evento no es un nombre valido retorna false en
     * otro caso retorna true
     */
    on : function( evento ) {
        if (!this.eventos[evento]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        this.eventos[evento].forEach(function (evt){
            evt.funcion.apply(evt.contexto, args);
        });
        args = null;

        return true;
    },

    /**
     * @desc Pemite la suscripción a una publicación o evento. Donde el parametro func es
     * la función a ejecutar en el caso de que se produzca la notificación y contexto el
     * contexto de ejecución para la función callback
     * @param evento   {string}   nombre del evento o publicación en la que deseamos suscribirnos
     * @param func     {function} función callback
     * @param contexto {object}   contexto de ejecución de la función callback
     * @return {null|number} null en caso de fallo o *idSus* el identificador de suscripción
     */
    suscribir : function( evento, func, contexto ) {
        if ( !evento || !func ) {
            return null;
        }

        if (!this.eventos[evento]) {
            this.eventos[evento] = [];
        }

        contexto = contexto || this;
        this.eventos[evento].push({ id : this.idSus, contexto: contexto, funcion: func });
        return this.idSus++;
    },

    /**
     * @desc realiza una dessuscripción a un evento o notificación
     * @param id   {number} identificador de suscripción
     * @return {null|number} null si no se ha podido realizar la dessuscripción
     */
    desSuscribir : function (id) {
        for (var evento in this.eventos) {
            if ( this.eventos[evento] ) {
                for (var i = 0, len = this.eventos[evento].length; i < len; i++) {
                    if (this.eventos[evento][i].id === id) {
                        this.eventos[evento].splice(i, 1);
                        return id;
                    }
                }
            }
        }
        return null;
    }
    
});

if ( typeof module !== 'undefined' ) {
    module.exports = MM.PubSub;
}
;/**
 * @file render.js Implementación del render del MM
 * @author José Luis Molina Soria
 * @version 20130625
 */

/**
 * @class MM.Render
 * @classdesc Render de MM. Capaz de renderizar un MM completo
 * @constructor MM.Render
 * @param {Element}                contenedor  Elemento DOM donde renderizar el MM
 * @param {MM.NodoSimple|MM.Globo} claseNodo   Clase de renderizado de Nodos a utilizar. 
 *                                             Por defecto utiliza la clase MM.Globo
 * @param {MM.Arista|MM.Rama}      claseArista Clase de renderizado de aristas a utilizar.
 *                                             Por defecto utiliza la clase MM.Arista
 */
MM.Render = function() {
    var render = MM.Class.extend(/** @lends MM.Render.prototype */{
        init : function (contenedor, claseNodo, claseArista) {
            /** @prop {Element} contenedor Elemento DOM. Contenedor del escenario */
            this.contenedor = window.document.getElementById(contenedor);

            /** @prop {number} width Ancho en pixeles del MM. Calculado a partir del contenedor  */
            this.width = this.contenedor.clientWidth - 2; // -2px

            /** @prop {number} height Alto en pixeles del MM. Calculado a partir del contenedor */
            this.height = this.contenedor.clientHeight - 2; // -2px

            /** @prop {number} devicePixelRatio Pixel Ratio del dispositivo. */
            this.devicePixelRatio = getDevicePixelRatio();

            /** @prop {MM.Globo|MM.NodoSimple} Nodo Clase de renderizado de nodos. Por defecto, MM.Globo */
            this.Nodo = claseNodo || MM.Globo;

            /** @prop {MM.Arista|MM.Rama} Arista Clase de renderizado de aristas. Por defecto, MM.Arista */
            this.Arista = claseArista || MM.Arista;

            /** @prop {Kinetic.Stage} escenario Escenario donde irán cubicadas las capas de dibujo (Layers | Canvas). */
            this.escenario = new Kinetic.Stage({
                container: contenedor,
                width: this.width,
                height: this.height/*,
                draggable: true,
                dragBoundFunc: function (pos) {
                    MM.render.offset = pos;
                    MM.render.renderAristas();
                    return pos;
                }*/

            });

            this.offset = {x:0, y:0};

            /** @prop {Kinetic.Layer} capaGrid Capa donde se dibujará el grid o rejilla del MM */
            this.capaGrid = new Kinetic.Layer();

            /** @prop {Kinetic.Layer} capaNodos Capa donde se dibujarán los nodos del MM */
            this.capaNodos = new Kinetic.Layer();

            /** @prop {Kinetic.Layer} capaAristas Capa donde se dibujarán las aristas del MM */
            this.capaAristas = new Kinetic.Layer();

            this.escenario.add(this.capaGrid);
            this.escenario.add(this.capaAristas);
            this.escenario.add(this.capaNodos);
        }
    });

    /** @prop {Array} aristas Conjunto de aristas (MM.Arista o MM.Rama) renderizadas en el MM */
    render.prototype.aristas = [];
    
    /** @prop {Array} suscripciones Array de id de suscripciones (id de eventos) */
    render.prototype.suscripciones = [];

    /**
     * @desc Método encargado de realizar el renderizado del MM.
     * @memberof MM.Render 
     * @method renderizar
     * @instance
     */
    render.prototype.renderizar = function () {
        this.capaGrid.removeChildren();
        new MM.Grid(this.capaGrid, this.width, this.height);
//        new MM.Borde(this.capaGrid, this.width, this.height);

        MM.arbol.elemento.reparto = {y0: 0, y1: this.height};
        var idSusPre = MM.arbol.suscribir('preOrden', MM.Class.bind(this, preRecorrido) );
        var idSusPost = MM.arbol.suscribir('postPreOrden', MM.Class.bind(this, postRecorrido) );
        MM.arbol.preOrden();
        MM.arbol.desSuscribir(idSusPre);
        MM.arbol.desSuscribir(idSusPost);
        this.suscribrirEventos();
        MM.root();
        this.escenario.draw();
        this.renderAristas();

        MM.definirAtajos();

        idSusPre = idSusPost = null;
    };

    /**
     * @desc Método que se encarga de realizar y registrar las suscripciones a eventos del MM.
     * @memberof MM.Render 
     * @method suscribirEventos
     * @instance
     */
    render.prototype.suscribrirEventos = function ( ) {
        this.desuscribrirEventos(); // evitamos dobles suscripciones
        this.suscripciones.push ( MM.eventos.suscribir('ponerFoco', cambiarFoco) );
        this.suscripciones.push ( MM.eventos.suscribir('add', this.nuevoNodo, this) );
        this.suscripciones.push ( MM.eventos.suscribir('borrar', this.borrarNodo, this) );
        this.suscripciones.push ( MM.eventos.suscribir('nuevo/pre', function () {
            MM.arbol.elemento.nodo.destroy();
        }) );
        this.suscripciones.push ( MM.eventos.suscribir('nuevo/post', function () {
            this.renderizar();
        }, this) );
    };

    /**
     * @desc Borra las suscriciones a eventos del MM.
     * @memberof MM.Render 
     * @method desuscribirEventos
     * @instance
     */
    render.prototype.desuscribrirEventos = function ( ) {
        this.suscripciones.forEach ( function ( idSus ) {
            MM.eventos.desSuscribir(idSus);
        });
        this.suscripciones = [];
    };

    /**
     * @desc Renderiza las aristas de forma independiente
     * @memberof MM.Render 
     * @method renderAristas
     * @inner
     */
    render.prototype.renderAristas = function () {
        if (!this.capaAristas) { return; }
        this.capaAristas.clear();
        this.aristas.forEach(function (arista) {
            arista.render();
        });
    };

    /**
     * @desc Renderiza un nuevo nodo. Es lanzado en el momento de crear un nuevo nodo en el MM.
     *       Es decir, atiende al evento del MM de creación de nuevos nodos
     * @param {MM.Arbol} padre Nodo padre del nuevo nodo
     * @param {MM.Arbol} hijo  Nodo nuevo. Nodo a renderizar
     * @memberof MM.Render 
     * @method nuevoNodo
     * @inner
     */
    render.prototype.nuevoNodo = function (padre, hijo) {
        this.repartoEspacio(padre);
        this.aristas.push(new this.Arista(this.capaAristas, padre.elemento, hijo.elemento, '3'));
        this.renderAristas();
        this.capaNodos.draw();
    };

    /**
     * @desc Se encarga de repartir el espacio entre los nodos hijos de un nodo padre dado. 
     *       Cada Nodo tiene un espacio asignado en el que puede ser renderizado.
     * @param {MM.Arbol} padre Nodo padre de los nodos que deseamos organizar
     * @memberof MM.Render 
     * @method repartoEspacio
     * @inner
     */
    render.prototype.repartoEspacio = function (padre) {
        var prof = MM.arbol.profundidad(padre.elemento.id);
        var reparto = padre.elemento.reparto;

        this.posicionarNodo ( padre, prof );

        var y0 = reparto.y0;
        var division = (reparto.y1 - reparto.y0) / padre.hijos.length;
        division = (division < 22) ? 22 : division; // TODO: Quitar la constante 22 por la altura del padre

        padre.hijos.forEach(function (hijo) {
            hijo.elemento.reparto = {y0: y0, y1: y0 + division};
            this.posicionarNodo ( hijo, prof + 1 );
            y0 += division;
        }, this);

        prof = reparto = y0 = division = null;
    };

    /**
     * @desc Posiciona un nodo del arbol en función de la profundidad. Si el nodo no esta renderizado lo renderiza
     *       dentro del espacio asignado para él. 
     * @param {MM.Arbol} arbol Nodo del arbol que deseamos prosicionar
     * @memberof MM.Render 
     * @method posicionarNodo
     * @inner
     */
    render.prototype.posicionarNodo = function (arbol, profundidad) {
        var elemento = arbol.elemento;
        var reparto = elemento.reparto;
        var x = 25 + (150 * profundidad); // reformular esto 10 el ancho del nodo
        var y = reparto.y0 + ( (reparto.y1 - reparto.y0) / 2) - 11; // TODO: Quitar la constante de 11 por la mitad e la altura

        if (elemento.nodo !== null) {
            elemento.nodo.setX(x);
            elemento.nodo.setY(y);
        } else {
            elemento.nodo = new this.Nodo(this, arbol, { x: x, y: y, text: elemento.texto});
        }
        elemento = reparto = x = y = null;
    };

    var preRecorrido = function (nodo) {
        this.repartoEspacio(nodo);
    };

    var postRecorrido = function (nodo) {
        var elemento = nodo.elemento;
        nodo.hijos.forEach(function (hijo) {
            var arista = new this.Arista(this.capaAristas, elemento, hijo.elemento, '3');
            this.aristas.push(arista);
            arista = null;
        }, this);
        elemento = null;
    };

    var getDevicePixelRatio = function () {
        if ( window.devicePixelRatio ) {
            return window.devicePixelRatio;
	}
        return 1;
    };


    /**
     * @desc Buscador de aristas en función del padre e hijo (origen - destino).
     * @param {MM.Arbol} padre Padre o nodo origen de la arista
     * @param {MM.Arbol} hijo  Hijo o nodo destino de la arista
     * @memberof MM.Render 
     * @method buscarArista
     * @inner
     */
    render.prototype.buscarArista = function (padre, hijo) {
        for (var i = 0; i < this.aristas.length; i++) {
            if (padre.elemento.id === this.aristas[i].elementoOrigen.id &&
                hijo.elemento.id === this.aristas[i].elementoDestino.id) {
                return i;
            }
        }
        return null;
    };

    /**
     * @desc Eliminar una arista del conjunto de aristas del render
     * @param {MM.Arbol} padre Padre o nodo origen de la arista
     * @param {MM.Arbol} hijo  Hijo o nodo destino de la arista
     * @memberof MM.Render 
     * @method borrarArista
     * @inner
     */
    render.prototype.borrarArista = function (padre, hijo) {
        for (var i = 0; i < this.aristas.length; i++) {
            if (padre.elemento.id === this.aristas[i].elementoOrigen.id &&
                hijo.elemento.id === this.aristas[i].elementoDestino.id) {
                return this.aristas.splice(i, 1);
            }
        }
        return null;
    };

    /**
     * @desc Borra un nodo hijo.
     * @param {MM.Arbol} padre Nodo padre del elemento a borrar
     * @param {MM.Arbol} hijo  Nodo a borrar.
     * @memberof MM.Render 
     * @method borrarHijo
     * @inner
     */
    render.prototype.borrarHijo = function (padre, hijo) {
        for (var i = 0; i < padre.hijos.length; i++) {
            if (padre.hijos[i].elemento.id === hijo.elemento.id) {
                return padre.hijos.splice(i, 1);
            }
        }
        return null;
    };

    /**
     * @desc Borra un nodo. Manejador del evento de borrado de nodos del MM.
     * @param {MM.Arbol} padre    Nodo padre del elemento a borrar
     * @param {MM.Arbol} borrado  Nodo a borrar.
     * @memberof MM.Render 
     * @method borrarNodo
     * @inner
     */
    render.prototype.borrarNodo = function (padre, borrado) {
        // recorremos los hijos. i no incrementa por que después de borrar queda un elemento menos
        for (var i = 0; i < borrado.hijos.length; i) {
            this.borrarNodo(borrado, borrado.hijos[i]);
        }

        // borramos los elementos gráficos relacionados
        this.borrarArista(padre, borrado);
        borrado.elemento.nodo.destroy();

        // importante borrar el hijo borrado para evitar errores en el pintado
        this.borrarHijo(padre, borrado);
        this.repartoEspacio(padre);
        this.renderAristas();
        this.capaNodos.draw();
        i = null;
    };


    /**
     * @desc Calcula la escala a la que esta renderizada la imagen
     * @return {number} Escala actual.
     * @memberof MM.Render 
     * @method getEscala
     * @inner
     */
    render.prototype.getEscala = function () {
        var scale = MM.render.escenario.getScale();
        return scale.x;
    };


    /**
     * @desc Establece la escala a la que esta renderizada la imagen
     * @param {number} escala Nueva escala.
     * @memberof MM.Render 
     * @method setEscala
     * @inner
     */
    render.prototype.setEscala = function ( escala ) {
        MM.render.escenario.setScale({x:escala, y:escala});
        MM.render.capaNodos.draw();
        MM.render.renderAristas();
    };


    /**
     * @desc Realiza un zoomIn al Mapa mental.
     * @memberof MM.Render 
     * @method zoomIn
     * @inner
     */
    render.prototype.zoomIn = function () {
        var scale = MM.render.getEscala();
	MM.render.setEscala(scale+0.05);
	MM.undoManager.add ( new MM.comandos.Zoom(scale, scale+0.05) );
    };

    /**
     * @desc Realiza un zoomOut al Mapa mental.
     * @memberof MM.Render 
     * @method zoomOut
     * @inner
     */
    render.prototype.zoomOut = function () {
        var scale = MM.render.getEscala();
        if ( scale >= 0.05 ) {
            MM.render.setEscala(scale - 0.05);
	    MM.undoManager.add(new MM.comandos.Zoom(scale, scale-0.05) );
        }
    };

    /**
     * @desc Reseet del zoom. Establece la escala a 1.
     * @memberof MM.Render 
     * @method zoomReset
     * @inner
     */
    render.prototype.zoomReset = function () {
	MM.render.setEscala(1);
	MM.undoManager.add(new MM.comandos.Zoom(MM.render.getEscala(), 1) );
    };


    /**
     * @desc Cambia el foco de posición (nodo). Manejador del evento de cambio de foco del MM.
     * @param {MM.Arbol} anterior   Nodo que tiene el foco
     * @param {MM.Arbol} siguiente  Nodo que toma el foco
     * @memberof MM.Render 
     * @method cambiarFoco
     * @inner
     */
    var cambiarFoco = function (anterior, siguiente) {
        if ( anterior !== null && anterior.elemento.nodo !== null ) {
            anterior.elemento.nodo.quitarFoco();
	}
        if ( siguiente !== null && siguiente.elemento.nodo !== null ) {
            siguiente.elemento.nodo.ponerFoco();
	}
    };

    /**
     * @desc Pone en modo edición el nodo actual.
     * @memberof MM.Render 
     * @method editar
     * @inner
     */
    render.prototype.editar = function () {
	MM.foco.elemento.nodo.editar();
//	MM.undoManager.add(new MM.comandos.editar(MM.foco.elemento.texto, nuevoTexto);
    };


    return render;
}();

;/**
 * @file teclado.js Librería para el porcesado y control del teclado
 * @author José Luis Molina Soria
 * @version 20130508
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
}

/**
 * Espacio de nombre para el proceso y control del teclado 
 * @namespace MM.teclado
 * @property {MM.teclado.tecla}   tecla  - Funciones y constantes de tecla
 * @property {MM.teclado.atajos}  atajos - Manejador de atajos de teclado. P.E.: "Ctrl+Alt+i"
 */
MM.teclado = {};


/**
 * Espacio de nombre para funciones y constantes de teclas
 * @namespace MM.teclado.tecla
 */
MM.teclado.tecla = {
    // teclas de función
    f1  : 112,
    f2  : 113,
    f3  : 114,
    f4  : 115,
    f5  : 116,
    f6  : 117,
    f7  : 118,
    f8  : 119,
    f9  : 120,
    f10 : 121,
    f11 : 122,
    f12 : 123,
    
    // modificadores
    shift : 16,
    ctrl  : 17,
    alt   : 18,
    leftWindow : 91,
    rightWindow : 92,
    
    // bloqueos
    scrolllock : 145,
    numlock : 144,
    capslock : 20,
    
    // teclas de navegación y edición
    pageup : 33,
    pagedown : 34,
    left : 37,
    up : 38,
    right :39,
    down : 40,
    ins : 45,
    home : 36,
    del : 46,
    end : 35,
    
    // otras
    backspace : 8,
    tab : 9,
    enter : 13,
    esc : 27,
    space : 32
};


/**
 * @desc Manejador de teclado para el evento keyUp
 * @param {event} e Instancia de evento de teclado
 */
MM.teclado.keyUp = function (e){
    // console.log ( 'keyUp activo: ' + MM.teclado.atajos.activo );
    // console.log ( 'keyUp eventPhase: ' + e.eventPhase );
    // console.log ( 'keyUp type: ' + e.type );
    // console.log ( 'keyUp cancelable: ' + e.cancelable );
    if ( !MM.teclado.atajos.activo ) {
        return true;
    }
    //console.log ( 'keyUp activo: ' + MM.teclado.atajos.activo );

    var evt = e ? e : window.event;
    var key = window.Event ? evt.which : evt.keyCode;
    
    if ( MM.teclado.tecla.esControl(key) ) {
        MM.teclado.atajos.ctrl = false;
    }
    if ( MM.teclado.tecla.esAlt(key) ) {
        MM.teclado.atajos.alt = false;
    }
    if ( MM.teclado.tecla.esShift(key) ) {
        MM.teclado.atajos.shift = false;
    }
    if ( MM.teclado.tecla.esWindow(key) ) {
        MM.teclado.atajos.window = false;
    }
    evt = key = null;
    return true;
};

/**
 * @desc Manejador de teclado para el evento keyDown
 * @param {event} e Instancia de evento de teclado
 */
MM.teclado.keyDown = function (e){
    // console.log ( 'keyDown activo: ' + MM.teclado.atajos.activo );
    // console.log ( 'keyDown eventPhase: ' + e.eventPhase );
    // console.log ( 'keyDown type: ' + e.type );
    // console.log ( 'keyDown cancelable: ' + e.cancelable );
    if ( !MM.teclado.atajos.activo ) {
        return true;
    }
    // console.log ( 'keyDown activo: ' + MM.teclado.atajos.activo );
    
    var evt = e ? e : window.event;
    var key = window.Event ? evt.which : evt.keyCode;
    var nombre = MM.teclado.tecla.nombre(key);
    var nombreAtajo; 

    if ( MM.teclado.tecla.esModificador(key) ) {
        if ( MM.teclado.tecla.esControl(key) ) {
            MM.teclado.atajos.ctrl = true;
        }
        if ( MM.teclado.tecla.esAlt(key) ) {
            MM.teclado.atajos.alt = true;
        }
        if ( MM.teclado.tecla.esShift(key) ) {
            MM.teclado.atajos.shift = true;
        }
        if ( MM.teclado.tecla.esWindow(key) ) {
            MM.teclado.atajos.window = true;
        }
    } else { 
        nombreAtajo = MM.teclado.atajos.calcular(nombre);
        if ( MM.teclado.atajos.definidos[nombreAtajo] ) { 
            evt.preventDefault(); 
            evt.stopPropagation();
        }
        MM.teclado.atajos.lanzar(nombreAtajo);
        return false;
    }
    evt = key = nombre = nombreAtajo = null;
    return true;
};


/**
 * @desc Dado un valor devuelve el nombre de la tecla
 * @param {integer} key valor númerico de una tecla
 * @return {string} nombre asociado a una tecla
 **/ 
MM.teclado.tecla.nombre = function ( key ) {
    for (var name in this) {
        if ( key === this[name] ) {
            return name;
        }
    }
    return String.fromCharCode(key);
};
    

/**
 * @desc Dado un nombre nos devuelve su valor
 * @param {string} nombre Nombre de una tecla
 * @return {integer} valor asociado al nombre 
 **/ 
MM.teclado.tecla.valor = function ( nombre ) {
    return this[nombre];
};

/**
 * @desc Test para saber si una tecla es un modificador o no. Se trata de un 
 * modificador si la tecla es Ctrl o Alt o Shift o Window
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si es un modificador y false en otro caso
 **/     
MM.teclado.tecla.esModificador = function ( key ) {
    return key === this.ctrl || key === this.alt || key === this.shift ||
        key === this.leftWindow || key === this.rightWindow;
};

/**
 * @desc Comprueba si latecla es Ctrl
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Ctrl
 **/     
MM.teclado.tecla.esControl = function ( key ) {
    return key === this.ctrl;
};

/**
 * @desc Comprueba si la tecla es Alt
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Alt
 **/         
MM.teclado.tecla.esAlt = function ( key ) {
    return key === this.alt;
};

/**
 * @desc Comprueba si la una tecla es Shift (Mayúsculas)
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Shift (Mayúsculas)
 **/             
MM.teclado.tecla.esShift = function ( key ) {
    return key === this.shift;
};

/**
 * @desc Comprueba si la una tecla es Window
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Window
 **/                 
MM.teclado.tecla.esWindow = function ( key ) {
    return key === this.leftWindow || key === this.rightWindow;
};

/**
 * Espacio de nombre manejos de atajos de teclado. P.E.: "Ctrl+Alt+i"
 * @namespace MM.teclado.atajos
 */
MM.teclado.atajos = {
    activo : true,
    definidos : {},
    contextos : {},
    ctrl : false,
    shift : false,
    alt : false,
    window : false
};

/**
 * @desc Añade una definición de atajo de teclado
 * @param {string} atajo Nombre del atajo de teclado a añadir al control de atajos
 * @param {function} f Función a ejecutar cuando se de el atajo
 **/                 
MM.teclado.atajos.add = function ( atajo, f, contexto ) {
    this.definidos[atajo] = f;
    this.contextos[atajo] = contexto || this;
};

/**
 * @desc Calcula si existe una atajo para el estado actual de los modficiadores y una tecla dada
 * @param {string} nombre Nombre de tecla pulsada
 * @return {string | null} Nombre del atajo de teclado o null si no existe
 **/                 
MM.teclado.atajos.calcular = function ( nombre ) {
    var reKey = new RegExp("\\+" + nombre + "$", "i" );
    var reCtrl = /ctrl\+/i;
    var reAlt = /alt\+/i;
    var reShift = /shift\+/i;
    var reWindow = /window\+/i;
    
    for (var name in this.definidos) {
        if ( nombre === name ) { return name; }
        if( reKey.test(name) && 
            ( this.ctrl?reCtrl.test(name):!reCtrl.test(name)) && 
            ( this.alt?reAlt.test(name):!reAlt.test(name)) && 
            ( this.shift?reShift.test(name):!reShift.test(name)) && 
            ( this.window?reWindow.test(name):!reWindow.test(name)) ) {
            return name;
        }
    }
    reKey = reCtrl = reAlt = reShift = reWindow = null;
    return null;
};

/**
 * @desc Lanza la función asociada al atajo de teclado
 * @param {string} atajo Nombre del atajo de teclado
 * @param {object} contexto de ejecución de la función asociada al atajo de teclado
 **/                 
MM.teclado.atajos.lanzar = function (atajo) {
    if ( this.definidos[atajo] ) {
        this.definidos[atajo].apply(this.contextos[atajo], []);
    }
};

if ( typeof module !== 'undefined' ) {
    module.exports = MM.teclado;
}

if ( window ) {
    window.addEventListener ("keyup", MM.teclado.keyUp, true);
    window.addEventListener ("keydown", MM.teclado.keyDown, true);
}
;/**
 * @file undoManager.js Implementación de un gestor de comandos hacer y deshacer
 * @author José Luis Molina Soria
 * @version 20130620
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./klass.js');
    MM.PubSub = require('./pubsub.js');
}

/**
 * @class MM.UndoManager
 * @classdesc Gestor de comandos undo (hacer y deshacer).
 * @constructor 
 * @param maximo {integer} El máximo de comando en buffer. Por defecto, 10.
 */  
MM.UndoManager = MM.Class.extend(function() {
    /** 
     * @prop {Array} Comando del tipo Hacer / Deshacer
     * @memberof MM.UndoManager
     * @inner
     */
    var comandos = [];    // la lista de comandos

    /** 
     * @prop {integer} Tamaño máximo del buffer
     * @memberof MM.UndoManager
     * @inner
     */
    var maxComandos = 10; // número máximo de comandos en cola

    /** 
     * @prop {integer} Indice del comando actual
     * @memberof MM.UndoManager
     * @inner
     */
    var actual = -1;      // índice comando actual


    var eventos = new MM.PubSub();


    var init = function ( maximo ) {
	maxComandos = maximo || 10;
    };

    /** 
     * @desc Añade un nuevo comando a la pila de comandos. Si el tamaño del buffer sobrepasa el 
     *       máximo fijado, entonces elimina el comando más antiguo. Si existiensen comandos por
     *       encima del actual, estos serán eliminados.
     * @param {MM.UndoManager.ComandoHacerDeshacer} Comando a añadir al buffer.
     * @memberof MM.UndoManager
     * @instance
     */
    var add = function (comando) {
        borrarPorEncimaActual();
        comandos.push(comando);
        actual = comandos.length -1;
        ajustarMaximo();
	eventos.on('add');
	eventos.on('cambio');
    };

    var borrarPorEncimaActual = function () {
        if ( actual !== -1 && actual < comandos.length -1 ){
            comandos = comandos.slice(0,actual+1);
        }
    };
    
    var ajustarMaximo = function () {
        if ( actual === maxComandos ){
            comandos.shift();
            actual--;
        }
    };
    
    /**
     * @desc Ejecuta el comando hacer correspondiente, según el comando actual. También hace avanzar
     *       el puntero actual. El comando que se ejecuta o (hace) es el siguiente al comando actual. 
     *       Si el comando actual es último no hay comando hacer, o no hay que hacer nada.
     * @memberof MM.UndoManager
     * @instance
     */
    var hacer = function () {
        if ( comandos[actual+1] ) {
            comandos[actual+1].hacer();
            avanzar();
	    eventos.on('hacer');
	    eventos.on('cambio');
        }
    };

    /**
     * @desc Ejecuta el comando deshacer correspondiente, según el comando actual. También hace 
     *       retroceder el puntero actual. 
     * @memberof MM.UndoManager
     * @instance
     */    
    var deshacer = function () {
        if ( actual !== -1 ) {
            comandos[actual].deshacer();
            retroceder();
	    eventos.on('deshacer');
	    eventos.on('cambio');
        }
    };

    var avanzar = function () {
        if (actual < comandos.length - 1) {
            actual++;
	    eventos.on('avanzar');
	    eventos.on('cambio');
        }
    };
    
    var retroceder = function () {
        if (actual >= 0) {
            actual--;
	    eventos.on('retroceder');
	    eventos.on('cambio');
        }
    };

    /**
     * @desc Calcula el nombre del comando a Hacer según la situación actual.
     * @return {String} nombre del comando hacer.
     * @memberof MM.UndoManager
     * @instance
     */        
    var hacerNombre = function () {
        if ( comandos[actual+1] ) {
            return comandos[actual+1].nombre;
        }
        return null;
    };

    /**
     * @desc Calcula el nombre del comando a deshacer según la situación actual.
     * @return {String} nombre del comando deshacer.
     * @memberof MM.UndoManager
     * @instance
     */            
    var deshacerNombre = function () {
        if ( actual !== -1 ) {
            return comandos[actual].nombre;
        }
        return null;
    };


    /**
     * @desc Genera un array con los nombres de los comandos
     * @return {Array} Array con los nombres de los comandos
     * @memberof MM.UndoManager
     * @instance
     */            
    var nombres = function () {
	return comandos.map(function (c) { return c.nombre; });
    };
    
    return {
	init : init, 
	nombres : nombres,
        hacerNombre : hacerNombre,
	deshacerNombre: deshacerNombre,
	/**
	 * @desc Indica el indice actual dentro de la lista de comandos.
	 * @return {Integer} indice actual
	 * @memberof MM.UndoManager
	 * @instance
	 */
        actual : function () { return actual; },
        add : add,
        hacer : hacer,
        deshacer : deshacer,
        /** 
         * @prop {MM.PubSub} eventos Gestor de eventos del undoManager
         * @memberof MM.UndoManager
         * @instance
         */
	eventos : eventos
    };
}());

/**
 * @class MM.UndoManager.ComandoHacerDeshacer
 * @classdesc Clase base para el comportamiento de una comando hacer/deshacer (undo/redo).
 * @constructor 
 * @param {string} nombre Nombre del comando
 * @param {function} hacerCallBack Función a ejecutar en el hacer.
 * @param {function} deshacerCallBack Función a ejecutar en el deshacer
 */  
MM.UndoManager.ComandoHacerDeshacer = MM.Class.extend(
/** @lends MM.UndoManager.ComandoHacerDeshacer.prototype */{
    init: function (nombre, hacerCallBack, deshacerCallBack) {
        this.nombre = nombre;
	this.hacerCallBack = hacerCallBack;
        this.deshacerCallBack = deshacerCallBack;
    },

    /**
     * @desc Ejecuta el comando hacer
     * @memberof MM.UndoManager.ComandoHacerDeshacer
     * @instance
     */
    hacer : function () {
	this.hacerCallBack();
    },

    /**
     * @desc Ejecuta el comando deshacer
     * @memberof MM.UndoManager.ComandoHacerDeshacer
     * @instance
     */
    deshacer : function () {
	this.deshacerCallBack();
    }
});


if ( typeof module !== 'undefined' ) {
    module.exports.UndoManager = MM.UndoManager;
}

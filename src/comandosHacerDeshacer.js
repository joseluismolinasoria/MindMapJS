MM.comandos = {};

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



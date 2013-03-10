// Módulo principal
MM = function (mm) {

    var idNodos = 1;

    MM.Arbol.prototype.elementEqual = function (id){
	return id === this.elemento.id;
    };

    mm.eventos = new MM.PubSub();

    mm.arbol = mm.foco = new MM.Arbol({id: idNodos++, texto: 'Idea Central', nodo: null});

    mm.add = function (texto) {
	var nuevo = new MM.Arbol({id: idNodos++, texto: texto, nodo: null});
        this.foco.hijos.push(nuevo);
	this.eventos.on('add', this.foco, nuevo);
	nuevo = null;
    }.chain();

    mm.borrar = function () {
	if ( this.arbol === this.foco )
	    return;
	var borrar = this.foco;
	this.padre();
	mm.arbol.borrar(borrar.elemento.id);
	this.eventos.on('borrar', this.foco, borrar);
	borrar = null;
    }.chain();

    mm.next = function () {
	if ( this.foco.ordenNodo() !== 0 ) {
	    this.eventos.on ( 'next', this.foco, this.foco.hijos[0] );
	    this.foco = this.foco.hijos[0];
	}
    }.chain();

    mm.padre = function () {
	if ( !this.foco )
	    return;
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p != null ){
	    this.eventos.on ( 'padre', this.foco, p );
	    this.foco = p;
	}
	p = null;
    }.chain();

    mm.nextHermano = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p == null ) return; 
	for ( var i = 0; i < p.hijos.length; i++ )
	    if ( p.hijos[i].elementEqual(this.foco.elemento.id) ){
		if ( i === p.hijos.length-1 ) {
		    this.eventos.on ( 'nextHermano', this.foco, p.hijos[0] );
		    this.foco = p.hijos[0];
		} else {
		    this.eventos.on ( 'nextHermano', this.foco, p.hijos[i+1] );
		    this.foco = p.hijos[i+1];
		}
		break;
	    }
	p = null;
    }.chain();


    mm.prevHermano = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p == null ) return;
	for ( var i = 0; i < p.hijos.length; i++ )
	    if ( p.hijos[i].elementEqual(this.foco.elemento.id) ) {
		if ( i === 0 ) {
		    this.eventos.on ( 'prevHermano', this.foco, p.hijos[p.hijos.length-1] );
		    this.foco = p.hijos[p.hijos.length-1];
		} else {
		    this.eventos.on ( 'prevHermano', this.foco, p.hijos[i-1] );
		    this.foco = p.hijos[i-1];
		}
		return;
	    }
	p = null;
    }.chain();


    mm.root = function () {
	this.eventos.on('root', this.foco, this.arbol);
	this.foco = this.arbol;
    }.chain();
    

    mm.ponerFoco = function ( arbol ) {
	this.eventos.on('ponerFoco', this.foco, arbol);
	this.foco = arbol;
    };

    return mm;
}(MM);

// extendemos el modulo MM para el render
MM = function ( mm ) {
    mm.aristas = [];

    mm.render = function ( contenedor, width, height ) {
        this.escenario = new Kinetic.Stage({
            container: contenedor,
            width: width,
            height: height
        });

	this.width = width;
	this.height = height;
	this.devicePixelRatio = getDevicePixelRatio();
        this.capaNodos = new Kinetic.Layer();
	this.capaNodos.beforeDraw(this.renderAristas);
        this.capaAristas = new Kinetic.Layer();

        this.escenario.add(this.capaAristas);

	mm.arbol.elemento.reparto = {y0: 0, y1: height};
	mm.arbol.subscribir('preOrden', preRecorrido);
	mm.arbol.subscribir('postPreOrden', postRecorrido);
        this.arbol.preOrden();

        this.escenario.add(this.capaNodos);

	this.eventos.subscribir('root', cambiarFoco);
	this.eventos.subscribir('padre', cambiarFoco);
	this.eventos.subscribir('next', cambiarFoco);
	this.eventos.subscribir('nextHermano', cambiarFoco);
	this.eventos.subscribir('prevHermano', cambiarFoco);
	this.eventos.subscribir('ponerFoco', cambiarFoco);
	this.eventos.subscribir('add', nuevoNodo);
	this.eventos.subscribir('borrar', this.borrarNodo, this);
	this.root();
    };

    mm.renderAristas = function () {
	if ( !this.capaAristas ) 
	    return;
	this.capaAristas.clear();
	this.aristas.forEach( function ( arista ) {
	    arista.render();
	});
    };

    var nuevoNodo = function ( padre, hijo ) {
	repartoEspacio(padre);
	mm.aristas.push ( new Arista(mm.capaAristas, padre.elemento, hijo.elemento) );
	mm.renderAristas();
	mm.capaNodos.draw();
    };

    var repartoEspacio = function (padre) {
	var p = mm.arbol.profundidad(padre.elemento.id);
	var r = padre.elemento.reparto;

	posicionarNodo(padre, p);

	var y0 = r.y0;
	var division = (r.y1 -r.y0) / padre.hijos.length;
	division = (division < 22)?22:division;             // TODO: Quitar la constante 22 por la altura del padre

	padre.hijos.forEach ( function ( hijo ) {
	    hijo.elemento.reparto = {y0: y0, y1:y0+division};
	    posicionarNodo(hijo, p+1);
	    y0 += division;
	});

	p = r = y0 = division = null;
    };

    var posicionarNodo = function ( arbol, profundidad ) {
	var e = arbol.elemento;
	var r = e.reparto;
	var x = 10 + (150 * profundidad);
	var y = r.y0 + ((r.y1 - r.y0) / 2) - 11; // TODO: Quitar la constante de 11 por la mitad e la altura
	
	if ( e.nodo !== null ) {
	    e.nodo.setX(x);
	    e.nodo.setY(y);
	} else {
	    e.nodo = new Nodo(mm.escenario, mm.capaNodos, arbol,
			      { x: x, y: y, text: e.texto});
	}
	e = r = x = y = null;
    };

    var preRecorrido = function ( nodo ) {
	repartoEspacio(nodo);
    };

    var postRecorrido = function ( nodo ) {
        var elemento = nodo.elemento;
        nodo.hijos.forEach( function ( hijo ) {
            var arista = new Arista(mm.capaAristas, elemento, hijo.elemento);
	    mm.aristas.push(arista);
            arista = null;
        });
	elemento = null;
    };

    var getDevicePixelRatio = function () {
	if ( window.devicePixelRatio ) 
	    return window.devicePixelRatio;
	return 1;
    };

    var buscarArista = function ( padre, hijo ) {
	for ( var i = 0; i < mm.aristas.length; i ++ ) {
	    if ( padre.elemento.id === mm.aristas[i].elementoOrigen.id &&
		 hijo.elemento.id === mm.aristas[i].elementoDestino.id ) {
		return i;
	    }
	}
	return null;
    };

    var borrarArista = function ( padre, hijo ) {
	for ( var i = 0; i < mm.aristas.length; i ++ ) {
	    if ( padre.elemento.id === mm.aristas[i].elementoOrigen.id &&
		 hijo.elemento.id === mm.aristas[i].elementoDestino.id ) {
		return mm.aristas.splice(i,1);
	    }
	}
	return null;
    };

    var borrarHijo = function ( padre, hijo ) {
	for ( var i = 0; i < padre.hijos.length; i ++ ) {
	    if ( padre.hijos[i].elemento.id === hijo.elemento.id ) {
		return padre.hijos.splice(i,1);
	    }
	}
	return null;
    };

    mm.borrarNodo = function ( padre, borrado ) {
	// recorremos los hijos. i no incrementa por que después de borrar queda un elemento menos
	for ( var i = 0; i < borrado.hijos.length; i ) {
	    this.borrarNodo ( borrado, borrado.hijos[i] );
	}

	// borramos los elementos gráficos relacionados
	borrarArista ( padre, borrado );
	borrado.elemento.nodo.destroy();

	// importante borrar el hijo borrado para evitar errores en el pintado
	borrarHijo(padre, borrado);
	repartoEspacio(padre);
	mm.renderAristas();
	mm.capaNodos.draw();
	i = null;
    };

    var cambiarFoco = function  ( anterior, siguiente ) {
	anterior.elemento.nodo.quitarFoco();
	siguiente.elemento.nodo.ponerFoco();
    };


    return mm;
}(MM);


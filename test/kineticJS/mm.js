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
	this.eventos.on('add', this.foco, nuevo);
        this.foco.hijos.push(nuevo);
	nuevo = null;
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
    

    return mm;
}(MM);

// extendemos el modulo MM para el render
MM = function(mm) {
    var reparto = [];

    mm.aristas = [];

    var preRecorrido = function (nodo) {
	var p = mm.arbol.profundidad(nodo.elemento.id);
	var r = reparto[p][0];
	reparto[p] = reparto[p].slice(1, reparto[p].length);
	reparto[p+1] = [];
	var y0 = r.y0;
	var division = (r.y1 -r.y0) / nodo.hijos.length;
	division = (division < 22)?22:division;
	nodo.hijos.forEach(function () {
	    reparto[p+1].push({y0: y0, y1:y0+division});
	    y0 += division;
	});
	var x = 10 + (150 * p);
	var y = r.y0 + ((r.y1 - r.y0) / 2) - 11;
	if ( nodo.elemento.nodo !== null ) {
	    nodo.elemento.nodo.setX(x);
	    nodo.elemento.nodo.setY(y);
	} else {
            nodo.elemento.nodo = new Nodo(mm.escenario, mm.capaNodos, 
					  { x: x, y: y, text: nodo.elemento.texto});
	}
	nodo.elemento.reparto = r;
	p = r = y0 = division = x = y = null;
    };

    var postRecorrido = function (nodo) {
        var elemento = nodo.elemento;
        nodo.hijos.forEach(function (hijo) {
            var arista = new Arista(mm.capaAristas, elemento.nodo, hijo.elemento.nodo);
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

    mm.render = function (contenedor, width, height) {
        this.escenario = new Kinetic.Stage({
            container: contenedor,
            width: width,
            height: height
        });

	this.width = width;
	this.height = height;
	this.devicePixelRatio = getDevicePixelRatio();
        this.capaNodos = new Kinetic.Layer();
        this.capaAristas = new Kinetic.Layer();

        this.escenario.add(this.capaAristas);

	reparto.push([{y0: 0, y1: height}]);
	mm.arbol.subscribir('preOrden', preRecorrido);
	mm.arbol.subscribir('postPreOrden', postRecorrido);
        this.arbol.preOrden();

        this.escenario.add(this.capaNodos);

	var e = document.getElementById('posicionAristas');
	this.aristas.forEach(function (arista) {
	    e.innerHTML += "<br>" + arista.x1 + " - " + arista.y1 + " a " + 
		arista.x2 + " - " + arista.y2;
	});
	e = null;

	document.getElementById('posicionNodos').innerHTML = window.devicePixelRatio;

	this.eventos.subscribir('root', this.cambiarFoco);
	this.eventos.subscribir('padre', this.cambiarFoco);
	this.eventos.subscribir('next', this.cambiarFoco);
	this.eventos.subscribir('nextHermano', this.cambiarFoco);
	this.eventos.subscribir('prevHermano', this.cambiarFoco);
	this.eventos.subscribir('add', this.cambiarFoco);
	this.root();
    };

    mm.renderAristas = function () {
	this.capaAristas.clear();
	this.aristas.forEach(function(arista) {
	    arista.render();
	});
    };

    mm.nuevoNodo = function (padre, hijo) {
	var p = mm.arbol.profundidad(padre.elemento.id);
	var r = padre.elemento.reparto;
	var y0 = r.y0;
	var division = (r.y1 -r.y0) / padre.hijos.length;
	division = (division < 22)?22:division;
	padre.hijos.forEach(function (hijo) {
	    hijo.reparto = {y0: y0, y1:y0+division};
	    var x = 10 + (150 * p);
	    var y = r.y0 + ((r.y1 - r.y0) / 2) - 11;

	    y0 += division;
	});
	if ( nodo.elemento.nodo !== null ) {
	    nodo.elemento.nodo.setX(x);
	    nodo.elemento.nodo.setY(y);
	} else {
            nodo.elemento.nodo = new Nodo(mm.escenario, mm.capaNodos, 
					  { x: x, y: y, text: nodo.elemento.texto});
	}
	nodo.elemento.reparto = r;
	p = r = y0 = division = x = y = null;

	
	// var p = this.arbol.profundidad(this.foco.elemento.id);
	// reparto[p].push ( this.foco.elemento.reparto );
	// this.capaAristas.clear();
        // this.foco.preOrden();
	// this.renderAristas();
	// this.capaNodos.draw();
	// p = null;
    };

    mm.cambiarFoco = function  ( anterior, siguiente ) {
	anterior.elemento.nodo.quitarFoco();
	siguiente.elemento.nodo.ponerFoco();
    };

    return mm;
}(MM);




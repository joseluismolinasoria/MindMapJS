// Módulo principal
var MM = function () {

    var idNodos = 1;

    Arbol.prototype.elementEqual = function (id){
	return id === this.elemento.id;
    }

    var arbol = new Arbol({id: idNodos++, texto: 'Idea Central', nodo: null});

    var add = function (texto) {
        this.foco.hijos.push(new Arbol({id: idNodos++, texto: texto, nodo: null}));
    }.chain();

    var next = function () {
	if ( this.foco.ordenNodo !== 0 ) 
	    this.foco = this.foco.hijos[0];
    }.chain();

    var irPadre = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p != null )
	    this.foco = p;
	p = null;
    }.chain();

    var nextHermano = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	for ( var i = 0; i <= p.hijos.lenght; i++ ) {
	    if ( p.hijos[i].elementEqual(this.foco.elemento.id) )
		if ( i == p.hijos.lenght ) {
		    this.foco = p.hijos[0];
		} else {
		    this.foco = p.hijos[i+1];
		}
	    p = null;
	    return;
	}
    }.chain();


    var prevHermano = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	for ( var i = 0; i <= p.hijos.lenght; i++ ) {
	    if ( p.hijos[i].elementEqual(this.foco.elemento.id) )
		if ( i == 0 ) {
		    this.foco = p.hijos[p.hijos.length];
		} else {
		    this.foco = p.hijos[i+1];
		}
	    p = null;
	    return;
	}
    }.chain();

    var irRoot = function () {
	this.foco = arbol;
    }.chain();

    return {
        arbol: arbol,
        foco : arbol,
        add : add,
	next : next,
	irRoot : irRoot,
	irPadre : irPadre,
	nextHermano : nextHermano,
	prevHermano : prevHermano
    };
}();

// extendemos el modulo MM para el render
var MM = function(mm) {
    var reparto = [];
    
    mm.aristas = [];

    Arbol.prototype.preProceso = function () {
	var p = mm.arbol.profundidad(this.elemento.id);
	var r = reparto[p][0];
	reparto[p] = reparto[p].slice(1, reparto[p].length);
	reparto[p+1] = [];
	var y0 = r.y0;
	var division = r.y1 / this.hijos.length;
	division = (division < 22)?22:division;
	this.hijos.forEach(function () {
	    reparto[p+1].push({y0: y0, y1:y0+division});
	    y0 += division;
	});
	x = 10 + (150 * p);
	y = r.y0 + ((r.y1 - r.y0) / 2) - 11;
        this.elemento.nodo = new Nodo(mm, mm.escenario, mm.capaNodos, { x: x, y: y, text: this.elemento.texto});
	p = r = y0 = division = null;
    };

    Arbol.prototype.postProceso = function () {
        var elemento = this.elemento;
        this.hijos.forEach(function (hijo) {
            var arista = new Arista(mm.capaAristas, elemento.nodo, hijo.elemento.nodo);
	    mm.aristas.push(arista);
            arista = null;
        });
	elemento = null;
    };

    mm.render = function (contenedor, width, height) {
        this.escenario = new Kinetic.Stage({
            container: contenedor,
            width: width,
            height: height
        });

	this.width = width;
	this.height = height;
        this.capaNodos = new Kinetic.Layer();
        this.capaAristas = new Kinetic.Layer();
        this.capaMensajes = new Kinetic.Layer();

        this.escenario.add(this.capaAristas);

	reparto.push([{y0: 0, y1: height}]);
        mm.arbol.preOrden();

        this.escenario.add(this.capaNodos);
        this.escenario.add(this.capaMensajes);

	this.irRoot = this.irRoot.processable(this.quitarFoco, this.ponerFoco);
	this.next = this.next.processable(this.quitarFoco, this.ponerFoco);
	
    };

    mm.renderAristas = function () {
	this.capaAristas.clear();
	this.aristas.forEach(function(arista) {
	    arista.render();
	});
    };

    mm.ponerFoco = function () {
	mm.foco.elemento.nodo.ponerFoco();
    };

    mm.quitarFoco = function () {
	mm.foco.elemento.nodo.quitarFoco();
    };


    return mm;
}(MM);


window.onload = function () {
    MM.add('hijo1').add('hijo2').add('hijo3').next().add('hijo11').add('hijo12').next().add('hijo111').add('hijo112').add('hijo113').add('hijo114');
    MM.render('contenedor', 600, 400);
};


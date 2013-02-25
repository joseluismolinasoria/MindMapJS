// Módulo principal
MM = function (mm) {

    var idNodos = 1;

    MM.Arbol.prototype.elementEqual = function (id){
	return id === this.elemento.id;
    };

    mm.arbol = mm.foco = new MM.Arbol({id: idNodos++, texto: 'Idea Central', nodo: null});
    

    mm.add = function (texto) {
        this.foco.hijos.push(new MM.Arbol({id: idNodos++, texto: texto, nodo: null}));
    }.chain();

    mm.next = function () {
	if ( this.foco.ordenNodo() !== 0 ) 
	    this.foco = this.foco.hijos[0];
    }.chain();

    mm.irPadre = function () {
	if ( !this.foco )
	    return;
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p != null )
	    this.foco = p;
	p = null;
    }.chain();

    mm.nextHermano = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p == null ) return; 
	for ( var i = 0; i < p.hijos.length; i++ )
	    if ( p.hijos[i].elementEqual(this.foco.elemento.id) ){
		if ( i === p.hijos.length-1 ) 
		    this.foco = p.hijos[0];
		else 
		    this.foco = p.hijos[i+1];
		return;
	    }
	p = null;
    }.chain();


    mm.prevHermano = function () {
        var p = this.arbol.padreDe(this.foco.elemento.id);
	if ( p == null ) return;
	for ( var i = 0; i < p.hijos.length; i++ )
	    if ( p.hijos[i].elementEqual(this.foco.elemento.id) ) {
		if ( i === 0 )
		    this.foco = p.hijos[p.hijos.length-1];
		else
		    this.foco = p.hijos[i-1];
		return;
	    }
	p = null;
    }.chain();


    mm.irRoot = function () {
	this.foco = this.arbol;
    }.chain();

    

    return mm;
}(MM);

// extendemos el modulo MM para el render
MM = function(mm) {
    var reparto = [];

    mm.aristas = [];

    MM.Arbol.prototype.preProceso = function () {
	var p = mm.arbol.profundidad(this.elemento.id);
	var r = reparto[p][0];
	reparto[p] = reparto[p].slice(1, reparto[p].length);
	reparto[p+1] = [];
	var y0 = r.y0;
	var division = (r.y1 -r.y0) / this.hijos.length;
	division = (division < 22)?22:division;
	this.hijos.forEach(function () {
	    reparto[p+1].push({y0: y0, y1:y0+division});
	    y0 += division;
	});
	var x = 10 + (150 * p);
	var y = r.y0 + ((r.y1 - r.y0) / 2) - 11;
	if ( this.elemento.nodo !== null ) {
	    this.elemento.nodo.setX(x);
	    this.elemento.nodo.setY(y);
	} else
            this.elemento.nodo = new Nodo(mm.escenario, mm.capaNodos, { x: x, y: y, text: this.elemento.texto});
	this.elemento.reparto = r;
	p = r = y0 = division = x = y = null;
    };

    MM.Arbol.prototype.postProceso = function () {
        var elemento = this.elemento;
        this.hijos.forEach(function (hijo) {
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
        this.arbol.preOrden();

        this.escenario.add(this.capaNodos);

	var e = document.getElementById('posicionAristas');
	this.aristas.forEach(function (arista) {
	    e.innerHTML += "<br>" + arista.x1 + " - " + arista.y1 + " a " + 
		arista.x2 + " - " + arista.y2;
	});
	e = null;

	document.getElementById('posicionNodos').innerHTML = window.devicePixelRatio;

	this.irRoot = this.irRoot.processable(this.quitarFoco, this.ponerFoco);
	this.irPadre = this.irPadre.processable(this.quitarFoco, this.ponerFoco);
	this.next = this.next.processable(this.quitarFoco, this.ponerFoco);
	this.nextHermano = this.nextHermano.processable(this.quitarFoco, this.ponerFoco);
	this.prevHermano = this.prevHermano.processable(this.quitarFoco, this.ponerFoco);
	this.add = this.add.processable(function(){}, this.renderDesdeFoco);

	this.irRoot();
    };

    mm.renderAristas = function () {
	this.capaAristas.clear();
	this.aristas.forEach(function(arista) {
	    arista.render();
	});
    };

    mm.renderDesdeFoco = function () {
	var p = this.arbol.profundidad(this.foco.elemento.id);
	reparto[p].push ( this.foco.elemento.reparto );
	this.capaAristas.clear();
        this.foco.preOrden();
	this.renderAristas();
	this.capaNodos.draw();
	p = null;
    };

    mm.ponerFoco = function () {
	mm.foco.elemento.nodo.ponerFoco();
    };

    mm.quitarFoco = function () {
	mm.foco.elemento.nodo.quitarFoco();
    };


    return mm;
}(MM);




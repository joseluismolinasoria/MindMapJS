// Módulo principal
MM = function (mm) {

    var idNodos = 1;

    MM.Arbol.prototype.elementEqual = function ( id ) {
        return id === this.elemento.id;
    };

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

        this.eventos = new MM.PubSub();
        this.arbol = this.foco = new MM.Arbol(
            { id: idNodos++,
              texto: ideaCentral || 'Idea Central',
              nodo: null }
        );
        this.ponerFoco ( this.arbol );
        this.eventos.on ( 'nuevo/post' );
    };

    mm.add = function ( texto ) {
        texto = texto || "Nuevo";
        var nuevo = new MM.Arbol ( { id: idNodos++, texto: texto, nodo: null } );
        this.foco.hijos.push ( nuevo );
        this.eventos.on ( 'add', this.foco, nuevo );
        nuevo = null;
    }.chain();

    mm.borrar = function () {
        if ( this.arbol === this.foco ) {
            this.nuevo();
            return;
        }

        var borrar = this.foco;
        this.padre();
        this.arbol.borrar ( borrar.elemento.id );
        this.eventos.on ( 'borrar', this.foco, borrar );
        borrar = null;
    }.chain();

    mm.next = function () {
        if ( this.foco.ordenNodo() !== 0 ) {
            this.eventos.on ( 'next', this.foco, this.foco.hijos[0] );
            this.ponerFoco ( this.foco.hijos[0] );
        }
    }.chain();

    mm.padre = function () {
        if ( !this.foco )
            return;
        var padre = this.arbol.padreDe ( this.foco.elemento.id );
        if ( padre != null ) {
            this.eventos.on ( 'padre', this.foco, padre );
            this.ponerFoco ( padre );
        }
        padre = null;
    }.chain();

    mm.nextHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre == null ) { return; }

        for ( var i = 0; i < padre.hijos.length; i++ )
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

        padre = null;
    }.chain();

    mm.prevHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre == null ) { return; }

        for ( var i = 0; i < padre.hijos.length; i++ )
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
        padre = null;
    }.chain();

    mm.lastHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre == null ) { return; }

        if ( padre.hijos.length >= 1 ) {
            this.ponerFoco ( padre.hijos[padre.hijos.length - 1] );
        }
        padre = null;
    }.chain();


    mm.root = function () {
        this.eventos.on ( 'root', this.foco, this.arbol );
        this.ponerFoco ( this.arbol );
    }.chain();


    mm.ponerFoco = function ( arbol ) {
        this.eventos.on ( 'ponerFoco', this.foco, arbol );
        this.foco = arbol;
    };

    mm.nuevo( "Idea Central" );

    mm.render = null;

    mm.renderizar = function ( contenedor, claseNodo, claseArista ) {
	mm.render = new MM.Render ( contenedor, claseNodo, claseArista );
	mm.render.renderizar();
    };


    mm.cargarFreeMind = function () {
	var importer = new MM.importar.FreeMind();

	var susR = MM.importar.evento.suscribir("freeMind/raiz", function () {
            MM.render.desuscribrirEventos();
	});
	var susP = MM.importar.evento.suscribir("freeMind/procesado", function () {
            MM.render.dibujar();
	});

	var input = MM.DOM.create('input', {
	    'type' : 'file',
	    'id'   : 'ficheros'
	});
	input.addEventListener("change", function(evt) {
	    if ( input.files.length !== 0 )
		importer.cargar(input.files[0]);
	}, false);
	input.click();

    };


    return mm;
}(MM);

MM.Render = function() {
    var render = MM.Class.extend({
        init : function (contenedor, claseNodo, claseArista) {
            this.width = Math.floor((document.getElementById(contenedor).clientWidth / 100) * 98); // 98%
            this.height = Math.floor((document.getElementById(contenedor).clientHeight / 100) * 98); // 98%
            this.devicePixelRatio = getDevicePixelRatio();
	    this.Nodo = claseNodo || MM.Globo;
	    this.Arista = claseArista || MM.Arista;

            this.escenario = new Kinetic.Stage({
                container: contenedor,
                width: this.width,
                height: this.height
            });

            this.capaGrid = new Kinetic.Layer();
            this.capaNodos = new Kinetic.Layer();
            this.capaAristas = new Kinetic.Layer();
            this.escenario.add(this.capaGrid);
            this.escenario.add(this.capaAristas);
            this.escenario.add(this.capaNodos);
        }
    });

    render.prototype.aristas = [];
    render.prototype.suscripciones = [];

    render.prototype.dibujar = function () {
	this.capaGrid.removeChildren();
        new Grid(this.capaGrid, this.width, this.height);
        new Borde(this.capaGrid, this.width, this.height);

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
        idSusPre = idSusPost = null;
    };

    render.prototype.renderizar = render.prototype.dibujar;

    render.prototype.suscribrirEventos = function ( ) {
	this.desuscribrirEventos(); // evitamos dobles suscripciones
        // this.eventos.suscribir('root', cambiarFoco);
        // this.eventos.suscribir('padre', cambiarFoco);
        // this.eventos.suscribir('next', cambiarFoco);
        // this.eventos.suscribir('nextHermano', cambiarFoco);
        // this.eventos.suscribir('prevHermano', cambiarFoco);
        this.suscripciones.push ( MM.eventos.suscribir('ponerFoco', cambiarFoco) );
        this.suscripciones.push ( MM.eventos.suscribir('add', this.nuevoNodo, this) );
        this.suscripciones.push ( MM.eventos.suscribir('borrar', this.borrarNodo, this) );
        this.suscripciones.push ( MM.eventos.suscribir('nuevo/pre', function () {
            MM.arbol.elemento.nodo.destroy();
        }) );
        this.suscripciones.push ( MM.eventos.suscribir('nuevo/post', function () {
            this.dibujar();
        }, this) );
    };

    render.prototype.desuscribrirEventos = function ( ) {
        this.suscripciones.forEach ( function ( idSus ) {
            MM.eventos.desSuscribir(idSus);
        });
        this.suscripciones = [];
    };

    render.prototype.renderAristas = function () {
        if (!this.capaAristas)
            return;
        this.capaAristas.clear();
        this.aristas.forEach(function (arista) {
            arista.render();
        });
    };

    render.prototype.nuevoNodo = function (padre, hijo) {
        this.repartoEspacio(padre);
        this.aristas.push(new this.Arista(this.capaAristas, padre.elemento, hijo.elemento, '3'));
        this.renderAristas();
        this.capaNodos.draw();
    };

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
        if ( window.devicePixelRatio )
            return window.devicePixelRatio;
        return 1;
    };

    render.prototype.buscarArista = function (padre, hijo) {
        for (var i = 0; i < this.aristas.length; i++) {
            if (padre.elemento.id === this.aristas[i].elementoOrigen.id &&
                hijo.elemento.id === this.aristas[i].elementoDestino.id) {
                return i;
            }
        }
        return null;
    };

    render.prototype.borrarArista = function (padre, hijo) {
        for (var i = 0; i < this.aristas.length; i++) {
            if (padre.elemento.id === this.aristas[i].elementoOrigen.id &&
                hijo.elemento.id === this.aristas[i].elementoDestino.id) {
                return this.aristas.splice(i, 1);
            }
        }
        return null;
    };

    render.prototype.borrarHijo = function (padre, hijo) {
        for (var i = 0; i < padre.hijos.length; i++) {
            if (padre.hijos[i].elemento.id === hijo.elemento.id) {
                return padre.hijos.splice(i, 1);
            }
        }
        return null;
    };

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

    var cambiarFoco = function (anterior, siguiente) {
        if ( anterior !== null && anterior.elemento.nodo !== null )
            anterior.elemento.nodo.quitarFoco();
        if ( siguiente !== null && siguiente.elemento.nodo !== null )
            siguiente.elemento.nodo.ponerFoco();
    };

    return render;
}();


MM.randomHSLColor = function () {
    var rand = function (max, min) {
	return parseInt(Math.random() * (max-min+1), 10) + min;
    };

    var h = rand(1, 360);  // Tonalidad 1-360
    var s = rand(30, 100); // saturación 30-100%
    var l = rand(20, 50);  // brillo 20-50%
    return { h: h, s: s, l:l };
};

// definición de atajos de teclado
(function(){
    MM.teclado.atajos.add('left', MM.padre, MM);
    MM.teclado.atajos.add('right', MM.next, MM);
    MM.teclado.atajos.add('up', MM.prevHermano, MM);
    MM.teclado.atajos.add('down', MM.nextHermano, MM);
    MM.teclado.atajos.add('ins', MM.add, MM);
    MM.teclado.atajos.add('del', MM.borrar, MM);
    MM.teclado.atajos.add('home', MM.root, MM);
}());

// MM.escenario.setScale(1.5);
// Ojo para escalar bien hay que escalar también las aristas.

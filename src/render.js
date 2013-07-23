/**
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

            this.capaTransparencia = new Kinetic.Layer({visible : false});

            this.escenario.add(this.capaGrid);
            this.escenario.add(this.capaAristas);
            this.escenario.add(this.capaNodos);
	    this.escenario.add(this.capaTransparencia);

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
	MM.ponerFoco(hijo);
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
	if ( enEdicion ) 
	    MM.render.editar();
        if ( anterior !== null && anterior.elemento.nodo !== null ) {
            anterior.elemento.nodo.quitarFoco();
	}
        if ( siguiente !== null && siguiente.elemento.nodo !== null ) {
            siguiente.elemento.nodo.ponerFoco();
	}
    };

    /**
     * @desc Entra y sale de modo de edición. 
     * @memberof MM.Render 
     * @method editar
     * @inner
     */
    var enEdicion = false;
    render.prototype.editar = function () {
	var t = MM.render.capaTransparencia.canvas.element;
	if ( enEdicion ) {
	    enEdicion = false;
	    t.style.background = 'transparent';
	    t.style.opacity = 0; 
	    t.style.display = 'none'; 
	    MM.foco.elemento.nodo.cerrarEdicion();
	} else {
	    enEdicion = true;
	    MM.foco.elemento.nodo.editar();
	    t.style.background = 'white';
	    t.style.opacity = 0.5;
 	    t.style.display = 'block'; 
	}
	t = null;
    };

    /**
     * @desc Indicar si el nodo actual
     * @memberof MM.Render
     * @return Devuelve true cuando el nodo actual ha entrado en modo edición y false en otro caso.
     * @method modoEdicion
     * @inner
     */    
    render.prototype.modoEdicion = function() {
	return enEdicion;
    };

    render.prototype.insertarSaltoDeLinea = function () {
	if ( enEdicion ) {
	    var editor = MM.foco.elemento.nodo.editor;
	    editor.value = editor.value + "\n";
	    editor.style.height = (parseFloat(editor.style.height) + 1.25) + "em";
	}
	editor = null;
    };

    return render;
}();


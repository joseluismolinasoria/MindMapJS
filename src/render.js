/**
 * @file render.js Implementación del render del MM
 * @author José Luis Molina Soria
 * @version 20130807
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
                height: this.height,
                draggable: true,
                dragBoundFunc: function (pos) {
                    MM.render.offset = pos;
                    return pos;
                }
            });

            //this.escenario.on('dragend', MM.Class.bind(this, this.dibujar) );
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
        this.dibujar();
        this.suscribrirEventos();
        MM.root();
        MM.definirAtajos();
    };


    var numLineas = function (texto) {
        return texto.split("\n").length;
    };

    var minimaAlturaNodo = function ( nodo ) {
        return 35 + (numLineas(nodo.elemento.texto)-1) * 15;
    };

    render.prototype.calcularAlturas = function (arbol) {
        var minAltura = function (a) {
            if ( a.esHoja() || a.elemento.plegado ) {
                return minimaAlturaNodo(a);
            }
            var p = 0;
            a.hijos.forEach(function (h) {
                p = p + minAltura(h);
            });
            return p;
        };

        var altura = 0;
        if ( arbol.elemento.id === MM.arbol.elemento.id ) {
            altura = minAltura(arbol);
            altura = ( this.height <= altura ) ? altura : this.height / this.getEscala();
        } else {
            altura = arbol.elemento.reparto.y1 - arbol.elemento.reparto.y0;
        }

        var alturaHijos = arbol.hijos.map(minAltura);
        var suma = alturaHijos.reduce ( function(ac, x) { return ac + x; }, 0 );
        var division = (altura - suma) / arbol.hijos.length; 
        alturaHijos = alturaHijos.map(function(x) { return x+division; });

        minAltura = suma = division = null;
        return { padre: altura, hijos: alturaHijos };
    };

    /**
     * @desc Dibuja el MindMap a partir del estado actual del árbol. 
     * @memberof MM.Render 
     * @method dibujar
     * @instance
     */    
    render.prototype.dibujar = function () {
        var arbol = MM.arbol;
        var idSusPre = arbol.suscribir('preOrden', MM.Class.bind(this, preRecorrido) );
        var idSusPost = arbol.suscribir('postPreOrden', MM.Class.bind(this, postRecorrido) );
        arbol.preOrden();
        arbol.desSuscribir(idSusPre);
        arbol.desSuscribir(idSusPost);
        arbol = idSusPre = idSusPost = null;
        this.escenario.draw();
        this.renderAristas();
    };

    var preRecorrido = function (nodo) {
        this.repartoEspacio(nodo);
    };

    var postRecorrido = function (nodo) {
        var elemento = nodo.elemento;
        nodo.hijos.forEach(function (hijo) {
            var arista = this.buscarArista(nodo, hijo);
            if ( arista === null ) {
                arista = new this.Arista(this.capaAristas, elemento, hijo.elemento, '3');
                this.aristas.push(arista);
            }
            arista = null;
        }, this);
        elemento = null;
    };


    /**
     * @desc Se encarga de repartir el espacio entre los nodos hijos de un nodo padre dado. 
     *       Cada Nodo tiene un espacio asignado en el que puede ser renderizado.
     * @param {MM.Arbol} arbol Nodo padre de los nodos que deseamos organizar
     * @memberof MM.Render 
     * @method repartoEspacio
     * @inner
     */
    render.prototype.repartoEspacio = function (arbol) {
        var reparto = arbol.elemento.reparto;
        var alturas = this.calcularAlturas (arbol);
        if ( arbol.elemento.id === MM.arbol.elemento.id ) {
            arbol.elemento.reparto = reparto = {y0: 0, y1: alturas.padre, 
                                                xPadre : 0,  widthPadre: 0 };
            this.posicionarNodo ( arbol );
        }

        var y0 = reparto.y0;
        var widthPadre = arbol.elemento.nodo.getWidth();
        var xPadre = arbol.elemento.nodo.getX();
        arbol.hijos.forEach(function (hijo, i) {
            hijo.elemento.reparto = {y0: y0, y1: y0 + alturas.hijos[i], 
                                     xPadre : xPadre,  widthPadre: widthPadre };
            this.posicionarNodo ( hijo );
            y0 += alturas.hijos[i];
        }, this);
         
        reparto = y0 = xPadre = widthPadre = null;
    };

    /**
     * @desc Posiciona un nodo del arbol en función de la profundidad. Si el nodo no 
     *       esta renderizado lo renderiza dentro del espacio asignado para él. 
     * @param {MM.Arbol} arbol Nodo del arbol que deseamos prosicionar
     * @memberof MM.Render 
     * @method posicionarNodo
     * @inner
     */
    render.prototype.posicionarNodo = function (arbol) {
        var elemento = arbol.elemento;
        var reparto = elemento.reparto;
        var visible = true;
        var x = 20;
        if ( arbol.elemento.id !== MM.arbol.elemento.id ) {
            x = reparto.xPadre + reparto.widthPadre + 75;
            var padre = MM.arbol.padreDe(elemento.id);
            visible = !(MM.arbol.padreDe(elemento.id).elemento.plegado && arbol.elemento.plegado);
        }       
        var y = reparto.y0 + ( (reparto.y1 - reparto.y0) / 2) - (minimaAlturaNodo(arbol) / 2); 

        if (elemento.nodo === null) {
            elemento.nodo = new this.Nodo(this, arbol, { x: x, y: y, text: elemento.texto});
        }

        y = reparto.y0 + ( (reparto.y1 - reparto.y0) / 2) - (elemento.nodo.getHeight() / 2); 
        elemento.nodo.setX(x);
        elemento.nodo.setY(y);
        elemento.nodo.setVisible(visible);

        elemento = reparto = x = y = null;
    };

    /**
     * @desc Método que se encarga de realizar y registrar las suscripciones a eventos del MM.
     * @memberof MM.Render 
     * @method suscribirEventos
     * @instance
     */
    render.prototype.suscribrirEventos = function ( ) {
        this.desuscribrirEventos(); // evitamos dobles suscripciones
        var sus = this.suscripciones;
        var e = MM.eventos;
        sus.push ( e.suscribir('ponerFoco', cambiarFoco) );
        sus.push ( e.suscribir('add', this.nuevoNodo, this) );
        sus.push ( e.suscribir('borrar', this.borrarNodo, this) );
        sus.push ( e.suscribir('nuevo/pre', function () {
            MM.arbol.elemento.nodo.destroy();
        }) );
        sus.push ( e.suscribir('nuevo/post', function () {
            this.renderizar();
        }, this) );
        this.contenedor.addEventListener("mousewheel", handlerWheel, false);
        this.contenedor.addEventListener("DOMMouseScroll", handlerWheel, false);
        sus = e = null;
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
        this.contenedor.removeEventListener("mousewheel", handlerWheel);
        this.contenedor.removeEventListener("DOMMouseScroll", handlerWheel);
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
            arista.redraw();
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
        this.dibujar();
        MM.ponerFoco(hijo);
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
        var a;
        for (var i = 0; i < this.aristas.length; i++) {
            a = this.aristas[i];
            if (padre.elemento.id === a.elementoOrigen.id && hijo.elemento.id === a.elementoDestino.id) {
                return i;
            }
        }
        a = null;
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
        var a;
        for (var i = 0; i < this.aristas.length; i++) {
            a = this.aristas[i];
            if (padre.elemento.id === a.elementoOrigen.id && hijo.elemento.id === a.elementoDestino.id) {
                a.destroy();
                return this.aristas.splice(i, 1);
            }
        }
        a = null;
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
        this.dibujar();
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
        MM.render.escenario.draw();
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
        if ( enEdicion ) {
            MM.render.editar();
        }
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
        MM.atajosEnEdicion ( enEdicion );
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
            MM.foco.elemento.nodo.setTamanoEditor();
            editor = null;
        }
    };

    var handlerWheel = function (e) {
      var positivo = (e.wheelDelta || -e.detail) > 0;
      if ( positivo ) { // rueda hacia delante
        MM.render.zoomIn();
      } else { // rueda hacia atrás
        MM.render.zoomOut();
      }
    };

   
    return render;
}();


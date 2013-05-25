/**
 * @file mm.js Implementación del MM
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
     * @param {string} ideaCentral Texto de la idea central. Por cefecto 'Idea Central'
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
        texto = texto || "Nuevo";
        var nuevo = new MM.Arbol ( { id: idNodos++, texto: texto, nodo: null } );
        this.foco.hijos.push ( nuevo );
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
        if ( !this.foco )
            return;
        var padre = this.arbol.padreDe ( this.foco.elemento.id );
        if ( padre != null ) {
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

    /** 
     * @desc Cambia el foco al último hermano
     * @return {MM} Al ser Chainable devuelve this (MM).
     * @method lastHermano
     * @memberof MM
     * @instance
     */
    mm.lastHermano = function () {
        var padre = this.arbol.padreDe ( this.foco.elemento.id );

        if ( padre == null ) { return; }

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

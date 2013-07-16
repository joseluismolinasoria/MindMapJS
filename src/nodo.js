/**
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

        var bindEditar = MM.Class.bind(MM.render, MM.render.editar);
        var bindNOP = MM.Class.bind(this, this.nop);
        var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        this.group.on('click tab', bindPonerFoco);
        this.group.on('dblclick dbltap', bindEditar);
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
        this.input = new MM.DOM.create('input',
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
        
        this.input.onblur = MM.Class.bind (MM.render, MM.render.editar);
        this.escenario.content.appendChild(this.input);
        this.input.select();
        this.input.focus();
    },

    cerrarEdicion : function ( ) {
	this.arbol.elemento.texto = this.input.value;
        this.group.setWidth(this.kText.getWidth());
        this.group.setHeight(this.kText.getHeight());
        this.line.setPoints ( [ { x: 0, y: this.kText.getHeight() }, 
				{ x: this.kText.getWidth(), y: this.kText.getHeight() } ] );
        MM.teclado.atajos.activo = true;
        this.input.remove();
	delete this.input;
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

        // var bindEditar = MM.Class.bind(this, this.editar);
        // var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        // this.group.on('click', bindPonerFoco);
        // this.group.on('dblclick', bindEditar);
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
        this.textarea = new MM.DOM.create('textarea',
            { 'id': 'editNodo',
                'innerHTML': this.getText(),
                'style': 'position: absolute; ' +
                    'top : ' + ((this.getY()-5) * MM.render.getEscala()) + 'px; ' +
                    'left: ' + ((this.getX()-5) * MM.render.getEscala())  + 'px; ' +
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

        this.textarea.onblur = MM.Class.bind (MM.render, MM.render.editar);
        this.escenario.content.appendChild(this.textarea);
        this.textarea.select();
        this.textarea.focus();
    },


    cerrarEdicion : function () {
	this.textarea.onblur = this.nop;
	MM.undoManager.add ( new MM.comandos.Editar ( this.arbol.elemento.id, 
						      this.arbol.elemento.texto, 
						      this.textarea.value ) );
        this.arbol.elemento.texto = this.textarea.value;
        this.setText(this.textarea.value);
        this.group.setWidth(this.kText.getWidth());
        this.group.setHeight(this.kText.getHeight());
        this.rect.setPoints ( [ { x: 0, y: 0  }, 
                                { x: this.kText.getWidth(), y: 0 }, 
                                { x: this.kText.getWidth(), y: this.kText.getHeight() }, 
                                { x: 0, y: this.kText.getHeight() } ] );
        this.textarea.remove();
	delete this.textarea;
        MM.ponerFoco(this.arbol);
        window.focus();
    }


});

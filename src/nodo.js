/**
 * @file nodo.js Librería para renderizar nodos del MM.
 * @author José Luis Molina Soria
 * @version 20130723
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
        fontSize: 13,
        fontFamily: 'helvetica',
        fill: '#555',
        width: 'auto',
        padding: 5
    },

    init: function (render, arbol, propiedades) {
        this.render = render;
        this.escenario = render.escenario;
        this.capa = render.capaNodos;
        this.arbol = arbol;
        this.hslColor = MM.color.randomHslColor();
        this.colorFondo = MM.color.hslToCSS(this.hslColor, 40);
        this.color = MM.color.hslToCSS(this.hslColor);
        this.aristas = [];

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
console.debug('drag Nodo');
MM.ponerFoco(arbol);
MM.render.renderAristas();
                return pos;
            }
        });

        var w = this.kText.getWidth();
        var h = this.kText.getHeight();

        this.rect = new Kinetic.Blob({
            points: [ { x: 0, y: 0 }, 
                      { x: w+17, y: 0 }, 
                      { x: w+17, y: h }, 
                      { x: 0, y: h } ],
            stroke: this.color,
            strokeWidth: 2,
            fill: this.colorFondo,
            shadowColor: this.color,
            shadowBlur: 4,
            shadowOffset: {x:4, y:4},
            shadowOpacity: 0.7,
            tension: 0.3
        });

        var t = 10;
        var x = w + 5;
        var y = (h - t) / 2;
        var puntos = this.arbol.elemento.plegado?
                [x, y, x + t, y, x + (t*0.5), y + t]:
                [x, y, x, y + t, x + t, y + (t *0.5)];
        this.triangle = new Kinetic.Polygon({
            points: puntos,
            fill: this.color,
            visible: !this.arbol.esHoja()
        });

        this.triangle.on('mouseover', MM.Class.bind ( this, function() {
            MM.render.contenedor.style.cursor = 'pointer';
            if ( this.arbol.elemento.plegado ) {
                MM.render.contenedor.setAttribute('title', 'desplegar');
            } else {
                MM.render.contenedor.setAttribute('title', 'plegar');
            }
        }));

        this.triangle.on('mouseout', MM.Class.bind ( this, function() {
            MM.render.contenedor.style.cursor = 'default';
            MM.render.contenedor.setAttribute('title', '');
        }));

        var clickTriangulo = MM.Class.bind ( this, function(evt) {
            MM.render.contenedor.style.cursor = 'default';
            MM.render.contenedor.setAttribute('title', '');
            MM.ponerFoco ( this.arbol );
            MM.plegarRama(!this.arbol.elemento.plegado);
            evt.cancelBubble = true;
        });
        this.triangle.on('click', clickTriangulo );
        this.triangle.on('tap', clickTriangulo );
        this.line = new Kinetic.Line({
            points: [{x:0, y: this.kText.getHeight()},
                     {x:this.kText.getWidth(), y:this.kText.getHeight()}],
            stroke: this.color,
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round'
        });
        this.group.add(this.rect);
        this.group.add(this.triangle);
        this.group.add(this.line);
        this.group.add(this.kText);
        this.capa.add(this.group);
        this.rect.hide();

        var bindEditar = MM.Class.bind(MM.render, MM.render.editar);
        var bindNOP = MM.Class.bind(this, this.nop);
        var bindPonerFoco = MM.Class.bind(this, function(evt) {
            MM.ponerFoco(this.arbol);
        });
        this.group.on('click', bindPonerFoco);
        this.group.on('tap', bindPonerFoco);
        this.group.on('dblclick', bindEditar);
        this.group.on('dbltap', bindEditar);
        h = w = t = x = y = null;
    },


    /**
     * @desc Establece el foco en el nodo resaltándolo.
     */
    ponerFoco : function () {
        this.kText.setFontStyle('bold');
        this.kText.setText('<' + this.arbol.elemento.texto + '>' );
        this.group.draw();
    },

    /**
     * @desc Quita el foco del nodo.
     */
    quitarFoco : function () {
        this.kText.setFontStyle('normal');
        this.kText.setLineHeight(1);
        this.kText.setText(this.arbol.elemento.texto);
        this.group.draw();
    },

    /**
     * @desc Pone el nodo visible o lo oculta en función del valor pasado
     * @param {Boolean} valor Visible Si / No.
     */
    setVisible : function (valor) {
        var w = this.kText.getWidth();
        var h = this.kText.getHeight();
        var t = 10;
        var x = w + 5;
        var y = (h - t) / 2;
        this.triangle.setPoints ( this.arbol.elemento.plegado?
                [x, y, x + t, y, x + (t*0.5), y + t]:
                [x, y, x, y + t, x + t, y + (t *0.5)]);

        this.triangle.setVisible(!this.arbol.esHoja());
        this.group.setVisible(valor);
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
     * @desc Pone el nodo el modo edición.
     */
    editar: function () {
        var texto = this.getText();
        var fc = this.calcularFilasColumnas(texto);
        var top = (this.getY() * MM.render.getEscala() + MM.render.offset.y - 5); 
        var left = (this.getX() * MM.render.getEscala() + MM.render.offset.x - 5);

        this.editor = new MM.DOM.create('textarea',
            { 'id': 'editNodo',
              'innerHTML': texto,
              'rows' :  fc.filas,
              'cols' : fc.columnas + 1,
              'style': 'position: absolute; ' +
                    'top : ' + top + 'px; ' +
                    'left: ' + left  + 'px; ' +
                    'height: auto;' +
                    'border: 3px solid ' + this.color + '; ' +
                    'border-radius: 5px;' +
                    'background-color: ' + this.colorFondo + '; ' +
                    'color: ' + this.color + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; resize:true;'
            });
        this.handlerBlur = MM.Class.bind (MM.render, MM.render.editar);
        this.handlerKeyUp = MM.Class.bind (this, this.setTamanoEditor);
        this.editor.addEventListener('blur', this.handlerBlur );
        this.editor.addEventListener('keyup', this.handlerKeyUp );
        this.escenario.content.appendChild(this.editor);
        this.editor.select();
        this.editor.focus();
        texto = fc = top = left = null;
    },

    /**
     * @desc Cierra el modo de edición
     */
    cerrarEdicion : function () {
        this.editor.removeEventListener('blur', this.handlerBlur);
        this.editor.removeEventListener('keyup', this.handlerKeyUp);
        if ( this.arbol.elemento.texto !== this.editor.value ) {
            MM.undoManager.add ( new MM.comandos.Editar ( this.arbol.elemento.id, 
                                                          this.arbol.elemento.texto, 
                                                          this.editor.value ) );
        }
        this.arbol.elemento.texto = this.editor.value;
        this.setText(this.editor.value);
        var w = this.kText.getWidth();
        var h = this.kText.getHeight();
        this.group.setWidth(w);
        this.group.setHeight(h);

        this.rect.setPoints ( [ { x: 0, y: 0 }, 
                                { x: w+17, y: 0 }, 
                                { x: w+17, y: h }, 
                                { x: 0, y: h } ] );

        var t = 10;
        var x = w + 5;
        var y = (h - t) / 2;
        this.triangle.setPoints ( this.arbol.elemento.plegado?
                                  [x, y, x + t, y, x + (t*0.5), y + t]:
                                  [x, y, x, y + t, x + t, y + (t *0.5)]);
        this.editor.remove();
        delete this.editor;
        MM.ponerFoco(this.arbol);
        MM.render.dibujar(MM.arbol);
        window.focus();
        t = x = y = w = h = null;
    },

    calcularFilasColumnas : function ( texto ) {
        var lineas = texto.split("\n");
        var c = 0, f = lineas.length;
        lineas.forEach( function(linea) {
            if ( linea.length > c ) { c = linea.length; }
        });
        lineas = null;
        return {filas: f, columnas: c };
    },

    setTamanoEditor : function() {
        var tamano = this.calcularFilasColumnas(this.editor.value);
        this.editor.setAttribute('rows', tamano.filas );
        this.editor.setAttribute('cols', tamano.columnas );
        tamano = null;
    },

    nop: function () { },

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
        propiedades.fontSize = 12;
        this._super(render, arbol, propiedades);

        this.line.hide();
        this.rect.show();
    },

    /**
     * @desc Pone el foco el nodo
     */
    ponerFoco : function () {
        this.rect.setStroke(this.colorFondo);
        this.rect.setFill(this.color);
        this.rect.setShadowColor(this.color);
        this.kText.setFill(this.colorFondo);
        this.triangle.setFill(this.colorFondo);
        this.group.draw();
    },

    /**
     * @desc Quita el foco del nodo
     */
    quitarFoco : function () {
        this.rect.setStroke(this.color);
        this.rect.setFill(this.colorFondo);
        this.rect.setShadowColor(this.colorFondo);
        this.kText.setFill(this.color);
        this.triangle.setFill(this.color);
        this.group.draw();
    }

});

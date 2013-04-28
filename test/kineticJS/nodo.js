MM.NodoSimple = Mensaje.extend({
    defecto: {
        x: 0,
        y: 0,
        text: '',
        fontSize: 14,
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
	this.hslColor = MM.randomHSLColor();
	this.colorFondo = 'hsl(' + this.hslColor.h + ',' + this.hslColor.s + '%,' + (this.hslColor.l+40) + '%)';
	this.color = 'hsl(' + this.hslColor.h + ',' + this.hslColor.s + '%,' + this.hslColor.l + '%)';

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

	this.line = new Kinetic.Line({
            points: [{x:0, y: this.kText.getHeight()},
		     {x:this.kText.getWidth(), y:this.kText.getHeight()}],
            stroke: this.color,
            strokeWidth: 3,
            lineCap: 'round',
            lineJoin: 'round'
	});
	this.group.add(this.line);
        this.group.add(this.kText);
        this.capa.add(this.group);

        var bindEditar = MM.Class.bind(this, this.editar);
        var bindNOP = MM.Class.bind(this, this.nop);
	var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        this.group.on('click tap', bindPonerFoco);
        this.group.on('dblclick  dbltap', bindEditar);
        this.group.on('mouseout', bindNOP);
        this.group.on('mousemove', bindNOP);
        this.group.on('mousedown', bindNOP);
        this.group.on('mouseup', bindNOP);
        this.group.on('mouseenter', bindNOP);
        this.group.on('mouseLeave', bindNOP);
        this.group.on('dragstart', bindNOP);
        this.group.on('dragend', bindNOP);
    },


    ponerFoco : function () {
//	this.ktext.setFill('#5268F2');
//	this.ktext.setShadowColor('blue');
	this.capa.draw();
    },

    quitarFoco : function () {
//	this.ktext.setFill('#555');
//	this.ktext.setShadowColor('black');
	this.capa.draw();
    },

    setX : function (x) {
	this.group.setX(x);
    },

    getX : function () {
	return this.group.getX();
    },

    setY : function (y) {
	this.group.setY(y);
    },

    getY : function () {
	return this.group.getY();
    },

    getWidth: function () {
	return this.group.getWidth();
    },

    getHeight: function () {
	return this.group.getHeight();
    },

    editar: function () {
	MM.teclado.atajos.activo = false;
        var textarea = new MM.DOM.create('textarea',
            { 'id': 'editNodo',
                'innerHTML': this.getText(),
                'style': 'position: absolute; ' +
                    'top : ' + this.getY() + 'px; ' +
                    'left: ' + this.getX() + 'px; ' +
                    'width: ' + this.getWidth() + 'px; ' +
                    'height: ' + this.getHeight() + 'px; ' +
                    'border: 3px solid ' + this.color + '; ' +
                    'border-radius: 5px' +
                    'background-color: ' + this.colorFondo + '; ' +
                    'color: ' + this.color + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; height:auto;'
            });
        var self = this;
        textarea.onblur = function () {
            self.setText(this.value);
            self.group.setWidth(self.kText.getWidth());
            self.group.setHeight(self.kText.getHeight());
	    MM.ponerFoco(self.arbol);
            this.remove();
	    MM.teclado.atajos.activo = true;
        };
        document.body.appendChild(textarea);
        textarea.select();
        textarea.focus();
    },

    nop: function () {
    },

    destroy : function () {
	this.kText.destroy();
	this.group.destroy();
        delete this.kText;
        delete this.group;
    }
});

MM.Globo = MM.NodoSimple.extend({
    init: function (render, arbol, propiedades) {
	this._super(render, arbol, propiedades);

	this.rect = new Kinetic.Blob({
            points: [{
		x: 0,
		y: 0
            }, {
		x: this.kText.getWidth(),
		y: 0
            }, {
		x: this.kText.getWidth(),
		y: this.kText.getHeight()
            }, {
		x: 0,
		y: this.kText.getHeight()
            }],
            stroke: this.color,
            strokeWidth: 2,
            fill: this.colorFondo,
            shadowColor: this.Color,
            shadowBlur: 5,
            shadowOffset: [3, 3],
            shadowOpacity: 0.5,
            tension: 0.3
	});

        this.group.add(this.rect);
	this.group.children[1].moveUp();

        var bindEditar = MM.Class.bind(this, this.editar);
//        var bindNOP = MM.Class.bind(this, this.nop);
	var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        this.group.on('click tap', bindPonerFoco);
        this.group.on('dblclick  dbltap', bindEditar);
    },

    ponerFoco : function () {
	this.rect.setStroke('#5268F2');
	this.rect.setShadowColor('blue');
	this.capa.draw();
    },

    quitarFoco : function () {
	this.rect.setStroke('#555');
	this.rect.setShadowColor('black');
	this.capa.draw();
    },

    editar: function () {
	MM.teclado.atajos.activo = false;
        var textarea = new MM.DOM.create('textarea',
            { 'id': 'editNodo',
                'innerHTML': this.getText(),
                'style': 'position: absolute; ' +
                    'top : ' + this.getY() + 'px; ' +
                    'left: ' + this.getX() + 'px; ' +
                    'width: ' + this.getWidth() + 'px; ' +
                    'height: ' + this.getHeight() + 'px; ' +
                    'border: ' + this.rect.getStrokeWidth() + 'px solid ' + this.rect.getStroke() + '; ' +
                    'border-radius: 5px' +
                    'background-color: ' + this.rect.getFill() + '; ' +
                    'color: ' + this.kText.getFill() + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; height:auto;'
            });
        var self = this;
        textarea.onblur = function () {
            self.setText(this.value);
            self.group.setWidth(self.kText.getWidth());
            self.group.setHeight(self.kText.getHeight());
	    self.rect.setPoints ( [ { x: 0, y: 0  }, 
				    { x: self.kText.getWidth(),	y: 0 }, 
				    { x: self.kText.getWidth(),	y: self.kText.getHeight() }, 
				    { x: 0, y: self.kText.getHeight() } ] );
	    MM.ponerFoco(self.arbol);
            this.remove();
	    MM.teclado.atajos.activo = true;
        };
        document.body.appendChild(textarea);
        textarea.select();
        textarea.focus();
    },

    destroy : function () {
	this.rect.destroy();
	delete this.rect;
	this._super();
    }

});


// Mantenido por compatibilidad con test anteriores
var Nodo = Mensaje.extend({
    defecto: {
        x: 0,
        y: 0,
        text: '',
        fontSize: 14,
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

        var prop = MM.Properties.add(this.defecto, propiedades);
	prop.x = 0;
	prop.y = 0;
        this.kText = new Kinetic.Text(prop);

	this.rect = new Kinetic.Blob({
            points: [{
		x: 0,
		y: 0
            }, {
		x: this.kText.getWidth(),
		y: 0
            }, {
		x: this.kText.getWidth(),
		y: this.kText.getHeight()
            }, {
		x: 0,
		y: this.kText.getHeight()
            }],
            stroke: '#555',
            strokeWidth: 2,
            fill: '#ddd',
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: [3, 3],
            shadowOpacity: 0.5,
            tension: 0.3
	});

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

        this.group.add(this.rect);
        this.group.add(this.kText);
        this.capa.add(this.group);

        var bindEditar = MM.Class.bind(this, this.editar);
        var bindNOP = MM.Class.bind(this, this.nop);
	var bindPonerFoco = MM.Class.bind(this, function() {MM.ponerFoco(this.arbol);});
        this.group.on('click tap', bindPonerFoco);
        this.group.on('dblclick  dbltap', bindEditar);
        this.group.on('mouseout', bindNOP);
        this.group.on('mousemove', bindNOP);
        this.group.on('mousedown', bindNOP);
        this.group.on('mouseup', bindNOP);
        this.group.on('mouseenter', bindNOP);
        this.group.on('mouseLeave', bindNOP);
        this.group.on('dragstart', bindNOP);
        this.group.on('dragend', bindNOP);
    },

    ponerFoco : function () {
	this.rect.setStroke('#5268F2');
	this.rect.setShadowColor('blue');
	this.capa.draw();
    },

    quitarFoco : function () {
	this.rect.setStroke('#555');
	this.rect.setShadowColor('black');
	this.capa.draw();
    },

    setX : function (x) {
	this.group.setX(x);
    },

    getX : function () {
	return this.group.getX();
    },

    setY : function (y) {
	this.group.setY(y);
    },

    getY : function () {
	return this.group.getY();
    },

    getWidth: function () {
	return this.group.getWidth();
    },

    getHeight: function () {
	return this.group.getHeight();
    },

    editar: function () {
	MM.teclado.atajos.activo = false;
        var textarea = new MM.DOM.create('textarea',
            { 'id': 'editNodo',
                'innerHTML': this.getText(),
                'style': 'position: absolute; ' +
                    'top : ' + this.getY() + 'px; ' +
                    'left: ' + this.getX() + 'px; ' +
                    'width: ' + this.getWidth() + 'px; ' +
                    'height: ' + this.getHeight() + 'px; ' +
                    'border: ' + this.rect.getStrokeWidth() + 'px solid ' + this.rect.getStroke() + '; ' +
                    'border-radius: 5px' +
                    'background-color: ' + this.rect.getFill() + '; ' +
                    'color: ' + this.kText.getFill() + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; height:auto;'
            });
        var self = this;
        textarea.onblur = function () {
            self.setText(this.value);
            self.group.setWidth(self.kText.getWidth());
            self.group.setHeight(self.kText.getHeight());
	    self.rect.setPoints ( [ { x: 0, y: 0  }, 
				    { x: self.kText.getWidth(),	y: 0 }, 
				    { x: self.kText.getWidth(),	y: self.kText.getHeight() }, 
				    { x: 0, y: self.kText.getHeight() } ] );
	    MM.ponerFoco(self.arbol);
            this.remove();
	    MM.teclado.atajos.activo = true;
        };
        document.body.appendChild(textarea);
        textarea.select();
        textarea.focus();
    },

    ponerPosicion: function (evento) {
        console.log('Nodo posición : ' + this.posicionString());
    },

    ponerMensaje: function (evento) {
        console.log(evento + ': ' + this.posicionString());
    },

    posicionString: function () {
        var mousePos = this.escenario.getMousePosition();
        return 'x: ' + mousePos.x + ', y: ' + mousePos.y;
    },

    nop: function () {
    },

    destroy : function () {
	this.rect.destroy();
	this.kText.destroy();
	this.group.destroy();
	delete this.rect;
        delete this.kText;
        delete this.group;
    }

});

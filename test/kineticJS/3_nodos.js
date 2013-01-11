var Mensaje = Class.extend({
    defecto : {
	x: 5,
	y: 5,
	text: '',
	fontSize: 10,
	fontFamily: 'Calibri',
	textFill: '#555'
    },

    init: function(stage, layer, propiedades) {
	this.stage = stage;
	this.layer = layer;
	var prop = Properties.add(this.defecto, propiedades);
	this.kText = new Kinetic.Text(prop);
	layer.add ( this.kText );
    },

    setText : function (texto) {
	this.kText.setText(texto);
	this.layer.draw();
    },

    getText : function () {
	return this.kText.getText();
    }

});

var Nodo = Mensaje.extend({
    defecto : {
	x: 0,
	y: 0,
	stroke: '#555',
	strokeWidth: 2,
	fill: '#ddd',
	text: '',
	fontSize: 10,
	fontFamily: 'Calibri',
	textFill: '#555',
	width: 'auto',
	padding: 5,
	align: 'center',
	fontStyle: 'italic',
	shadow: {
            color: 'black',
            blur: 10,
            offset: [3, 3],
            opacity: 0.3
	},
	cornerRadius: 7,
	draggable : true
    },


    init: function(stage, layer, propiedades) {
	this._super(stage, layer, propiedades);
	var bindMensaje = Class.bind(this, this.ponerMensaje);
	var bindPosicion = Class.bind(this, this.ponerPosicion);
	var bindEditar = Class.bind(this, this.editar);
	this.kText.on('click',     bindMensaje);
	this.kText.on('dblclick',  bindEditar);
	this.kText.on('mouseout',  bindMensaje);
	this.kText.on('mousemove', bindMensaje);
	this.kText.on('mousedown', bindMensaje);
	this.kText.on('mouseup',   bindMensaje);
	this.kText.on('mouseenter',bindMensaje);
	this.kText.on('mouseLeave',bindMensaje);
	this.kText.on('dragstart', bindPosicion);
	this.kText.on('dragend',   bindPosicion);
    },
    
    editar : function() {
	var textarea = new Element ('textarea', 
				    { 'id'  : 'editNodo', 
				      'innerHTML': this.getText(), 
				      'style' : 'position: absolute; ' +
				      'top : ' + (this.kText.getY()) + 'px; ' +
				      'left: ' + (this.kText.getX()) + 'px; ' + 
				      'width: ' + (this.kText.getWidth()) + 'px; ' +
				      'height: ' + (this.kText.getHeight()) + 'px; ' +
				      'border: ' + this.kText.getStrokeWidth() + 'px solid '+ this.kText.getStroke() + '; ' +
				      'border-radius: ' + this.kText.getCornerRadius() + 'px;' +
				      'background-color: ' + this.kText.getFill() + '; ' + 
				      'color: ' + this.kText.getTextFill() + '; ' +
				      'font-family: ' + this.kText.getFontFamily() + '; ' +
				      'font-size: ' + this.kText.getFontSize() + 'pt; '
				    });
	var self = this;
	textarea.onblur = function () {
	    self.setText(this.value);
	    self.layer.draw();
	    this.remove();
	};
	document.body.appendChild(textarea);
	textarea.select();
	textarea.focus();
    },

    ponerPosicion : function(evento) {
	mensaje2.setText('Nodo posición : ' + this.posicionString());
    },

    ponerMensaje : function(evento) {
	mensaje.setText(evento + ': ' + this.posicionString() );
    },

    posicionString : function () {
	var mousePos = this.stage.getMousePosition();
	return 'x: ' + mousePos.x + ', y: ' + mousePos.y;
    }

});


var mensaje;
var mensaje2; 

window.onload = function load() {
    var stage = new Kinetic.Stage({
        container: 'contenedor',
        width: 600,
        height: 400
    });
    
    var layer = new Kinetic.Layer();
    mensaje = new Mensaje (stage, layer, {x:5, y:5, text:"mensaje..."});
    mensaje2 = new Mensaje(stage, layer, {x: 5, y: 18, text: 'Nodo posición x: 100, y: 60'});

    for (var i = 0; i<10; i++) {
	new Nodo(stage, layer, {x: 100 + (48*i), y: 60 + (25*i), text: 'Nodo ' + i});
    }
    
    stage.add(layer);
}


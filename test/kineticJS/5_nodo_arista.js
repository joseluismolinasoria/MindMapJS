var Arista = Class.extend({
    init: function (layer, nodoOrigen, nodoDestino) {
	this.layer = layer;
	this.nodoOrigen = nodoOrigen;
	this.nodoDestino = nodoDestino;
	this.context = layer.getCanvas().getContext();
	this.calcularPuntos();
	this.render();
    },

    calcularPuntos: function () {
	this.x1 = this.nodoOrigen.rect.getAbsolutePosition().x + this.nodoOrigen.rect.getWidth();
	this.y1 = this.nodoOrigen.rect.getAbsolutePosition().y + this.nodoOrigen.rect.getHeight() / 2;
	this.x2 = this.nodoDestino.rect.getAbsolutePosition().x + this.nodoDestino.rect.getCornerRadius();
	this.y2 = this.nodoDestino.rect.getAbsolutePosition().y + this.nodoDestino.rect.getHeight();
	this.c1x = this.x1 + (this.x2-this.x1)/2;
	this.c1y = this.y1;
	this.c2x = this.x1 + (this.x2-this.x1)/2;
	this.c2y = this.y2;
    },
    
    render: function () {
	var c = this.context;
	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = 'white';
	c.lineWidth = 3;
	c.stroke();

	this.calcularPuntos();

	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = '#555';
	c.lineWidth = 2;
	c.stroke();
	c = null;
    }
});


var Mensaje = Class.extend({
    defecto: {
	x: 5,
	y: 5,
	text: '',
	fontSize: 10,
	fontFamily: 'Calibri',
	fill: '#555',
	width: 'auto',
	align: 'center'
    },

    init: function(stage, layer, propiedades) {
	this.stage = stage;
	this.layer = layer;
	var prop = Properties.add(this.defecto, propiedades);
	this.kText = new Kinetic.Text(prop);
	layer.add ( this.kText );
    },

    setText: function (texto) {
	this.kText.setText(texto);
	this.layer.draw();
    },

    getText: function () {
	return this.kText.getText();
    }

});

var Nodo = Mensaje.extend({
    defecto : {
        x: 0,
        y: 0,
        text: '',
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 'auto',
        padding: 5,
        align: 'center'
    },


    init: function(stage, layer, propiedades) {
	this.stage = stage;
	this.layer = layer;
	var prop = Properties.add(this.defecto, propiedades);
	this.kText = new Kinetic.Text(prop);

	this.rect = new Kinetic.Rect({
            x: this.kText.getX(),
            y: this.kText.getY(),
            stroke: '#555',
            strokeWidth: 2,
            fill: '#ddd',
            width: this.kText.getWidth(),
            height: this.kText.getHeight(),
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [3, 3],
            shadowOpacity: 0.3,
            cornerRadius: 7
	});

	this.group = new Kinetic.Group({draggable : true,
				        dragBoundFunc: function(pos) {
					    console.log ("X: " + pos.x + " Y: " + pos.y );
					    arista.render();
					    return pos;
					}});
	this.group.add ( this.rect );
	this.group.add ( this.kText );
	layer.add(this.group);

	var bindMensaje = Class.bind(this, this.ponerMensaje);
	var bindPosicion = Class.bind(this, this.ponerPosicion);
	var bindEditar = Class.bind(this, this.editar);
	this.group.on('click',     bindMensaje);
	this.group.on('dblclick',  bindEditar);
	this.group.on('mouseout',  bindMensaje);
	this.group.on('mousemove', bindMensaje);
	this.group.on('mousedown', bindMensaje);
	this.group.on('mouseup',   bindMensaje);
	this.group.on('mouseenter',bindMensaje);
	this.group.on('mouseLeave',bindMensaje);
	this.group.on('dragstart', bindPosicion);
	this.group.on('dragend',   bindPosicion);
    },
    
    editar : function() {
	var textarea = new Element ('textarea', 
				    { 'id'  : 'editNodo', 
				      'innerHTML': this.getText(), 
				      'style' : 'position: absolute; '+
				      'top : ' + this.rect.getAbsolutePosition().y + 'px; ' +
				      'left: ' + this.rect.getAbsolutePosition().x + 'px; ' + 
				      'min-width: ' + this.rect.getWidth() + 'px; ' +
				      'min-height: ' + this.rect.getHeight() + 'px; ' +
				      'border: ' + this.rect.getStrokeWidth() + 'px solid '+ this.rect.getStroke() + '; ' +
				      'border-radius: ' + this.rect.getCornerRadius() + 'px;' +
				      'background-color: ' + this.rect.getFill() + '; ' + 
				      'color: ' + this.kText.getFill() + '; ' +
				      'font-family: ' + this.kText.getFontFamily() + '; ' +
				      'font-size: ' + this.kText.getFontSize() + 'pt; ' +
				      'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; height:auto;'
				    });
	var self = this;
	textarea.onblur = function () {
	    self.setText(this.value);
	    self.rect.setWidth(self.kText.getWidth());
	    self.rect.setHeight(self.kText.getHeight());
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
var nodoOrigen;
var nodoDestino;
var arista;

window.onload = function () {
    var stage = new Kinetic.Stage({
        container: 'contenedor',
        width: 600,
        height: 400
    });
    
    var layer = new Kinetic.Layer();
    var layerAristas = new Kinetic.Layer();

    mensaje = new Mensaje (stage, layer, {x:5, y:5, text:"mensaje..."});
    mensaje2 = new Mensaje(stage, layer, {x: 5, y: 18, text: 'Nodo posición x: 100, y: 60'});
    nodoOrigen = new Nodo(stage, layer, {x: 100, y: 60, text: 'Nodo Origen'});
    nodoDestino = new Nodo(stage, layer, {x: 300, y: 10, text: 'Nodo Destino'});

    stage.add(layerAristas);
    stage.add(layer);
    arista = new Arista( layerAristas, nodoOrigen, nodoDestino );

};

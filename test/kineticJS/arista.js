MM.Arista = MM.Class.extend({
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
	this.capa = capa;
	this.elementoOrigen = elementoOrigen;
	this.elementoDestino = elementoDestino;
	this.context = capa.getCanvas().getContext();
	this.tamano = tamano;
	this.render();
    },

    calcularPuntos: function () {
	var nodoOrigen = this.elementoOrigen.nodo;
	var nodoDestino = this.elementoDestino.nodo;
	this.x1 = (nodoOrigen.getX() + nodoOrigen.getWidth() / 2);// * MM.devicePixelRatio;
	this.y1 = (nodoOrigen.getY() + nodoOrigen.getHeight() / 2); // * MM.devicePixelRatio;
	this.x2 = (nodoDestino.getX() + nodoDestino.getWidth() / 2);// * MM.devicePixelRatio;
	this.y2 = (nodoDestino.getY() + nodoDestino.getHeight() / 2);// * MM.devicePixelRatio;
	this.c1x = this.x1 + (this.x2-this.x1)/2;
	this.c1y = this.y1;
	this.c2x = this.x1 + (this.x2-this.x1)/2;
	this.c2y = this.y2;
	nodoOrigen = nodoDestino = null;
    },
    
    render: function () {
	var c = this.context;
	this.calcularPuntos();

	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = '#555';
	c.lineWidth = this.tamano;
	c.stroke();
	c = null;
    }
});

MM.Rama = MM.Arista.extend({
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
	this.capa = capa;
	this.elementoOrigen = elementoOrigen;
	this.elementoDestino = elementoDestino;
	this.context = capa.getCanvas().getContext();
	this.tamano = tamano;
	this.render();
    },

    calcularPuntos: function () {
	var nodoOrigen = this.elementoOrigen.nodo;
	var nodoDestino = this.elementoDestino.nodo;
	this.x1 = (nodoOrigen.getX() + nodoOrigen.getWidth());
	this.y1 = (nodoOrigen.getY() + nodoOrigen.getHeight());
	this.x2 = nodoDestino.getX();
	this.y2 = (nodoDestino.getY() + nodoDestino.getHeight());
	this.x3 = (nodoDestino.getX() + nodoDestino.getWidth());
	this.y3 = (nodoDestino.getY() + nodoDestino.getHeight());
	this.c1x = this.x1 + (this.x2-this.x1)/2;
	this.c1y = this.y1;
	this.c2x = this.x1 + (this.x2-this.x1)/2;
	this.c2y = this.y2;
	nodoOrigen = nodoDestino = null;
    },
    
    render: function () {
	var c = this.context;
	this.calcularPuntos();

	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = this.elementoDestino.nodo.kText.getFill(); 
	c.lineWidth = this.tamano;
	c.lineTo(this.x3, this.y3);
	c.stroke();
	
	// c.strokeStyle = this.elementoDestino.nodo.kText.getFill(); 
	// c.lineTo(this.x3, this.y3);
	// c.stroke();
	c = null;
    }
});


// dejado por compatibilidad con test anteriores
var Arista = MM.Class.extend({
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
	this.capa = capa;
	this.elementoOrigen = elementoOrigen;
	this.elementoDestino = elementoDestino;
	this.context = capa.getCanvas().getContext();
	this.tamano = tamano;
	this.render();
    },

    calcularPuntos: function () {
	var nodoOrigen = this.elementoOrigen.nodo;
	var nodoDestino = this.elementoDestino.nodo;
	this.x1 = (nodoOrigen.getX() + nodoOrigen.getWidth() / 2);// * MM.devicePixelRatio;
	this.y1 = (nodoOrigen.getY() + nodoOrigen.getHeight() / 2); // * MM.devicePixelRatio;
	this.x2 = (nodoDestino.getX() + nodoDestino.getWidth() / 2);// * MM.devicePixelRatio;
	this.y2 = (nodoDestino.getY() + nodoDestino.getHeight() / 2);// * MM.devicePixelRatio;
	this.c1x = this.x1 + (this.x2-this.x1)/2;
	this.c1y = this.y1;
	this.c2x = this.x1 + (this.x2-this.x1)/2;
	this.c2y = this.y2;
	nodoOrigen = nodoDestino = null;
    },
    
    render: function () {
	var c = this.context;
	this.calcularPuntos();

	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = '#555';
	c.lineWidth = this.tamano;
	c.stroke();
	c = null;
    }
});

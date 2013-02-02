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


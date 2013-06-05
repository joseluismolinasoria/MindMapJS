/**
 * @file arista.js Implementación de arsitas 
 * @author José Luis Molina Soria
 * @version 20130512
 */

/**
 * @class MM.Arista
 * @classdesc Render de arista. Capaz de dibujar una arista entre dos nodos
 * @constructor MM.Arista
 * @param {layer}  capa            capa donde pintar la arista
 * @param {Object} elementoOrigen  elemento del MM desde donde debe partir la arista
 * @param {Object} elementoDestino elemento del MM hasta donde debe llegar la arista
 * @param {int}    tamano          grosor de la arista
 */
MM.Arista = MM.Class.extend(/** @lends MM.Arista.prototype */{
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
	this.capa = capa;
	this.elementoOrigen = elementoOrigen;
	this.elementoDestino = elementoDestino;
	this.context = capa.getCanvas().getContext();
	this.tamano = tamano;
	this.render();
    },

    /**
     * @desc Calcula los puntos necesarios para pintar la arista
     */
    calcularPuntos: function () {
	var nodoOrigen = this.elementoOrigen.nodo;
	var nodoDestino = this.elementoDestino.nodo;
	this.x1 = (nodoOrigen.getX() + MM.render.offset.x + nodoOrigen.getWidth() / 2) 
	    * MM.render.getEscala();
	this.y1 = (nodoOrigen.getY() + MM.render.offset.y + nodoOrigen.getHeight() / 2) 
	    * MM.render.getEscala();
	this.x2 = (nodoDestino.getX() + MM.render.offset.x + nodoDestino.getWidth() / 2) 
	    * MM.render.getEscala();
	this.y2 = (nodoDestino.getY() + MM.render.offset.y + nodoDestino.getHeight() / 2) 
	    * MM.render.getEscala();
	this.c1x = this.x1 + (this.x2-this.x1)/2;
	this.c1y = this.y1;
	this.c2x = this.x1 + (this.x2-this.x1)/2;
	this.c2y = this.y2;
	nodoOrigen = nodoDestino = null;
    },

    /**
     * @desc Función de pintado de la arista en función de los elementos pasados
     */   
    render: function () {
	var c = this.context;
	this.calcularPuntos();

	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = '#555';
	c.lineWidth = this.tamano * MM.render.getEscala();
	c.stroke();
	c = null;
    }
});


/**
 * @class MM.Rama
 * @classdesc Render de rama. Capaz de dibujar una arista de tipo rama entre dos nodos
 * @constructor MM.Rama
 * @param {layer}  capa            capa donde pintar la arista
 * @param {Object} elementoOrigen  elemento del MM desde donde debe partir la arista
 * @param {Object} elementoDestino elemento del MM hasta donde debe llegar la arista
 * @param {int}    tamano          grosor de la arista
 */
MM.Rama = MM.Arista.extend(/** @lends MM.Rama.prototype */{
    init: function (capa, elementoOrigen, elementoDestino, tamano) {
	this._super(capa, elementoOrigen, elementoDestino, tamano);
    },


    /**
     * @desc Cálculo de los puntos para poder pintar la Rama
     */   
    calcularPuntos: function () {
	var nodoOrigen = this.elementoOrigen.nodo;
	var nodoDestino = this.elementoDestino.nodo;
	this.x1 = (nodoOrigen.getX() + MM.render.offset.x + nodoOrigen.getWidth()) 
	    * MM.render.getEscala();
	this.y1 = (nodoOrigen.getY() + MM.render.offset.y + nodoOrigen.getHeight()) 
	    * MM.render.getEscala();
	this.x2 = nodoDestino.getX() + MM.render.offset.x 
	    * MM.render.getEscala();
	this.y2 = (nodoDestino.getY() + MM.render.offset.y + nodoDestino.getHeight()) 
	    * MM.render.getEscala();
	this.x3 = (nodoDestino.getX() + MM.render.offset.x + nodoDestino.getWidth()) 
	    * MM.render.getEscala();
	this.y3 = (nodoDestino.getY() + MM.render.offset.x + nodoDestino.getHeight()) 
	    * MM.render.getEscala();
	this.c1x = this.x1 + (this.x2-this.x1)/2;
	this.c1y = this.y1;
	this.c2x = this.x1 + (this.x2-this.x1)/2;
	this.c2y = this.y2;
	nodoOrigen = nodoDestino = null;
    },
    
    /**
     * @desc Función de pintado de la rama
     */   
    render: function () {
	var c = this.context;
	this.calcularPuntos();

	c.beginPath();
	c.moveTo(this.x1, this.y1);
	c.bezierCurveTo (this.c1x, this.c1y, this.c2x, this.c2y, this.x2, this.y2);
	c.strokeStyle = this.elementoOrigen.nodo.color; 
	c.lineWidth = this.tamano * MM.render.getEscala();
	c.lineTo(this.x3, this.y3);
	c.stroke();
	c.beginPath();
	c.moveTo(this.x2, this.y2);
	c.strokeStyle = this.elementoDestino.nodo.color; 
	c.lineWidth = this.tamano * MM.render.getEscala();
	c.lineTo(this.x3, this.y3);
	c.stroke();
	c = null;
    }
});


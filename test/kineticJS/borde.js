var Borde = MM.Class.extend({
    init: function (capa, width, height ) {
	this.capa = capa;
	this.width = width;
	this.height = height;
	this.render();
    }, 
 
    render: function () {
	this.capa.add( new Kinetic.Line({
	    points: [0, 0, this.width, 0],
	    stroke: 'grey',
	    strokeWidth: 1,
	    lineCap: 'round',
	    lineJoin: 'round',
	    dashArray: [4, 3]
	}));
	this.capa.add( new Kinetic.Line({
	    points: [0, 0, 0, this.height],
	    stroke: 'grey',
	    strokeWidth: 1,
	    lineCap: 'round',
	    lineJoin: 'round',
	    dashArray: [4, 3]
	}));
	this.capa.add( new Kinetic.Line({
	    points: [0, this.height, this.width, this.height],
	    stroke: 'grey',
	    strokeWidth: 1,
	    lineCap: 'round',
	    lineJoin: 'round',
	    dashArray: [4, 3]
	}));
	this.capa.add( new Kinetic.Line({
	    points: [this.width, 0, this.width, this.height],
	    stroke: 'grey',
	    strokeWidth: 1,
	    lineCap: 'round',
	    lineJoin: 'round',
	    dashArray: [4, 3]
	}));
    }
});


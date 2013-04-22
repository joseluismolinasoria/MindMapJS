var Grid = MM.Class.extend({
    init: function (capa, width, height ) {
	this.capa = capa;
	this.width = width;
	this.height = height;
	this.render();
    }, 
 
    render: function () {
	for ( var x = 100; x <= this.width; x += 100 ) {
	     this.capa.add( new Kinetic.Line({
		points: [x, 0, x, this.height],
		stroke: 'grey',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round',
		dashArray: [0.8, 5]
	    }));
	} 
	for ( var y = 100; y <= this.width; y += 100 ) {
	     this.capa.add( new Kinetic.Line({
		points: [0, y, this.width, y],
		stroke: 'grey',
		strokeWidth: 1,
		lineCap: 'round',
		lineJoin: 'round',
		dashArray: [0.8, 5]
	    }));
	} 
	x = y = null;
    }
});


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
    },

    getX: function () {
	return this.kText.getAbsolutePosition().x;
    },

    getY: function () {
	return this.kText.getAbsolutePosition().y;
    },

    getWidth: function () {
	return this.kText.getWidth();
    },

    getHeight: function () {
	return this.kText.getHeight();
    }

});


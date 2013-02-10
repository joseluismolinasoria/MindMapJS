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

    init: function(escenario, capa, propiedades) {
	this.escenario = escenario;
	this.capa = capa;
	var prop = Properties.add(this.defecto, propiedades);
	this.kText = new Kinetic.Text(prop);
	capa.add ( this.kText );
    },

    setText: function (texto) {
	this.kText.setText(texto);
	this.capa.draw();
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


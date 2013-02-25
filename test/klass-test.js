var Class = require("../src/klass.js");

describe('Class', function(){
    var Persona = Class.extend({
	init: function(nombre) {
	    this.nombre = nombre;
	},
	bailar: function() {
	    return true;
	},
	piernas: 2
    });

    describe('Persona', function(){
	var pp = new Persona ('Pepe');
	it('Debe ser objecto', function(){
	    Persona.should.be.a('function');
	});
	it('Pepe debe ser un objecto', function(){
	    pp.should.be.a('object');
	});
	it('Pepe debe ser una Persona', function(){
	    pp.should.be.an.instanceOf(Persona);
	});
	it('Pepe debe tener como nombre Pepe', function(){
	    pp.should.have.property('nombre', 'Pepe');
	});
	it('Pepe debe tener dos piernas', function(){
	    pp.should.have.property('piernas', 2);
	});
	it('Pepe debe bailar', function(){
	    pp.bailar().should.be.ok;
	});
    });

    var Hombre = Persona.extend({
	init: function(nombre) {
	    this._super(nombre);
	},
	bailar: function() {
	    return true;
	},
	piernas: 2,
	sexo: 'Barón'
    });

    describe('Hombre', function(){
	var pp = new Hombre ('Pepe');
	it('Debe ser objecto', function(){
	    Hombre.should.be.a('function');
	});
	it('Pepe debe ser un objecto', function(){
	    pp.should.be.a('object');
	});
	it('Pepe debe ser una Persona', function(){
	    pp.should.be.an.instanceOf(Persona);
	});
	it('Pepe debe ser una Hombre', function(){
	    pp.should.be.an.instanceOf(Hombre);
	});
	it('Pepe debe tener como nombre Pepe', function(){
	    pp.should.have.property('nombre', 'Pepe');
	});
	it('Pepe debe tener dos piernas', function(){
	    pp.should.have.property('piernas', 2);
	});
	it('Pepe debe tener sexo Barón', function(){
	    pp.should.have.property('sexo', 'Barón');
	});
	it('Pepe debe bailar', function(){
	    pp.bailar().should.be.ok;
	});
    });

    var HombreLobo = Hombre.extend({
	init: function(name) {
	    this._super(name);
	},
	bailar: function() {
	    return false;
	},
	piernas: 2,
	sexo: 'Barón'
    });

    describe('HombreLobo', function(){
	var pp = new HombreLobo ('Pepe');
	it('Debe ser objecto', function(){
	    Hombre.should.be.a('function');
	});
	it('Pepe debe ser un objecto', function(){
	    pp.should.be.a('object');
	});
	it('Pepe debe ser una Persona', function(){
	    pp.should.be.an.instanceOf(Persona);
	});
	it('Pepe debe ser una Hombre', function(){
	    pp.should.be.an.instanceOf(Hombre);
	});
	it('Pepe debe ser una HombreLobo', function(){
	    pp.should.be.an.instanceOf(HombreLobo);
	});
	it('Pepe debe tener como nombre Pepe', function(){
	    pp.should.have.property('nombre', 'Pepe');
	});
	it('Pepe debe tener dos piernas', function(){
	    pp.should.have.property('piernas', 2);
	});
	it('Pepe debe tener sexo Barón', function(){
	    pp.should.have.property('sexo', 'Barón');
	});
	it('Pepe como es un hombre lobo no baila', function(){
	    pp.bailar().should.not.be.ok;
	});
    });

});
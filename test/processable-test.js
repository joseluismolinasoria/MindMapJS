var processable = require("../src/processable.js");

describe('Processable', function(){

    var valorPre = null, 
	valorPost = null;

    var pre = function (nombre){
	valorPre = "Pre-"+nombre;
    };

    var post = function (nombre){
	valorPost = "Post-" + nombre;
    };

    var hola = function (nombre) {
	return "hola " + nombre;
    }.processable(pre, post);

    describe('hola', function(){
	it('Debe ser una función', function(){
	    hola.should.be.a('function');
	});
	it('debe retornar un saludo', function(){
	    hola('frodo').should.eql('hola frodo');
	});
	it('debe haber ejecutado el Pre-proceso', function(){
	    valorPre.should.eql("Pre-frodo");
	});
	it('debe haber ejecutado el Post-proceso', function(){
	    valorPost.should.eql("Post-frodo");
	});
    });

});

var PubSub = require("../src/pubsub.js");

describe('PubSub', function(){
    var Evento = PubSub.extend({
	init: function() {
	    this.cont = 0;
	},
 
	evento: function () {
	    this.on('evento');
	    this.on('postEvento');
	}
    });


    describe('Evento', function(){
	var evt = new Evento ();
	var idSusEvento = null;
	var idSusPostEvento = null;

	it('Pubsub Debe ser objecto', function(){
	    PubSub.should.be.a('function');
	});
	it('evt debe ser un objecto', function(){
	    evt.should.be.a('object');
	});
	it('evt debe ser una instancia de PubSub', function(){
	    evt.should.be.an.instanceOf(PubSub);
	});
	it('evt debe tener el contador a 0', function(){
	    evt.should.have.property('cont', 0);
	});
	it('evt lanzamos el evento sin suscripciones y el contador no incrementa', function(){
	    evt.evento();
	    evt.cont.should.equal(0);
	});
	it('evt suscribimos al evento y la sucripción incrementa el contador', function(){
	    idSusEvento = evt.suscribir('evento', function () {});
	    idSusPostEvento = evt.suscribir('postEvento', function () { this.cont++;});
   	    idSusEvento.should.equal(1);
   	    idSusPostEvento.should.equal(2);
	});
	it('evt lanzamos el evento con las suscripciones y el contador incrementa', function(){
	    evt.evento();
	    evt.cont.should.equal(1);
	});
	it('evt desuscribimos los eventos', function(){
	    idSusEvento = evt.desSuscribir(idSusEvento);
	    idSusEvento.should.equal(1);
	    idSusEvento = evt.desSuscribir(idSusPostEvento);
	    idSusEvento.should.equal(2);
	});
	it('evt lanzamos el evento con las suscripciones eliminadas y el contador no debe incrementar', function(){
	    evt.evento();
	    evt.cont.should.equal(1);
	});
    });

});

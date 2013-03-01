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
	var idSubEvento = null;
	var idSubPostEvento = null;

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
	it('evt lanzamos el evento sin subscripciones y el contador no incrementa', function(){
	    evt.evento();
	    evt.cont.should.equal(0);
	});
	it('evt subscribimos al evento y la sucripción incrementa el contador', function(){
	    idSubEvento = evt.subscribir('evento', function () {});
	    idSubPostEvento = evt.subscribir('postEvento', function () { this.cont++;});
   	    idSubEvento.should.equal(1);
   	    idSubPostEvento.should.equal(2);
	});
	it('evt lanzamos el evento con las subscripciones y el contador incrementa', function(){
	    evt.evento();
	    evt.cont.should.equal(1);
	});
	it('evt desubscribimos los eventos', function(){
	    idSubEvento = evt.desSubscribir(idSubEvento);
	    idSubEvento.should.equal(1);
	    idSubEvento = evt.desSubscribir(idSubPostEvento);
	    idSubEvento.should.equal(2);
	});
	it('evt lanzamos el evento con las subscripciones eliminadas y el contador no debe incrementar', function(){
	    evt.evento();
	    evt.cont.should.equal(1);
	});
    });

});

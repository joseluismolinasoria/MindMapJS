var PubSub = require("../src/pubsub.js");

describe('PubSub', function(){
    var Evento = PubSub.extend({

	cont : 0,

	init: function() {
	    this.cont = 0;
	    this.eventos = {};
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

    describe('Con dos manejadores de eventos', function(){
	var evt1;
	var evt2;
 	var idSusEvento1 = null;
	var idSusPostEvento1 = null;
	var idSusEvento2 = null;
	var idSusPostEvento2 = null;

	it('Creamos dos manejadores eventos', function(){
	    evt1 = new Evento ();
	    evt2 = new Evento ();
	});
	it('Los contadores deben estar inicializados', function(){
	    evt1.cont.should.equal(0);
	    evt2.cont.should.equal(0);
	});
	it('Creamos nos suscribimos a los eventos del manejador 1', function(){
	    idSusEvento1 = evt1.suscribir('evento', function () {});
	    idSusPostEvento1 = evt1.suscribir('postEvento', function () { this.cont++; } );
   	    idSusEvento1.should.equal(1); 
   	    idSusPostEvento1.should.equal(2);
	});
	it('Creamos nos suscribimos a los eventos del manejador 2', function(){
	    idSusEvento2 = evt2.suscribir('evento', function () {});
	    idSusPostEvento2 = evt2.suscribir('postEvento', function () { this.cont--; } );    
   	    idSusEvento2.should.equal(1);
   	    idSusPostEvento2.should.equal(2);
	});
	it('Lanzamos el evento del manejador1', function(){
	    evt1.evento();
	    evt1.cont.should.equal(1);
	    evt2.cont.should.equal(0);
	});
    });


});

var UMgr = require("../src/undoManager.js");

describe('UndoManager', function(){
    var umgr = new UMgr.UndoManager(4);

    describe('Si el undoManager esta vacío', function(){
	it('Debe tener indice actual en -1', function(){
	    umgr.actual().should.eql(-1);
	});
	it('Los comandos hacer y deshacer deben ser nulos', function(){
	    (!umgr.hacerNombre()).should.be.true;
	    (!umgr.deshacerNombre()).should.be.true;
	});
    });

    var vble = null;
    var crear = new UMgr.UndoManager.ComandoHacerDeshacer( 'crear', 
							   function () { vble = 'creado'; },
							   function () { vble = null; });
    describe('Si creamos un Comando hacer deshacer', function(){
	it('Debe tener el nombre', function() {
	    crear.should.have.property('nombre', 'crear');
	});
	it('hacemos', function(){
	    crear.hacer();
	    vble.should.eql('creado');
	});
	it('deshacemos', function(){
	    crear.deshacer();
	    (!vble).should.be.true;
	});
    });

    describe('Si añadimos un comando al undomanager', function () {
	it ('Debe añadirse el comando y el índice actual a 0', function () {
	    umgr.add ( crear );	
	    umgr.actual().should.eql(0);
	});
	it ('Deshacer es "crear" y hacer es "null"', function() {
	    umgr.deshacerNombre().should.eql('crear');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('Realiza la acción hacer correctamente', function (){
	    umgr.hacer();
	    (!vble).should.be.true;
	    umgr.actual().should.eql(0);
	    umgr.deshacerNombre().should.eql('crear');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('El comando a deshacer es "crear" y el hacer "null"', function () {
	    umgr.deshacerNombre().should.eql('crear');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('Realiza la acción de deshacer correctamente', function (){
	    umgr.deshacer();
	    (!vble).should.be.true;
	    umgr.actual().should.eql(-1);
	    (!umgr.deshacerNombre()).should.be.true;
	    umgr.hacerNombre().should.eql('crear');
	});
	it ('El comando a deshacer es "null" y el hacer "crear"', function () {
	    (!umgr.deshacerNombre()).should.be.true;
	    umgr.hacerNombre().should.eql('crear');
	});
	it ('Realiza la acción hacer correctamente', function (){
	    umgr.hacer();
	    vble.should.eql('creado');
	    umgr.actual().should.eql(0);
	});
	it ('El comando a deshacer es "crear" y el hacer "null"', function () {
	    umgr.deshacerNombre().should.eql('crear');
	    (!umgr.hacerNombre()).should.be.true;
	});
    }); 

    var borrar = new UMgr.UndoManager.ComandoHacerDeshacer( 'borrar', 
							    function () { vble = ''; },
							    function () { vble = 'otro valor'; });
    describe('Con dos comandos', function () {
	it ('Debe añadir el comando y el índice actual a 1', function () {
	    umgr.add ( borrar );
	    umgr.actual().should.eql(1);
	    umgr.deshacerNombre().should.eql('borrar');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('El comando a deshacer es "borrar" y el hacer "null"', function () {
	    umgr.deshacerNombre().should.eql('borrar');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('Realiza la acción hacer correctamente', function () {
	    umgr.hacer();
	    vble.should.eql('creado');
	    umgr.actual().should.eql(1);
	});
	it ('El comando a deshacer es "borrar" y el hacer "null"', function () {
	    umgr.deshacerNombre().should.eql('borrar');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('Realiza la acción deshacer correctamente', function () {
	    umgr.deshacer();
	    vble.should.eql('otro valor');
	    umgr.actual().should.eql(0);
	});
	it ('El comando a deshacer es "crear" y el hacer "borrar"', function () {
	    umgr.deshacerNombre().should.eql('crear');
	    umgr.hacerNombre().should.eql('borrar');
	});
	it ('Realizamos el deshacer el comando introduccido en primer lugar', function () {
	    umgr.deshacer();
	    (!vble).should.be.true;
	    umgr.actual().should.eql(-1);
	});
	it ('El comando a deshacer es "null" y el hacer "crear"', function () {
	    (!umgr.deshacerNombre()).should.be.true;
	    umgr.hacerNombre().should.eql('crear');
	});
	it ('Realizamos el hacer del primer comando', function () {
	    umgr.hacer();
	    vble.should.eql('creado');
	    umgr.actual().should.eql(0);
	});
	it ('El comando a deshacer es "crear" y el hacer "borrar"', function () {
	    umgr.deshacerNombre().should.eql('crear');
	    umgr.hacerNombre().should.eql('borrar');
	});
	it ('Realizamos el hacer del segundo comando', function () {
	    umgr.hacer();
	    vble.should.eql('');
	    umgr.actual().should.eql(1);
	});
	it ('El comando a deshacer es "borrar" y el hacer "null"', function () {
	    umgr.deshacerNombre().should.eql('borrar');
	    (!umgr.hacerNombre()).should.be.true;
	});
    });

    describe('Creado muchos comandos', function () {
	it ('Añadimos muchos comandos más del máximo establecido', function () {
	    umgr.add(crear);
	    umgr.actual().should.eql(2);
	    umgr.deshacerNombre().should.eql('crear');
	    (!umgr.hacerNombre()).should.be.true;
	    umgr.add(borrar);
	    umgr.actual().should.eql(3);
	    umgr.deshacerNombre().should.eql('borrar');
	    (!umgr.hacerNombre()).should.be.true;
	    umgr.add(crear);
	    umgr.actual().should.eql(3);
	    umgr.deshacerNombre().should.eql('crear');
	    (!umgr.hacerNombre()).should.be.true;
	    umgr.add(borrar);
	    umgr.actual().should.eql(3);
	    umgr.deshacerNombre().should.eql('borrar');
	    (!umgr.hacerNombre()).should.be.true;
	});
	it ('Deshacemos un par de comandos', function () {
	    umgr.deshacer();
	    umgr.actual().should.eql(2);
	    vble.should.eql('otro valor');
	    umgr.deshacerNombre().should.eql('crear');
	    umgr.hacerNombre().should.eql('borrar');

	    umgr.deshacer();
	    umgr.actual().should.eql(1);
	    (!vble).should.be.true;
	    umgr.deshacerNombre().should.eql('borrar');
	    umgr.hacerNombre().should.eql('crear');
	});
	it ('Creamos uno en medio', function () {
	    umgr.add ( new UMgr.UndoManager.ComandoHacerDeshacer( 'kk', 
								  function () { vble = 'hacerKK'; },
								  function () { vble = 'deshacerKK'; }));
	    umgr.actual().should.eql(2);
	    umgr.deshacerNombre().should.eql('kk');
	    (!vble).should.be.true;
	});
	it ('Deshacemos todo', function () {
	    umgr.deshacer();
	    umgr.deshacer();
	    umgr.deshacer();	    
	    umgr.actual().should.eql(-1);
	    (!vble).should.be.true;
	    (!umgr.deshacerNombre()).should.be.true;
	    umgr.hacerNombre().should.eql('crear');
	});
	    
    });

});

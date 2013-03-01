var A = require("../src/arbol-n.js");
var ArbolN = A.ArbolN;

describe('ArbolN', function(){
    describe('Con un único nodo', function(){
	var a = ArbolN('a');
	it('Debe tener el elemento a como nodo raiz', function(){
	    a.should.have.property('elemento', 'a');
	});
	it('No debe tener hijos', function(){
	    a.should.have.property('hijos').with.lengthOf(0);
	});
	it('debe tener altura 1', function(){
	    a.altura().should.eql(1);
	});
	it('debe tener peso 1', function(){
	    a.peso().should.eql(1);
	});
	it('su orden de nodo es 0', function(){
	    a.ordenNodo().should.eql(0);
	});
	it('su orden es 0 ', function(){
	    a.orden().should.eql(0);
	});
	it('su recorrido inOrden es [\'a\'] ', function(){
	    a.inOrden().should.eql(['a']);
	});
	it('su recorrido preOrden es [\'a\'] ', function(){
	    a.preOrden().should.eql(['a']);
	});
	it('su recorrido postOrden es [\'a\'] ', function(){
	    a.postOrden().should.eql(['a']);
	});
	it('el nodo raiz es hoja', function(){
	    a.esHoja().should.be.true;
	});
    });

    describe('con dos hijos', function(){
	var a = ArbolN('a', ArbolN('b'), ArbolN('c'));
	it('Debe tener el elemento a en el nodo Raiz', function(){
	    a.should.have.property('elemento', 'a');
	});
	it('debe tener 2 hijos', function(){
	    a.should.have.property('hijos').with.lengthOf(2);
	});
	it('debe tener altura 2', function(){
	    a.altura().should.eql(2);
	});
	it('debe tener peso 3', function(){
	    a.peso().should.eql(3);
	});
	it('su orden de nodo es 2', function(){
	    a.ordenNodo().should.eql(2);
	});
	it('su orden es 2 ', function(){
	    a.orden().should.eql(2);
	});
	it('su recorrido inOrden es [\'bac\'] ', function(){
	    a.inOrden().should.eql(['b', 'a', 'c']);
	});
	it('su recorrido preOrden es [\'abc\'] ', function(){
	    a.preOrden().should.eql(['a', 'b', 'c']);
	});
	it('su recorrido postOrden es [\'bca\'] ', function(){
	    a.postOrden().should.eql(['b', 'c', 'a']);
	});
	it('el nodo raiz no es hoja', function(){
	    a.esHoja().should.be.false;
	});
    });

    describe ('Con el árbol de prueba', function () {
	var a = ArbolN("a",
		       ArbolN("b"),
		       ArbolN("c",
			      ArbolN("e"),
			      ArbolN("f")),
		       ArbolN("d",
			      ArbolN("g",
				     ArbolN("j"),
				     ArbolN("k"),
				     ArbolN("l"),
				     ArbolN("m")),
			      ArbolN("h"),
			      ArbolN("i")));
	
	it('Debe tener el elemento a en el nodo Raiz', function(){
	    a.should.have.property('elemento', 'a');
	});
	it('debe tener 3 hijos', function(){
	    a.should.have.property('hijos').with.lengthOf(3);
	});
	it('debe tener altura 4', function(){
	    a.altura().should.eql(4);
	});
	it('debe tener peso 13', function(){
	    a.peso().should.eql(13);
	});
	it('su orden de nodo es 3', function(){
	    a.ordenNodo().should.eql(3);
	});
	it('su orden es 4 ', function(){
	    a.orden().should.eql(4);
	});
	it('su recorrido inOrden es [baecfjgklmdhi] ', function(){
	    a.inOrden().should.eql(['b', 'a', 'e', 'c', 'f', 'j', 'g', 'k', 'l', 'm', 'd', 'h', 'i']);
	});
	it('su recorrido preOrden es [abcefdgjklmhi] ', function(){
	    a.preOrden().should.eql(['a', 'b', 'c', 'e', 'f', 'd', 'g', 'j', 'k', 'l', 'm', 'h', 'i']);
	});
	it('su recorrido postOrden es [befcjklmghida] ', function(){
	    a.postOrden().should.eql(['b', 'e', 'f', 'c', 'j', 'k', 'l', 'm', 'g', 'h', 'i', 'd', 'a']);
	});
	it('el nodo raiz no es hoja', function(){
            a.esHoja().should.be.false;
	});
	it('buscamos nodo a y obtenemos a ', function(){
            a.buscar('a').should.have.property('elemento', 'a');
	});
	it('buscamos nodo m y obtenemos m ', function(){
            a.buscar('m').should.have.property('elemento', 'm');
	});
	it('la profundidad de a es 0 ', function(){
            a.profundidad('a').should.eql(0);
	});
	it('la profundidad de m es 3 ', function(){
            a.profundidad('m').should.eql(3);
	});
	it('el padre de a es null', function(){
	    (a.padreDe('a')===null).should.be.ok;
	});
	it('el padre de b es a', function(){
	    a.padreDe('b').should.have.property('elemento', 'a');
	});
	it('el padre de m es g', function(){
            a.padreDe('m').should.have.property('elemento', 'g');
	});	
    });
});

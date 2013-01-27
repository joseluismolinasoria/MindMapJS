var ArbolN = require("../src/arbol-n.js")

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

    describe ('Con el arbol de prueba', function () {
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
	it('su recorrido por niveles es [abcdefghijklm] ', function(){
	    a.postOrden().should.eql(['a', 'b', 'c', 'd,' 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm']);
	});

	it('el nodo raiz no es hoja', function(){
	    a.esHoja().should.be.false;
	});
    });
});
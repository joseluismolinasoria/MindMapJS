
MM.demo = {};

MM.demo.timerDeslizador = null;

MM.demo.deslizar = function( id, ids ){
    var min = "-500px";
    var max = "25px";
    var e = document.getElementById(id);
    ids = ids || [];

    if ( e.style.top === max ) {
        e.style.top = min;
    } else if ( e.style.top === min || e.style.top === "" ) {
	ids.forEach ( function (item) {
	    document.getElementById(item).style.top = min;
	});
        e.style.top = max;
	if ( MM.demo.timerDeslizador ) {
	    window.clearTimeout(MM.demo.timerDeslizador);
	}
        MM.demo.timerDeslizador = window.setTimeout(function(){if (e.style.top === max ) { e.style.top = min; } },5000);
    }
};


MM.demo.ayuda = function () {
    MM.demo.deslizar('ayuda', ['datosDelProyecto']);
};

MM.demo.datosDelProyecto = function (mostrar) {
    MM.demo.deslizar('datosDelProyecto', ['ayuda']);
};

MM.demo.hacer = function(){
    MM.undoManager.hacer();
};

MM.demo.deshacer = function(){
    MM.undoManager.deshacer();
};

MM.demo.cambioUndoManager = function() {
    var btnHacer = document.getElementById('btnHacer');
    var btnDeshacer = document.getElementById('btnDeshacer');

    if ( MM.undoManager.hacerNombre() === null ) {
    	btnHacer.setAttribute('disabled', 'disabled');
    	btnHacer.setAttribute('title', '');
    } else {
    	if ( btnHacer.hasAttribute('disabled') ) {
    	    btnHacer.removeAttribute('disabled');
    	}
    	btnHacer.setAttribute('title', 'Hacer ' + MM.undoManager.hacerNombre());
    }

    if ( MM.undoManager.deshacerNombre() === null ) {
    	btnDeshacer.setAttribute('disabled', 'disabled');
    	btnDeshacer.setAttribute('title', '');
    } else {
    	if ( btnDeshacer.hasAttribute('disabled') ) {
    	    btnDeshacer.removeAttribute('disabled');
    	}
    	btnDeshacer.setAttribute('title', 'Deshacer ' + MM.undoManager.deshacerNombre());
    }

    btnHacer = btnDeshacer = null;
};


window.onload = function () {
    MM.add('hijo1').add('hijo2').add('hijo3').add('hijo4').next().add('hijo11').add('hijo12').add('hijo13');
    MM.renderizar('contenedorEditor');
    MM.undoManager.eventos.suscribir('cambio', MM.demo.cambioUndoManager );
    MM.demo.cambioUndoManager();
};

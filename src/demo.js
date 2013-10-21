
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
    var iconHacer = document.getElementById('iconHacer');
    var iconDeshacer = document.getElementById('iconDeshacer');

    if ( MM.undoManager.hacerNombre() === null ) {
        btnHacer.setAttribute('disabled', 'disabled');
        btnHacer.setAttribute('title', '');
        iconHacer.setAttribute('style', 'color: #ddd;');
    } else {
        if ( btnHacer.hasAttribute('disabled') ) {
            btnHacer.removeAttribute('disabled');
            iconHacer.removeAttribute('style');
        }
        btnHacer.setAttribute('title', 'Hacer ' + MM.undoManager.hacerNombre());
    }

    if ( MM.undoManager.deshacerNombre() === null ) {
        btnDeshacer.setAttribute('disabled', 'disabled');
        btnDeshacer.setAttribute('title', '');
        iconDeshacer.setAttribute('style', 'color: #ddd;');
    } else {
        if ( btnDeshacer.hasAttribute('disabled') ) {
            btnDeshacer.removeAttribute('disabled');
            iconDeshacer.removeAttribute('style');
        }
        btnDeshacer.setAttribute('title', 'Deshacer ' + MM.undoManager.deshacerNombre());
    }

    btnHacer = btnDeshacer = null;
};


window.onload = function () {
    MM.nuevo('Como usar MindMapJS').add('Teclado').add('Ratón').add('Tablet');

    // Teclado
    MM.next();
    MM.add('Zoom').add('Navegación').add('Plegado').add('Edición').add('Operaciones');
    
    // Teclado / Zoom
    MM.next();
    MM.add('<< Ctrl++ >> In').add('<< Ctrl+- >> Out').add('<< Ctrl+0 >> Reset');

    // Teclado / Navegación
    MM.nextHermano();
    MM.add('<< Home >> Ir a Idea Central').add('<< Cursores >> Cambiar de nodo').add('<< Tab >> Siguiente nivel');

    MM.nextHermano();
    MM.add('<< Shift++ >>Desplegar').add('<< Shift+- >> Plegar');

    // Teclado / Edición
    MM.nextHermano();
    MM.add('<< Enter >> Entrar/salir del modo de Edición').add('<< Escape >> Salir de Edición').add('<< Tab >> Salir del Edición');
    
    // Teclado / Operaciones
    MM.nextHermano();
    MM.add('<< Shift+n >> Nuevo Mapa Mental').add('<< Ins >> Nuevo hijo').add('<< Shift+Tab >> Nuevo hijo').add('<< del >> Borrar').add('<< Shift+Enter >> Nuevo hermano / Salto de línea');

    // Ratón
    MM.root().next().nextHermano().add('Click').add('Doble Click').add('Arrastrar');

    // Ratón / Click
    MM.next();
    MM.add('Seleccionar Idea').add('Plegar/Desplegar');

    // Ratón / Doble Click
    MM.nextHermano();
    MM.add('Editar');

    // Ratón / Arrastrar
    MM.nextHermano();
    MM.add('Mover el escenario').add('Mover nodo');
    

    // Tablet
    MM.root().next().nextHermano().nextHermano().add('Touch').add('Doble touch').add('Arrastrar');

    // Tablet / Touch
    MM.next();
    MM.add('Seleccionar Idea');

    // Tablet / Doble Touch
    MM.nextHermano();
    MM.add('Editar');

    // Tablet / Arrastrar
    MM.nextHermano();
    MM.add('Mover el escenario').add('Mover nodo');

    MM.renderizar('contenedorEditor');

//    MM.renderizar('contenedorEditor', MM.NodoSimple, MM.Rama);
    MM.undoManager.eventos.suscribir('cambio', MM.demo.cambioUndoManager );
    MM.demo.cambioUndoManager();
};

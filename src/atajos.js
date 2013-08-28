/**
 * @file atajos.js Contiene la configuración de atajos de teclado del MM.
 * @author José Luis Molina Soria
 * @version 20130520
 */

/**
 * @desc Define los atajos de teclado para el render
 * @memberof MM
 * @method definirAtajos
 * @inner
 */
MM.definirAtajos = function() {

    // teclado Zoom
    MM.teclado.atajos.add('Ctrl++', MM.render.zoomIn, MM);    
    MM.teclado.atajos.add('Ctrl+-', MM.render.zoomOut, MM);
    MM.teclado.atajos.add('Ctrl+0', MM.render.zoomReset, MM);


    var addEdicion = function () {
        if ( MM.foco.elemento.plegado ) {
            MM.plegarRama(false);
        }
        MM.add();
        MM.render.editar();
    };

    // teclas de operaciones
    MM.teclado.atajos.add('Shift+n', MM.nuevo, MM);
    MM.teclado.atajos.add('ins', addEdicion, MM);
    MM.teclado.atajos.add('Shift+Tab', addEdicion, MM);
    MM.teclado.atajos.add('del', MM.borrar, MM);

    // teclas de edición
    MM.teclado.atajos.add('Shift+Enter', function() {
        if ( MM.render.modoEdicion() ) {
            MM.render.insertarSaltoDeLinea();
        } else {
            MM.padre().add();
            MM.render.editar();
        }
    }, MM);
    MM.teclado.atajos.add('enter', MM.render.editar, MM);
    MM.teclado.atajos.add('esc', function() {
        if ( MM.render.modoEdicion() ){
            MM.render.editar();
	}
    }, MM);

    // teclas de plegado / desplegado
    MM.teclado.atajos.add('shift++', function() { MM.plegarRama(false); }, MM );
    MM.teclado.atajos.add('shift+-', function() { MM.plegarRama(true); }, MM );

    // teclas de navegación
    MM.teclado.atajos.add('home', MM.root, MM);
    MM.teclado.atajos.add('left', MM.padre, MM);
    MM.teclado.atajos.add('right', MM.next, MM);
    MM.teclado.atajos.add('up', MM.prevHermano, MM);
    MM.teclado.atajos.add('down', MM.nextHermano, MM);
    MM.teclado.atajos.add('tab', function() {
        if ( MM.render.modoEdicion() ) {
            MM.render.editar();
        } else {
            if ( MM.foco.esHoja() ) { // Si estamos en el último nivel añadimos un nuevo nodo hijo
                addEdicion();
            } if ( MM.foco.elemento.plegado ) {
                MM.plegarRama(false);
            } else { // navegamos por los niveles
                MM.next();
            }
        }
    }, MM);

};

/**
 * @desc pone los atajos de tecla en modo de edición.
 * @memberof MM
 * @method atajosEnEdicion
 * @inner
 */
MM.atajosEnEdicion = function(enEdicion) {    
    MM.teclado.atajos.activar('Ctrl++', !enEdicion );
    MM.teclado.atajos.activar('Ctrl+-', !enEdicion );
    MM.teclado.atajos.activar('Ctrl+0', !enEdicion );
    MM.teclado.atajos.activar('Shift+n', !enEdicion ); 
    MM.teclado.atajos.activar('ins', !enEdicion );
    MM.teclado.atajos.activar('Shift+Tab', !enEdicion );
    MM.teclado.atajos.activar('del', !enEdicion );
    MM.teclado.atajos.activar('shift++', !enEdicion );
    MM.teclado.atajos.activar('shift+-', !enEdicion );
    MM.teclado.atajos.activar('home', !enEdicion ); 
    MM.teclado.atajos.activar('left' , !enEdicion );
    MM.teclado.atajos.activar('right', !enEdicion ); 
    MM.teclado.atajos.activar('up', !enEdicion ); 
    MM.teclado.atajos.activar('down', !enEdicion );
};

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
    // teclado númerico
    MM.teclado.atajos.add('Ctrl+k', MM.render.zoomIn, MM);    
    MM.teclado.atajos.add('Ctrl+m', MM.render.zoomOut, MM);
    MM.teclado.atajos.add('Ctrl+0', MM.render.zoomReset, MM);
    // teclado alfanúmerico
    MM.teclado.atajos.add('Ctrl+»', MM.render.zoomIn, MM);    
    MM.teclado.atajos.add('Ctrl+½', MM.render.zoomOut, MM);

    // teclas de navegación
    MM.teclado.atajos.add('home', MM.root, MM);
    MM.teclado.atajos.add('left', MM.padre, MM);
    MM.teclado.atajos.add('right', MM.next, MM);
    MM.teclado.atajos.add('up', MM.prevHermano, MM);
    MM.teclado.atajos.add('down', MM.nextHermano, MM);

    // teclas de operaciones
    MM.teclado.atajos.add('ins', MM.add, MM);
    MM.teclado.atajos.add('del', MM.borrar, MM);

    // teclas de edición
    MM.teclado.atajos.add('enter', MM.render.editar, MM);

    // teclas de plegado / desplegado
    MM.teclado.atajos.add('shift++', function() { alert('desplegar'); }, MM );
    MM.teclado.atajos.add('shift+-', function() { alert('plegar'); }, MM );

   // - <Tab> para moverse por lo niveles. Cuando llega a un nodo hijo crea un nuevo nodo hijo. Cuando llega a un nodo plegado lo despliega
   // - <Enter> para entrar y salir del modo de edición
   // - <Escape> para salir del modo de edición
   // - <Shift+Enter> para crear un hermano
   // - <Shift+Tab> para crear hijo
   // - <Shift++> para plegar
   // - <Shift+-> para desplegar

};


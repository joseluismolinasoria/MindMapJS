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

    // teclas de operciones
    MM.teclado.atajos.add('ins', MM.add, MM);
    MM.teclado.atajos.add('del', MM.borrar, MM);
    // definir Ctrl+Enter para editar el nodo actual
};


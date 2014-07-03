/**
 * @file exportar.js Contiene toda la funcionalidad de exporación de Mapas mentales
 * @author José Luis Molina Soria
 * @version 20130608
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./klass.js');
    MM.PubSub = require('./pubsub.js');
}


/**
 * Contiene la funcionalidad básica para soportar la exportaciones a ficheros.
 *
 * @namespace MM.exportar
 * @property {MM.exportar.FreeMind}   FreeMind  - Clase encargada de exportar a ficheros FreeMind
 */
MM.exportar = {};

MM.exportar.freemind = function() {
    var generar = function () {
        var wrapper = MM.DOM.create('div');
        var map = MM.DOM.create('map', {'version': '0.9.0'});
        var nodos = MM.arbol.generalPreOrden(generadorNodo, operarNodo);
        for ( var i = 0; i < nodos.length; i++ ) {
            map.appendChild(nodos[i]);
        }
        wrapper.appendChild(map);
        return wrapper.innerHTML;
    };

    var generadorNodo = function ( elemento ) {
        var time = (new Date()).getTime();    
        var nodo = MM.DOM.create('node', { 'BACKGROUND_COLOR': MM.color.rgbToHexCSS(MM.color.hslToRgb(MM.color.addBrillo(elemento.nodo.hslColor, 40))),
                                           'COLOR': MM.color.rgbToHexCSS(MM.color.hslToRgb(elemento.nodo.hslColor)),
                                           'CREATE': time, 
                                           'ID': 'ID_' + Math.floor((Math.random()*(10e+10))+1),
                                           'MODIFIED': time,
                                           'STYLE': 'bubble',
                                           'FOLDED': elemento.plegado,
                                           'TEXT': elemento.texto });
        var edge = MM.DOM.create('edge', { 'STYLE' : "bezier",
                                           'COLOR' : MM.color.rgbToHexCSS(MM.color.hslToRgb(elemento.nodo.hslColor)) });
        nodo.appendChild(edge);
        time = null;
        return [nodo];
    };

    var operarNodo = function ( nodoPadre, nodos ) {
        for ( var i = 0; i < nodos.length; i++ ) {
            nodoPadre[0].appendChild(nodos[i]);
        }
        i = null;
    };

    var grabar = function() {
        window.URL = window.URL || window.webkitURL;
        if ( !window.URL ) {
            alert('Operación no soportada por su navegador');
        }
        var blob = new Blob([generar()], {type: 'application/xml'});
        var link = window.document.createElement('a');
        link.download= MM.arbol.elemento.texto + ".mm";
        link.href = window.URL.createObjectURL(blob);
var evt = document.createEvent("MouseEvents"); 
evt.initMouseEvent("click", true, true, window, 
                           0, 0, 0, 0, 0, false, false, false, false, 0, null); 
        link.dispatchEvent(evt);
    };

    return {
        grabar: grabar
    };
}();

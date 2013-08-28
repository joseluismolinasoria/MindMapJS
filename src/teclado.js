/**
 * @file teclado.js Librería para el porcesado y control del teclado
 * @author José Luis Molina Soria
 * @version 20130508
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
}

/**
 * Espacio de nombre para el proceso y control del teclado 
 * @namespace MM.teclado
 * @property {MM.teclado.tecla}   tecla  - Funciones y constantes de tecla
 * @property {MM.teclado.atajos}  atajos - Manejador de atajos de teclado. P.E.: "Ctrl+Alt+i"
 */
MM.teclado = {};


/**
 * Espacio de nombre para funciones y constantes de teclas
 * @namespace MM.teclado.tecla
 */
MM.teclado.tecla = {
    // teclas de función
    f1  : 112,
    f2  : 113,
    f3  : 114,
    f4  : 115,
    f5  : 116,
    f6  : 117,
    f7  : 118,
    f8  : 119,
    f9  : 120,
    f10 : 121,
    f11 : 122,
    f12 : 123,
    
    // modificadores
    shift : 16,
    ctrl  : 17,
    alt   : 18,
    leftMeta : 91,
    rightMeta : 92,
    
    // bloqueos
    scrolllock : 145,
    numlock : 144,
    capslock : 20,
    
    // teclas de navegación y edición
    pageup : 33,
    pagedown : 34,
    left : 37,
    up : 38,
    right :39,
    down : 40,
    ins : 45,
    home : 36,
    del : 46,
    end : 35,
    
    // otras
    backspace : 8,
    tab : 9,
    enter : 13,
    esc : 27,
    escape : 27,
    space : 32
};

// Cada navegador tiene mapeado el teclado de forma diferente 
// para ajustarse a esta excepciones utlizamos las siguiente
MM.teclado.tecla.excepciones = {
//  Firefox      Chrome      Safari     Teclado Numérico
    171: '+',    187: '+',   221: '+',  107: '+',
    173: '-',    189: '-',   191: '-',  109: '-', 
                                         96: '0'
};


/**
 * @desc Manejador de teclado para el evento keyDown
 * @param {event} e Instancia de evento de teclado
 */
MM.teclado.keyDown = function (e){
    if ( !MM.teclado.atajos.activo ) {
        return true;
    }
    
    var evt = e ? e : window.event;
    var key = window.Event ? evt.which : evt.keyCode;
    var nombre = MM.teclado.tecla.nombre(key, evt);

    if ( MM.teclado.tecla.esModificador(key) ) {
        evt = key = nombre = null;
        return true;
    } else { 
        var nombreAtajo = MM.teclado.atajos.calcular(nombre, evt);
        var a = MM.teclado.atajos.definidos[nombreAtajo];
        if ( a && a.activo ) { 
            evt.preventDefault(); 
            evt.stopPropagation();
            MM.teclado.atajos.lanzar(nombreAtajo);
            a = evt = key = nombre = nombreAtajo = null;
            return false;
        }
        a = evt = key = nombre = nombreAtajo = null;
        return true;
    }
    evt = key = nombre = null;
    return true;
};


/**
 * @desc Dado un valor devuelve el nombre de la tecla
 * @param {integer} key valor númerico de una tecla
 * @return {string} nombre asociado a una tecla
 **/ 
MM.teclado.tecla.nombre = function ( key ) {
    
    if ( this.excepciones[key]) {
        return this.excepciones[key];
    }

    for (var name in this) {
        if ( key === this[name] ) {
            return name;
        }
    }

    return String.fromCharCode(key);
};
    

/**
 * @desc Dado un nombre nos devuelve su valor
 * @param {string} nombre Nombre de una tecla
 * @return {integer} valor asociado al nombre 
 **/ 
MM.teclado.tecla.valor = function ( nombre ) {
    return this[nombre];
};

/**
 * @desc Test para saber si una tecla es un modificador o no. Se trata de un 
 * modificador si la tecla es Ctrl o Alt o Shift o Meta
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si es un modificador y false en otro caso
 **/     
MM.teclado.tecla.esModificador = function ( key ) {
    return key === this.ctrl || key === this.alt || key === this.shift ||
        key === this.leftMeta || key === this.rightMeta;
};

/**
 * @desc Comprueba si latecla es Ctrl
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Ctrl
 **/     
MM.teclado.tecla.esControl = function ( key ) {
    return key === this.ctrl;
};

/**
 * @desc Comprueba si la tecla es Alt
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Alt
 **/         
MM.teclado.tecla.esAlt = function ( key ) {
    return key === this.alt;
};

/**
 * @desc Comprueba si la una tecla es Shift (Mayúsculas)
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Shift (Mayúsculas)
 **/             
MM.teclado.tecla.esShift = function ( key ) {
    return key === this.shift;
};

/**
 * @desc Comprueba si la una tecla es Window
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si la tecla es Window
 **/                 
MM.teclado.tecla.esMeta = function ( key ) {
    return key === this.leftMeta || key === this.rightMeta;
};

/**
 * Espacio de nombre manejos de atajos de teclado. P.E.: "Ctrl+Alt+i"
 * @namespace MM.teclado.atajos
 */
MM.teclado.atajos = {
    activo : true,
    definidos : {},
    ctrl : false,
    shift : false,
    alt : false,
    window : false
};

/**
 * @desc Añade una definición de atajo de teclado
 * @param {string} atajo Nombre del atajo de teclado a añadir al control de atajos
 * @param {function} f Función a ejecutar cuando se de el atajo
 **/                 
MM.teclado.atajos.add = function ( atajo, f, contexto ) {
    this.definidos[atajo] = { funcion : f, 
                              contexto : contexto || this, 
                              activo : true 
                            };
};

/**
 * @desc Calcula si existe una atajo para el estado actual de los modficiadores y una tecla dada
 * @param {string} nombre Nombre de tecla pulsada
 * @param {object} evt Evento de teclado
 * @return {string | null} Nombre del atajo de teclado o null si no existe
 **/                 
MM.teclado.atajos.calcular = function ( nombre, evt ) {

    var reKey = new RegExp("\\+" + nombre + "$", "i" );
    var reCtrl = /ctrl\+/i;
    var reAlt = /alt\+/i;
    var reShift = /shift\+/i;
    var reWindow = /meta\+/i;
    
    for (var name in this.definidos) {
        if ( nombre === name ) { return name; }
        if( reKey.test(name) && 
            ( evt.ctrlKey?reCtrl.test(name):!reCtrl.test(name)) && 
            ( (evt.altKey || evt.altGraphKey)?reAlt.test(name):!reAlt.test(name)) && 
            ( evt.shiftKey?reShift.test(name):!reShift.test(name)) && 
            ( evt.metaKey?reWindow.test(name):!reWindow.test(name)) ) {
            return name;
        }
    }
    reKey = reCtrl = reAlt = reShift = reWindow = null;
    return null;
};

/**
 * @desc Lanza la función asociada al atajo de teclado
 * @param {string} atajo Nombre del atajo de teclado
 **/                 
MM.teclado.atajos.lanzar = function (atajo) {
    var a = this.definidos[atajo];
    if ( a ) {
        a.funcion.apply(a.contexto, []);
    }
    a = null;
};

/**
 * @desc Lanza la función asociada al atajo de teclado
 * @param {string} atajo Nombre del atajo de teclado
 **/                 
MM.teclado.atajos.activar = function (atajo, valor) {
    var a = this.definidos[atajo];
    if ( a ) {
        a.activo = valor;
    }
    a = null;
};


if ( typeof module !== 'undefined' ) {
    module.exports = MM.teclado;
}

if ( window ) {
    window.addEventListener ("keydown", MM.teclado.keyDown, true);
}


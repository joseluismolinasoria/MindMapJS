/**
 * @file teclado.js Librería para el porcesado y control del teclado
 * @author José Luis Molina Soria
 * @version 20130316
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
    leftWindow : 91,
    rightWindow : 92,
    
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
    space : 32
};


/**
 * @desc Manejador de teclado para el evento keyUp
 * @param {event} e Instancia de evento de teclado
 */
MM.teclado.keyUp = function (e){
    if ( !MM.teclado.atajos.activo ) 
	return true;
    var evt = e ? e : event;
    var key = window.Event ? evt.which : evt.keyCode;
    
    if ( MM.teclado.tecla.esControl(key) ) {
	MM.teclado.atajos.ctrl = false;
    }
    if ( MM.teclado.tecla.esAlt(key) ) {
	MM.teclado.atajos.alt = false;
    }
    if ( MM.teclado.tecla.esShift(key) ) {
	MM.teclado.atajos.shift = false;
    }
    if ( MM.teclado.tecla.esWindow(key) ) {
	MM.teclado.atajos.window = false;
    }
    evt = key = null;
};

/**
 * @desc Manejador de teclado para el evento keyDown
 * @param {event} e Instancia de evento de teclado
 */
MM.teclado.keyDown = function (e){
    if ( !MM.teclado.atajos.activo ) 
	return true;
    var evt = e ? e : event;
    var key = window.Event ? evt.which : evt.keyCode;
    var nombre = MM.teclado.tecla.nombre(key);

    if ( MM.teclado.tecla.esModificador(key) ) {
	if ( MM.teclado.tecla.esControl(key) ) {
	    MM.teclado.atajos.ctrl = true;
	}
	if ( MM.teclado.tecla.esAlt(key) ) {
	    MM.teclado.atajos.alt = true;
	}
	if ( MM.teclado.tecla.esShift(key) ) {
	    MM.teclado.atajos.shift = true;
	}
	if ( MM.teclado.tecla.esWindow(key) ) {
	    MM.teclado.atajos.window = true;
	}
    } else { 
	var nombreAtajo = MM.teclado.atajos.calcular(nombre);
	MM.teclado.atajos.lanzar(nombreAtajo);
    };
    evt = key = nombre = nombreAtajo = null;
};


/**
 * @desc Dado un valor devuelve el nombre de la tecla
 * @param {integer} key valor númerico de una tecla
 * @return {string} nombre asociado a una tecla
 **/ 
MM.teclado.tecla.nombre = function ( key ) {
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
    return this[name];
};

/**
 * @desc Test para saber si una tecla es un modificador o no. Se trata de un 
 * modificador si la tecla es Ctrl o Alt o Shift o Window
 * @param {integer} key Tecla a comprobar
 * @return {boolean} true si es un modificador y false en otro caso
 **/     
MM.teclado.tecla.esModificador = function ( key ) {
    return key === this.ctrl || key === this.alt || key === this.shift ||
	key === this.leftWindow || key === this.rightWindow;
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
MM.teclado.tecla.esWindow = function ( key ) {
    return key === this.leftWindow || key === this.rightWindow;
};




/**
 * Espacio de nombre manejos de atajos de teclado. P.E.: "Ctrl+Alt+i"
 * @namespace MM.teclado.atajos
 */
MM.teclado.atajos = {
    activo : true,
    definidos : {},
    contextos : {},
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
    this.definidos[atajo] = f;
    this.contextos[atajo] = contexto || this;
};

/**
 * @desc Calcula si existe una atajo para el estado actual de los modficiadores y una tecla dada
 * @param {string} nombre Nombre de tecla pulsada
 * @return {string | null} Nombre del atajo de teclado o null si no existe
 **/                 
MM.teclado.atajos.calcular = function ( nombre ) {
    var reKey = new RegExp("\\+" + nombre + "\$", "i" );
    var reCtrl = /ctrl\+/i;
    var reAlt = /alt\+/i;
    var reShift = /shift\+/i;
    var reWindow = /window\+/i;
    
    for (var name in this.definidos) {
	if ( nombre === name ) return name;
        if( reKey.test(name) && 
	    ( this.ctrl?reCtrl.test(name):!reCtrl.test(name)) && 
	    ( this.alt?reAlt.test(name):!reAlt.test(name)) && 
	    ( this.shift?reShift.test(name):!reShift.test(name)) && 
	    ( this.window?reWindow.test(name):!reWindow.test(name)) ) {
	    return name;
	}
    }
    reKey = reCtrl = reAlt = reShift = reWindow = null;
    return null;
};

/**
 * @desc Lanza la función asociada al atajo de teclado
 * @param {string} atajo Nombre del atajo de teclado
 * @param {object} contexto de ejecución de la función asociada al atajo de teclado
 **/                 
MM.teclado.atajos.lanzar = function (atajo) {
    if ( this.definidos[atajo] ) {
	this.definidos[atajo].apply(this.contextos[atajo], []);
    }
};

if ( typeof module !== 'undefined' ) {
    module.exports = MM.teclado;
}

if ( window ) {
    window.addEventListener ("keyup", MM.teclado.tecla.keyUp, true);
    window.addEventListener ("keydown", MM.teclado.keyDown, true);
}
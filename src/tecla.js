/**
 * Constantes de teclas especiales
 **/
var tecla = {
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
 * Dado un valor devuelve el nombre de la tecla
 **/ 
tecla.nombre = function ( key ) {
    for (var name in this) {
	if ( key === this[name] )
	    return name;
    }
    return String.fromCharCode(key);
};

/**
 * Dado un nombre nos devuelve su valor
 **/ 
tecla.valor = function ( nombre ) {
    return this[name];
};

tecla.esModificador = function ( key ) {
    return key === this.ctrl || key === this.alt || key === this.shift ||
	key === this.leftWindow || key === this.rightWindow;
};

tecla.esControl = function ( key ) {
    return key === this.ctrl;
};

tecla.esAlt = function ( key ) {
    return key === this.alt;
};

tecla.esShift = function ( key ) {
    return key === this.shift;
};

tecla.esWindow = function ( key ) {
    return key === this.leftWindow || key === this.rightWindow;
};



/** 
 *  Definición para atajos de teclado. P.E.: <Ctrl+Alt+i> 
 */
tecla.atajos = {
    definidos : {},
    ctrl : false,
    shift : false,
    alt : false,
    window : false
};


tecla.atajos.add = function ( atajo, f ) {
    this.definidos[atajo] = f;
};

/**
 * Calcula si existe una atajo para el estado actual de los modficiadores y una tecla dada
 */
tecla.atajos.calcular = function ( nombre ) {
    var reKey = new RegExp("\\+" + nombre + "\$", "i" );
    var reCtrl = /ctrl\+/i;
    var reAlt = /alt\+/i;
    var reShift = /shift\+/i;
    var reWindow = /window\+/i;

    for (var name in this.definidos) {
        if( reKey.test(name) && 
	    ( this.ctrl?reCtrl.test(name):!reCtrl.test(name)) && 
	    ( this.alt?reAlt.test(name):!reAlt.test(name)) && 
	    ( this.shift?reShift.test(name):!reShift.test(name)) && 
	    ( this.window?reWindow.test(name):!reWindow.test(name)) )
	    return name;
    }
    return null;
};

tecla.atajos.lanzar = function (atajo, contexto) {
    contexto = contexto || this;
    if ( this.definidos[atajo] )
	this.definidos[atajo].apply(contexto, [atajo]);
};

tecla.keyUp = function (e){
    var evt = e ? e : event;
    var key = window.Event ? evt.which : evt.keyCode;
    
    if ( tecla.esControl(key) ) 
	tecla.atajos.ctrl = false;
    if ( tecla.esAlt(key) )
	tecla.atajos.alt = false;
    if ( tecla.esShift(key) ) 
	tecla.atajos.shift = false;
    if ( tecla.esWindow(key) )
	tecla.atajos.window = false;
};

tecla.keyDown = function (e){
    var evt = e ? e : event;
    var key = window.Event ? evt.which : evt.keyCode;
    var nombre = tecla.nombre(key);
    console.log("pulsado: " + nombre + ' (' + key + ')');

    if ( tecla.esModificador(key) ) {
	if ( tecla.esControl(key) ) 
	    tecla.atajos.ctrl = true;
	if ( tecla.esAlt(key) )
	    tecla.atajos.alt = true;
	if ( tecla.esShift(key) ) 
	    tecla.atajos.shift = true;
	if ( tecla.esWindow(key) )
	    tecla.atajos.window = true;
    } else if ( tecla.atajos.ctrl || tecla.atajos.alt || 
		tecla.atajos.shift || tecla.atajos.window ) {
	var nombreAtajo = tecla.atajos.calcular(nombre);
	console.log("Entontrado atajo: " + nombreAtajo);
	tecla.atajos.lanzar(nombreAtajo);
	console.log("Lanzado: " + nombreAtajo);
    };
};

window.onload = function() {
    window.onkeydown = tecla.keyDown;
    window.onkeyup = tecla.keyUp;
};
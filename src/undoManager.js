/**
 * @file undoManager.js Implementación de un gestor de comandos hacer y deshacer
 * @author José Luis Molina Soria
 * @version 20130620
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./klass.js');
    MM.PubSub = require('./pubsub.js');
}

/**
 * @class MM.UndoManager
 * @classdesc Gestor de comandos undo (hacer y deshacer).
 * @constructor 
 * @param maximo {integer} El máximo de comando en buffer. Por defecto, 10.
 */  
MM.UndoManager = MM.Class.extend(function() {
    /** 
     * @prop {Array} Comando del tipo Hacer / Deshacer
     * @memberof MM.UndoManager
     * @inner
     */
    var comandos = [];    // la lista de comandos

    /** 
     * @prop {integer} Tamaño máximo del buffer
     * @memberof MM.UndoManager
     * @inner
     */
    var maxComandos = 10; // número máximo de comandos en cola

    /** 
     * @prop {integer} Indice del comando actual
     * @memberof MM.UndoManager
     * @inner
     */
    var actual = -1;      // índice comando actual


    var eventos = new MM.PubSub();


    var init = function ( maximo ) {
        maxComandos = maximo || 10;
    };

    /** 
     * @desc Añade un nuevo comando a la pila de comandos. Si el tamaño del buffer sobrepasa el 
     *       máximo fijado, entonces elimina el comando más antiguo. Si existiensen comandos por
     *       encima del actual, estos serán eliminados.
     * @param {MM.UndoManager.ComandoHacerDeshacer} Comando a añadir al buffer.
     * @memberof MM.UndoManager
     * @instance
     */
    var add = function (comando) {
        borrarPorEncimaActual();
        comandos.push(comando);
        actual = comandos.length -1;
        ajustarMaximo();
        eventos.on('add');
        eventos.on('cambio');
    };

    var borrarPorEncimaActual = function () {
        if ( actual !== -1 && actual < comandos.length -1 ){
            comandos = comandos.slice(0,actual+1);
        }
    };
    
    var ajustarMaximo = function () {
        if ( actual === maxComandos ){
            comandos.shift();
            actual--;
        }
    };
    
    /**
     * @desc Ejecuta el comando hacer correspondiente, según el comando actual. También hace avanzar
     *       el puntero actual. El comando que se ejecuta o (hace) es el siguiente al comando actual. 
     *       Si el comando actual es último no hay comando hacer, o no hay que hacer nada.
     * @memberof MM.UndoManager
     * @instance
     */
    var hacer = function () {
        if ( comandos[actual+1] ) {
            comandos[actual+1].hacer();
            avanzar();
            eventos.on('hacer');
            eventos.on('cambio');
        }
    };

    /**
     * @desc Ejecuta el comando deshacer correspondiente, según el comando actual. También hace 
     *       retroceder el puntero actual. 
     * @memberof MM.UndoManager
     * @instance
     */    
    var deshacer = function () {
        if ( actual !== -1 ) {
            comandos[actual].deshacer();
            retroceder();
            eventos.on('deshacer');
            eventos.on('cambio');
        }
    };

    var avanzar = function () {
        if (actual < comandos.length - 1) {
            actual++;
            eventos.on('avanzar');
            eventos.on('cambio');
        }
    };
    
    var retroceder = function () {
        if (actual >= 0) {
            actual--;
            eventos.on('retroceder');
            eventos.on('cambio');
        }
    };

    /**
     * @desc Calcula el nombre del comando a Hacer según la situación actual.
     * @return {String} nombre del comando hacer.
     * @memberof MM.UndoManager
     * @instance
     */        
    var hacerNombre = function () {
        if ( comandos[actual+1] ) {
            return comandos[actual+1].nombre;
        }
        return null;
    };

    /**
     * @desc Calcula el nombre del comando a deshacer según la situación actual.
     * @return {String} nombre del comando deshacer.
     * @memberof MM.UndoManager
     * @instance
     */            
    var deshacerNombre = function () {
        if ( actual !== -1 ) {
            return comandos[actual].nombre;
        }
        return null;
    };


    /**
     * @desc Genera un array con los nombres de los comandos
     * @return {Array} Array con los nombres de los comandos
     * @memberof MM.UndoManager
     * @instance
     */            
    var nombres = function () {
        return comandos.map(function (c) { return c.nombre; });
    };
    
    return {
        init : init, 
        nombres : nombres,
        hacerNombre : hacerNombre,
        deshacerNombre: deshacerNombre,
        /**
         * @desc Indica el indice actual dentro de la lista de comandos.
         * @return {Integer} indice actual
         * @memberof MM.UndoManager
         * @instance
         */
        actual : function () { return actual; },
        add : add,
        hacer : hacer,
        deshacer : deshacer,
        /** 
         * @prop {MM.PubSub} eventos Gestor de eventos del undoManager
         * @memberof MM.UndoManager
         * @instance
         */
        eventos : eventos
    };
}());

/**
 * @class MM.UndoManager.ComandoHacerDeshacer
 * @classdesc Clase base para el comportamiento de una comando hacer/deshacer (undo/redo).
 * @constructor 
 * @param {string} nombre Nombre del comando
 * @param {function} hacerCallBack Función a ejecutar en el hacer.
 * @param {function} deshacerCallBack Función a ejecutar en el deshacer
 */  
MM.UndoManager.ComandoHacerDeshacer = MM.Class.extend(
/** @lends MM.UndoManager.ComandoHacerDeshacer.prototype */{
    init: function (nombre, hacerCallBack, deshacerCallBack) {
        this.nombre = nombre;
        this.hacerCallBack = hacerCallBack;
        this.deshacerCallBack = deshacerCallBack;
    },

    /**
     * @desc Ejecuta el comando hacer
     * @memberof MM.UndoManager.ComandoHacerDeshacer
     * @instance
     */
    hacer : function () {
        this.hacerCallBack();
    },

    /**
     * @desc Ejecuta el comando deshacer
     * @memberof MM.UndoManager.ComandoHacerDeshacer
     * @instance
     */
    deshacer : function () {
        this.deshacerCallBack();
    }
});


if ( typeof module !== 'undefined' ) {
    module.exports.UndoManager = MM.UndoManager;
}

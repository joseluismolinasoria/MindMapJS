/**
 * @file Describe the file
 * @author José Luis Molina Soria
 * @version 20130224
 */
MM.PubSub = function() {

    /**
     * @class PubSub
     * @classdesc Implementación del patrón Publish/Subscribe
     * @constructor PubSub
     */
    var p = {};
    var on = {};
    var idSub = 0;

    /**
     * @desc Realiza la notificación a los subscriptores de que se a producido
     * una publicación o evento.
     * @param evento {string}    nombre del evento o publicación a notificar
     * @param args   {*}         argumentos para la función callback
     * @return {boolean} Si el evento no es un nombre valido retorna false en
     * otro caso retorna true
     */
    p.on = function( evento, args ) {
        if (!on[evento])
            return false;

        on[evento].forEach(function (evt){
            evt.funcion.call(evt.contexto, args);
        });

        return true;
    };

    /**
     * @desc Pemite la subscripción a una publicación o evento. Donde el parametro func es
     * la función a ejecutar en el caso de que se produzca la notificación y contexto el
     * contexto de ejecución para la función callback
     * @param evento   {string}   nombre del evento o publicación en la que deseamos subscribirnos
     * @param func     {function} función callback
     * @param contexto {object}   contexto de ejecución de la función callback
     * @return {null|number} null en caso de fallo o *idSub* el identificador de subscripción
     */
    p.subscribir = function( evento, func, contexto ) {
        if ( !evento || !func )
            return null;

        if (!on[evento])
            on[evento] = [];

        contexto = contexto || this;

        on[evento].push({ id : idSub, contexto: contexto, funcion: func });

        return idSub++;
    };

    /**
     * @desc realiza una dessubscripción a un evento o notificación
     * @param id   {number} identificador de subscripción
     * @return {null|number} null si no se ha podido realizar la dessubscripción
     */
    p.desSubscribir = function (id) {
        for (var evento in on)
            if ( on[evento] )
                for (var i = 0, len = on[evento].length; i < len; i++)
                    if (on[evento][i].id === id) {
                        on[evento].splice(i, 1);
                        return id;
                    }

        return null;
    };

    return p;
};

/**
 * @file processable.js añade el patrón processable al sistema
 * @author José Luis Molina Soria
 * @version 20130224
 */

/**
 * @desc Implementación del patrón processable, mendiante la extensión del prototitpo de la función.
 * El patrón processable incorpora una función de pre y post procesado que se ejecutarán antes y después 
 * de la función extendida.
 * @return {function} función extendida
 */
Function.prototype.processable = function (prefn, postfn) {
    var fn = this;
    return function () {
	var postRet;
        if (prefn) {
            prefn.apply(this, arguments);
        }
        var ret = fn.apply(this, arguments);    
        
        if (postfn) {
            postRet = postfn.apply(this, arguments);
        }
        return (postRet === undefined)? ret : postRet;
    };
};

if ( typeof module !== 'undefined' ) {
    module.exports = Function.prototype.procesable;
}



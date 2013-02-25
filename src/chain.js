/**
 * @file chain.js añade el patrón chainable al sistema
 * @author José Luis Molina Soria
 * @version 20130224
 */

/**
 * @desc Implementación del patrón Chainable, mendiante la extensión del prototitpo de la función
 * @return {function} función extendida
 */
Function.prototype.chain = function() {
  var self = this;
  return function() {
    var ret = self.apply(this, arguments);
    return ret === undefined ? this : ret;
  }
};

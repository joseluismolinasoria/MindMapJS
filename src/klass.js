var Class = function (){ 
    this.init = function () {};
};
    
Class.extend = function(prop) {
    var _super = this.prototype || Class.prototype; // prototype de la clase padre

    function F() {}
    F.prototype = _super;
    var proto = new F();
    
    // recorremos el objeto que nos han pasado como parámetro...
    for (var name in prop) {
	// Si estamos sobreescribiendo un método de la clase padre.
	if (typeof prop[name] == "function" && typeof _super[name] == "function") {
	    proto[name] = (function(name, fn) { // asociamos las funciones al nuevo contexto 
		return function() {
		    var tmp = this._super;               // guardamos _super
		    this._super = _super[name];          // función super => podemos hacerthis._super(argumentos)
		    var ret = fn.apply(this, arguments); // ejecutamos el método en el contexto de la nueva instancia
		    this._super = tmp;                   // restauramos el _super
		    return ret;
		}
	    })(name, prop[name]);
	} else { // no sobreescribimos métodos ni p
	    proto[name] = prop[name];
	}
    }
    
    function Klass() {
	if (this.init) 
	    this.init.apply(this, arguments);
    }
    
    Klass.prototype = proto;
    Klass.prototype.constructor = Klass;
    Klass.extend = this.extend;
    
    return Klass; 
};

Class.bind = function (ctx, fn) {
    return function() {
	return fn.apply(ctx, arguments); 
    }
};

if ( typeof module !== 'undefined' ) 
    module.exports = Class;

Function.prototype.processable = function (prefn, postfn) {
    var fn = this;
    return function () {
        if (prefn) {
            prefn.apply(this, arguments);
        }
        var ret = fn.apply(this, arguments);
        if (postfn) {
            postfn.apply(this, arguments);
        }
	return ret
    };
};

if ( typeof module !== 'undefined' ) 
    module.exports = Function.prototype.procesable;

Function.prototype.chain = function() {
  var me = this;
  return function() {
    var ret = me.apply(this, arguments);
    return ret === undefined ? this : ret;
  }
};

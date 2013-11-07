var assert = require("assert");

var a;

beforeEach(function(){
   a = [1,2,3];
});


describe('Array', function(){
  describe('#indexOf()', function(){
    it('debe retorna -1 si el valor no esta presente', function(){
      assert.equal(-1, a.indexOf(5));
      assert.equal(-1, a.indexOf(0));
    });
    it('debe retorna 1 si pedimos al primer valor', function(){
      assert.equal(0, a.indexOf(1));
    });
  });
});

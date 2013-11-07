var assert = require("assert");
describe('Array', function(){
  describe('#indexOf()', function(){
    it('debe retorna -1 si el valor no esta presente', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

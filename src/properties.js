
var Properties =  {};

Properties.add = function (propA, propB) {
    var nProp = {};
    for (var name in propA) {
	nProp[name] = propA[name];
    }
    for (var name in propB) {
	nProp[name] = propB[name];
    }
    return nProp;
};



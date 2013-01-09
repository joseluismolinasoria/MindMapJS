
var Element = function(name, prop) {
    var e = document.createElement(name);
    
    // recorremos el objeto que nos han pasado como parámetro...
    for (var name in prop) {
	if ( name === 'innerHTML' )
	    e[name] = prop[name];
	else
	    e.setAttribute(name, prop[name]);
    }

    e.remove = function () {
	this.parentNode.removeChild(this);
    }

    return e; 
};

////////////////////////////////////////
//          EJEMPLO DE USO            //
////////////////////////////////////////
/*
var div = new Element('div', { 'id' : 'divId', 
			       'style': 'background-color: red', 
			       'innerHTML': 'Creado de forma dinámica' });
div instanceof Element;

document.body.appendChild(div);

div = document.getElementById('divId');
console.log (div.innerHTML);
*/
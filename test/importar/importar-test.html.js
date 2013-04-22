var imp = new MM.importar.XML();

function cargarFichero(evt) {
    var file = evt.target.files[0];
    MM.importar.evento.subscribir("xml/parseado", function ( xmlDoc ) {

        document.getElementById('salida').innerHTML = "";
	recorrer ( xmlDoc.documentElement );
    });
    MM.importar.evento.subscribir("xml/procesado", function ( json ) {
        document.getElementById('salidaJSON').innerHTML = JSON.stringify(json);
    });

    imp.cargar(file);
};

var recorrer = function (elemento, profundidad) {

    profundidad = profundidad || 0;

    document.getElementById('salida').innerHTML += tratarElemento(elemento, profundidad);

    for (var i = 0 ; i < elemento.childNodes.length; i++) {
	if ( elemento.childNodes[i].nodeType === 1 )
	    recorrer(elemento.childNodes[i], profundidad + 1 );
    };
};

var tratarElemento = function (elemento, profundidad) {
    profundidad = profundidad || 0;
    var str = "";
    for ( var i = 0; i <= profundidad; i++ ) {
	str += "&nbsp;&nbsp;&nbsp;&nbsp;";
    }

    str += elemento.nodeType  + " - " + elemento.nodeName + " ( " + tratarAtributos(elemento) + " )";

    i = null;
    return str + "<br>";
};

var tratarAtributos = function (elemento) {
    var str = "";
    for ( var i = 0 ; i < elemento.attributes.length; i++ ) {
	str += " " + elemento.attributes[i].name + "=" + elemento.attributes[i].value;
    }
    i = null;
    return str;
};

window.onload = function () {
      document.getElementById('ficheros').addEventListener('change', cargarFichero, false);
};

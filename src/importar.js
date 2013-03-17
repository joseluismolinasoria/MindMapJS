/**
 * @file importar.js Contiene toda la funcionalidad con respecto a la carga y/o importacion de ficheros.
 * @author José Luis Molina Soria
 * @version 20130312
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./pubsub.js');
}


/**
 * @class MM.Importar
 * @classdesc Realizar la carga de un fichero de texto. Contiene 
 *            la funcionalidad básica para soportar la importaciones de ficheros.
 * @constructor MM.Importar
 */
MM.Importar = function() {

    /** @lends MM.Importar.prototype */
    var f = MM.PubSub.extend({

	/**
	 * @desc Proceso de carga de un fichero
	 * @param file {File} Fichero que deseamos cargar
	 */
	cargar : function (file) {
            this.file = file;
	    
            if (this.file) {
		var reader = new FileReader();
		reader.onloadstart = MM.Class.bind(cargarInicio);
		reader.onprogress = MM.Class.bind(progreso);
		reader.onload = MM.Class.bind(cargado);
		reader.onabort = MM.Class.bind(abortado);
		reader.onerror = MM.Class.bind(error);
		reader.onloadend = MM.Class.bind(cargarFin);
		reader.readAsText(this.file, "UTF-8");
            }
	}
    });

    var cargarInicio = function (evt) {
        this.on("inicio", evt);
    };

    var cargarFin = function (evt) {
        this.on("fin", evt);
    };

    var abortado = function (evt) {
        this.on("abortado", evt);
    };

    var progreso = function (evt) {
        if (evt.lengthComputable) {
            var porcentaje = (evt.loaded / evt.total) * 100;
            if (porcentaje < 100)
                this.on("progreso", porcentaje, evt);
        }
    };

    var cargado = function (evt) {
        this.on("cargado", evt.target.result, evt );
    };

    var error = function (evt) {
        if (evt.target.error.name == "NotFoundError")
            return;
        if (evt.target.error.name == "SecurityError")
            this.on ( "error/seguridad", evt );
        if (evt.target.error.name == "NotReadableError")
            this.on ( "error/lectura", evt );
        if (evt.target.error.name == "EncodingError")
            this.on ( "error/encoding", evt );
    };

    return f;
}();


MM.Importar.FreeMind = function() {

    /** @lends MM.Importar.FreeMind.prototype */
    var f = new MM.Importar.extend({

	/**
	 * @desc Proceso de carga de un fichero
	 * @param file {File} Fichero que deseamos cargar
	 */
	cargar : function (file) {
	    this.subscribir ( "cargado", cargado, this);
            this.subscribir ( "error/seguridad", errorCarga, this );
            this.subscribir ( "error/lectura", errorCarga, this );
	    this.subscribir ( "error/encoding", errorCarga, this );
	    this._super(file);
	}
    });

    var cargado = function ( datos, evt ) {
	var xmlDoc = getXmlDoc ( datos );
	f.on ( 'parseado', xmlDoc );
    };

    var errorCarga = function ( evt ) {
	alert ( evt.target.error.name );
    };

    var getXmlDoc = function ( datos ) {
	var xmlDoc = parser;
	if (window.DOMParser) {
            parser = new DOMParser();
            xmlDoc = parser.parseFromString ( datos, "text/xml" );
	} else { // Sólo para IE < 9
            xmlDoc = new ActiveXObject ( "Microsoft.XMLDOM" );
            xmlDoc.async = false;
            xmlDoc.loadXML ( datos );
	    // document.write("Error code: " + xmlDoc.parseError.errorCode);
	    // document.write("Error reason: " + xmlDoc.parseError.reason);
	    // document.write("Error line: " + xmlDoc.parseError.line);
	}
	
	return xmlDoc;
    };

    return f;
}();


if ( typeof module !== 'undefined' ) 
    module.exports = MM.Importar;



// function loadXMLDocErr(dname)
// {
//     try //Internet Explorer
//     {
// 	xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
// 	xmlDoc.async=false;
// 	xmlDoc.load(dname); 	
// 	if (xmlDoc.parseError.errorCode != 0)
// 	{
// 	    alert("Error in line " + xmlDoc.parseError.line +
// 		  " position " + xmlDoc.parseError.linePos +
// 		  "\nError Code: " + xmlDoc.parseError.errorCode +
// 		  "\nError Reason: " + xmlDoc.parseError.reason +
// 		  "Error Line: " + xmlDoc.parseError.srcText);
// 	    return(null);
// 	}
//     }
//     catch(e)
//     {
// 	try //Firefox
// 	{
// 	    xmlDoc=document.implementation.createDocument("","",null);
// 	    xmlDoc.async=false;
// 	    xmlDoc.load(dname);
// 	    if (xmlDoc.documentElement.nodeName=="parsererror")
// 	    {
// 		alert(xmlDoc.documentElement.childNodes[0].nodeValue);
// 		return(null);
// 	    }
// 	}
// 	catch(e) {alert(e.message)}
//     }
//     try
//     {
// 	return(xmlDoc);
//     }
//     catch(e) {alert(e.message)}
//     return(null);
// }

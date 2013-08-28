/**
 * @file importar.js Contiene toda la funcionalidad con respecto a la carga y/o importacion de ficheros.
 * @author José Luis Molina Soria
 * @version 20130512
 */

if ( typeof module !== 'undefined' ) {
    var MM = require('./MindMapJS.js');
    MM.Class = require('./pubsub.js');
}


/**
 * Contiene la funcionalidad básica para soportar la importaciones de ficheros.
 *
 * @namespace MM.importar
 * @property {MM.importar.XML}        XML       - Clase encargada de parsear un fichero XML genérico
 * @property {MM.importar.FreeMind}   FreeMind  - Clase encargada de importar ficheros FreeMind
 */
MM.importar = function() {

    var evento = new MM.PubSub();

    /**
     * @desc Inicia la carga de un fichero de texto
     * @param file {File} Fichero que deseamos cargar
     * @param [encoding] {string} Enconding del fichero a cargar
     */
    var texto = function (file, encoding) {
        if (file) {
            var reader = new FileReader();
            reader.onloadstart = cargarInicio;
            reader.onprogress = progreso;
            reader.onload = cargado;
            reader.onabort = abortado;
            reader.onerror = error;
            reader.onloadend = cargarFin;
            reader.readAsText(file, encoding || "UTF-8");
        }
    };

    /**
     * @desc Inicia la carga de un fichero como dataURL
     * @param file {File} Fichero que deseamos cargar
     */
    var dataURL = function (file) {
        if (file) {
            var reader = new FileReader();
            reader.onloadstart = cargarInicio;
            reader.onprogress = progreso;
            reader.onload = cargado;
            reader.onabort = abortado;
            reader.onerror = error;
            reader.onloadend = cargarFin;
            reader.readAsDataURL(file);
        }
    };

    var cargarInicio = function (evt) {
        evento.on("inicio", evt);
    };

    var cargarFin = function (evt) {
        evento.on("fin", evt);
    };

    var abortado = function (evt) {
        evento.on("abortado", evt);
    };

    var progreso = function (evt) {
        if (evt.lengthComputable) {
            var porcentaje = (evt.loaded / evt.total) * 100;
            if (porcentaje < 100) {
                evento.on("progreso", porcentaje, evt);
            }
        }
    };

    var cargado = function (evt) {
        evento.on("cargado", evt.target.result, evt );
    };

    var error = function (evt) {
        if (evt.target.error.name === "NotFoundError") {
            return;
        }
        if (evt.target.error.name === "SecurityError") {
            evento.on ( "error/seguridad", evt );
        }
        if (evt.target.error.name === "NotReadableError") {
            evento.on ( "error/lectura", evt );
        }
        if (evt.target.error.name === "EncodingError") {
            evento.on ( "error/encoding", evt );
        }
    };


    return {
        evento : evento,
        texto : texto,
        dataURL : dataURL
    };
}();


/**
 * @class MM.importar.XML
 * @classdesc Clase para parsear ficheros xml.
 * @constructor MM.importar.XML
 */
MM.importar.XML = function() {

    var f = MM.Class.extend( /** @lends MM.importar.XML.prototype */{

        /**
         * @desc Proceso de carga de un fichero XML
         * @param file       {File}     Fichero que deseamos cargar
         * @param [encoding] {String} Codifiación del fichero
         */
        cargar : function (file, encoding) {
            this.idSusCargado = MM.importar.evento.suscribir ( "cargado", cargado, this);
            this.idSusErrorSeg = MM.importar.evento.suscribir ( "error/seguridad", errorCarga, this );
            this.idSusErrorLec = MM.importar.evento.suscribir ( "error/lectura", errorCarga, this );
            this.idSusErrorEnc = MM.importar.evento.suscribir ( "error/encoding", errorCarga, this );
            MM.importar.texto(file, encoding);
        }
    });

    var cargado = function ( datos, evt ) {
        var xmlDoc = getXmlDoc ( datos );
        MM.importar.evento.on ( 'xml/parseado', xmlDoc );
        var json = procesar (xmlDoc.documentElement);
        MM.importar.evento.on ( 'xml/procesado', json );
        MM.importar.evento.desSuscribir(this.idSusCargado);
        MM.importar.evento.desSuscribir(this.idSusErrorSeg);
        MM.importar.evento.desSuscribir(this.idSusErrorLec);
        MM.importar.evento.desSuscribir(this.idSusErrorEnc);
    };

    var procesar = function ( elemento ) {
        var obj = { 
            nombre : elemento.nodeName,
            hijos : []
        };
        var i;

        // establecemos los atributos del nodo 
        if ( elemento.attributes ) {
            for ( i = 0; i < elemento.attributes.length; i++ ) {
                obj[elemento.attributes[i].name] = elemento.attributes[i].value;
            }
        }
        // procesamos los hijos del elemento
        if ( elemento.childNodes ) {
            for ( i = 0 ; i < elemento.childNodes.length; i++) {
                if ( elemento.childNodes[i].nodeType === 3 ) {
                    obj.texto = elemento.childNodes[i].nodeValue;
                } else if ( elemento.childNodes[i].nodeType === 1 ) {
                        obj.hijos.push ( procesar(elemento.childNodes[i]) );
                }
            }
        }
        i = null;
        return obj;
    };


    var errorCarga = function ( evt ) {
        console.log ( evt ); // TODO procesar errores
    };

    var getXmlDoc = function ( datos ) {
        var xmlDoc, parser;
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
        parser = null;
        return xmlDoc;
    };

    return f;
}();


/**
 * @class MM.importar.FreeMind
 * @classdesc Clase para parsear ficheros con el formato xml de FreeMind. Crea un nuevo
 * Mapa mental, borrando el existente, con los datos cargados del fichero.
 * @constructor MM.importar.FreeMind
 */
MM.importar.FreeMind = function() {

    
    var f = MM.importar.XML.extend(/** @lends MM.importar.FreeMind.prototype */{

        /**
         * @desc Proceso de carga de un fichero FreeMind
         * @param file {File} Fichero que deseamos cargar
         */
        cargar : function (file, encoding) {
            this.idSus = MM.importar.evento.suscribir ( "xml/procesado", procesado, this);
            this._super(file, encoding);
        }
    });

    var procesado = function ( obj ) {
        if ( obj.nombre !== 'map' || obj.hijos.length !== 1 ) {
            MM.importar.evento.on("freeMind/error", "No se trata de un fichero FreeMind válido");
            return;
        }
        var raiz = obj.hijos[0];
        MM.nuevo(raiz.TEXT || raiz.text);
        MM.importar.evento.on("freeMind/raiz", raiz.TEXT || raiz.text);
        procesarHijos(raiz);
        MM.importar.evento.on("freeMind/procesado");
        MM.importar.evento.desSuscribir(this.idSus);
        raiz = null;
    };

    var procesarHijo = function ( obj ) {
        var texto = 
        MM.add(obj.TEXT || obj.text).next().lastHermano();
        procesarHijos( obj );
        MM.padre();
    };


    var procesarHijos = function ( obj ) {
        for ( var i = 0; i < obj.hijos.length; i++ ) {
            if ( obj.hijos[i].nombre === "node" ) {
                procesarHijo(obj.hijos[i]);
            }
        }
        i = null;
    };

    return f;
}();


if ( typeof module !== 'undefined' ) {
    module.exports = MM.importar;
}



// function loadXMLDocErr(dname)
// {
//     try //Internet Explorer
//     {
//      xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
//      xmlDoc.async=false;
//      xmlDoc.load(dname);     
//      if (xmlDoc.parseError.errorCode != 0)
//      {
//          alert("Error in line " + xmlDoc.parseError.line +
//                " position " + xmlDoc.parseError.linePos +
//                "\nError Code: " + xmlDoc.parseError.errorCode +
//                "\nError Reason: " + xmlDoc.parseError.reason +
//                "Error Line: " + xmlDoc.parseError.srcText);
//          return(null);
//      }
//     }
//     catch(e)
//     {
//      try //Firefox
//      {
//          xmlDoc=document.implementation.createDocument("","",null);
//          xmlDoc.async=false;
//          xmlDoc.load(dname);
//          if (xmlDoc.documentElement.nodeName=="parsererror")
//          {
//              alert(xmlDoc.documentElement.childNodes[0].nodeValue);
//              return(null);
//          }
//      }
//      catch(e) {alert(e.message)}
//     }
//     try
//     {
//      return(xmlDoc);
//     }
//     catch(e) {alert(e.message)}
//     return(null);
// }

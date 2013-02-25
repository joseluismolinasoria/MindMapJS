/**
 * @file Describe the file
 * @author Some Author
 * @version 20121008
 */
/**
 * @namespace Fichero
 * @type {Fichero}
 */
var Fichero = function () {
    var f = new PubSub();

    f.leer = function (file) {
        this.file = file;
        // var file = document.getElementById('file').files[0];
        if (this.file) {
            var reader = new FileReader();
            reader.onloadstart = cargarInicio;
            reader.onprogress = progreso;
            reader.onload = cargado;
            reader.onabort = abortado;
            reader.onerror = error;
            reader.onloadend = cargarFin;
            reader.readAsText(this.file, "UTF-8");
        }
    };

    var cargarInicio = function (evt) {
        f.on("inicio", evt);
    };

    var cargarFin = function (evt) {
        f.on("fin", evt);
    };

    var abortado = function (evt) {
        f.on("abortado", evt);
    };

    var progreso = function (evt) {
        if (evt.lengthComputable) {
            var porcentaje = (evt.loaded / evt.total) * 100;
            if (porcentaje < 100)
                f.on("progreso", porcentaje, evt);
        }
    };

    var cargado = function (evt) {
        f.on("cargado", evt.target.result, evt );
    };

    var error = function (evt) {
        if (evt.target.error.name == "NotFoundError")
            return;
        if (evt.target.error.name == "SecurityError")
            f.on("error/seguridad", evt );
        if (evt.target.error.name == "NotReadableError")
            f.on("error/lectura", evt );
        if (evt.target.error.name == "EncodingError")
            f.on("error/encoding", evt );
    };

    return f;
}();

//        if (window.DOMParser)
//        {
//            parser=new DOMParser();
//            xmlDoc=parser.parseFromString(txt,"text/xml");
//        }
//        else // Internet Explorer
//        {
//            xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
//            xmlDoc.async=false;
//            xmlDoc.loadXML(txt);
//        }

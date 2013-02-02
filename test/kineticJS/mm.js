var MM = function (contenedor, width, height) {

    var escenario = new Kinetic.Stage({
        container: contenedor,
        width: width,
        height: height
    });

    var capaNodos = new Kinetic.Layer();   
    var capaAristas = new Kinetic.Layer();
    var capaMensajes = new Kinetic.Layer();

    mensaje = new Mensaje (escenario, capaMensajes, {x:5, y:5, text:"mensaje..."});
    mensaje2 = new Mensaje(escenario, capaMensajes, {x: 5, y: 18, text: 'Nodo posición x: 100, y: 60'});
    nodoOrigen = new Nodo(escenario, capaNodos, {x: 100, y: 60, text: 'Nodo Origen'});
    nodoDestino = new Nodo(escenario, capaNodos, {x: 300, y: 10, text: 'Nodo Destino'});
 
    escenario.add ( capaAristas );
    escenario.add ( capaNodos );

    arista = new Arista( capaAristas, nodoOrigen, nodoDestino );
};


window.onload = function () {
    var mm = new MM ('contenedor', 600, 400);
};

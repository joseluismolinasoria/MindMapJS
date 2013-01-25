function curva1(canvas, x1, y1, x2, y2) {
    var context = canvas.getContext();
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.quadraticCurveTo(x1 + (x2-x1)/2, y2, x2, y2);
    context.strokeStyle = 'red';
    context.lineWidth = 4;
    context.stroke();
}

function curva2 (canvas, x1, y1, x2, y2) {
    var context = canvas.getContext();
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.bezierCurveTo(x1+(x2-x1)/2, y1, x1+(x2-x1)/2, y2, x2, y2);
    context.strokeStyle = 'blue';
    context.lineWidth = 4;
    context.stroke();
}

function curva3 (canvas, x1, y1, x2, y2) {
    var context = canvas.getContext();
    
    context.beginPath();
    context.moveTo(x1, y1);
    context.bezierCurveTo(x1+(x2-x1)/1.5, y1+(y2-y1)/1.5, x1+(x2-x1)/2, y2, x2, y2);
    context.strokeStyle = 'green';
    context.lineWidth = 4;
    context.stroke();
}

window.onload = function () {
    var stage = new Kinetic.Stage({
        container: 'contenedor',
        width: 600,
        height: 400
    });
    
    var layer = new Kinetic.Layer();
    stage.add(layer);
    
    for ( var i = 0; i <= 10; i++ )
	curva1(layer.getCanvas(), 0, 200, 150, (40*i));
    for ( var i = 0; i <= 10; i++ )
	curva2(layer.getCanvas(), 150, 200, 300, (40*i));
    for ( var i = 0; i <= 10; i++ )
	curva3(layer.getCanvas(), 300, 200, 450, (40*i));
}


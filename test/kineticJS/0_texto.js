function load() {
    var simpleText = new Kinetic.Text({
        x: 20,
        y: 20,
        text: 'Simple Text',
        stroke: '#f55',
	textWidth: 2,
        fontSize: 16,
        fontFamily: 'helvetica'
    });
    
    var complexText = new Kinetic.Text({
        x: 100,
        y: 60,
        stroke: '#555',
        strokeWidth: 2,
        text: 'Prueba para texto\nsegunda línea',
        fontSize: 16,
        fontFamily: 'helvetica',
        width: 'auto',
        padding: 20,
        align: 'center',
        fontStyle: 'italic',
        shadow: {
            color: 'black',
            blur: 10,
            offset: [10, 10],
            opacity: 0.4
        },
        cornerRadius: 10
    });
    
    
    var stage = new Kinetic.Stage({
        container: 'container',
        width: 578,
        height: 200
    });
    
    var layer = new Kinetic.Layer();
    layer.add(simpleText);
    layer.add(complexText);
    stage.add(layer);
}


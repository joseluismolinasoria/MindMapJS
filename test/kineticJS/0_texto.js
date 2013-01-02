      var simpleText = new Kinetic.Text({
        x: 190,
        y: 15,
        text: 'Simple Text',
        fontSize: 30,
        fontFamily: 'Calibri',
        textFill: 'green'
      });

      var complexText = new Kinetic.Text({
        x: 100,
        y: 60,
        stroke: '#555',
        strokeWidth: 3,
        fill: '#ddd',
        text: 'Prueba para texto\nsegunda línea',
        fontSize: 10,
        fontFamily: 'Calibri',
        textFill: '#555',
        width: 'auto',
        padding: 20,
        align: 'center',
        fontStyle: 'italic',
        shadow: {
          color: 'black',
          blur: 10,
          offset: [10, 10],
          opacity: 0.2
        },
        cornerRadius: 10
      });


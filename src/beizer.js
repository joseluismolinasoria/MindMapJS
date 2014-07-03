(function() {
    Kinetic.Beizer = function(config) {
        this.___init(config);
    };

    Kinetic.Beizer.prototype = {
        // Tiene que recibir un Objecto, puntos = { start : {x,y}, end: {x,y}, control1 : {x,y}, control2 : {x,y} }
        ___init: function(config) {
            Kinetic.Shape.call(this, config);
            this.className = 'Beizer';
        },

        drawFunc: function(canvas) {
    console.log('beizer');
            var context = canvas.getContext(), 
                puntos = this.attrs.puntos;

            context.beginPath();
            context.moveTo(puntos.start.x, puntos.start.y);
            context.bezierCurveTo ( puntos.control1.x, puntos.control1.y,
                                    puntos.control2.x, puntos.control2.y,
                                    puntos.end.x, puntos.end.y );
            canvas.stroke(this);
        }
    };
    Kinetic.Util.extend(Kinetic.Beizer, Kinetic.Shape);

    // add getters setters
    Kinetic.Factory.addGetterSetter(Kinetic.Beizer, 'puntos', 0);
})();
 

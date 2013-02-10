var Nodo = Mensaje.extend({
    defecto: {
        x: 0,
        y: 0,
        text: '',
        fontSize: 12,
        fontFamily: 'Calibri',
        fill: '#555',
        width: 'auto',
        padding: 5,
        align: 'center'
    },

    init: function (mm, escenario, capa, propiedades) {
	this.mm = mm;
        this.escenario = escenario;
        this.capa = capa;
        var prop = Properties.add(this.defecto, propiedades);
        this.kText = new Kinetic.Text(prop);

        this.rect = new Kinetic.Rect({
            x: this.getX(),
            y: this.getY(),
            stroke: '#555',
            strokeWidth: 2,
            fill: '#ddd',
            width: this.getWidth(),
            height: this.getHeight(),
            shadowColor: 'black',
            shadowBlur: 5,
            shadowOffset: [3, 3],
            shadowOpacity: 0.5,
            cornerRadius: 7
        });

	var self = this;
        this.group = new Kinetic.Group({draggable: true,
            dragBoundFunc: function (pos) {
                self.mm.renderAristas();
                return pos;
            }});
        this.group.add(this.rect);
        this.group.add(this.kText);
        this.capa.add(this.group);

        var bindMensaje = Class.bind(this, this.ponerMensaje);
        var bindPosicion = Class.bind(this, this.ponerPosicion);
        var bindEditar = Class.bind(this, this.editar);
        var bindNOP = Class.bind(this, this.nop);
        this.group.on('click', bindMensaje);
        this.group.on('dblclick', bindEditar);
        this.group.on('mouseout', bindMensaje);
        this.group.on('mousemove', bindMensaje);
        this.group.on('mousedown', bindMensaje);
        this.group.on('mouseup', bindMensaje);
        this.group.on('mouseenter', bindMensaje);
        this.group.on('mouseLeave', bindMensaje);
        this.group.on('dragstart', bindPosicion);
        this.group.on('dragend', bindPosicion);
    },

    ponerFoco : function () {
	this.rect.setStroke('#5268F2');
	this.rect.setShadowColor('blue');
	this.capa.draw();
    },

    quitarFoco : function () {
	this.rect.setStroke('#555');
	this.rect.setShadowColor('black');
	this.capa.draw();
    },


    editar: function () {
        var textarea = new Element('textarea',
            { 'id': 'editNodo',
                'innerHTML': this.getText(),
                'style': 'position: absolute; ' +
                    'top : ' + this.rect.getAbsolutePosition().y + 'px; ' +
                    'left: ' + this.rect.getAbsolutePosition().x + 'px; ' +
                    'min-width: ' + this.rect.getWidth() + 'px; ' +
                    'min-height: ' + this.rect.getHeight() + 'px; ' +
                    'border: ' + this.rect.getStrokeWidth() + 'px solid ' + this.rect.getStroke() + '; ' +
                    'border-radius: ' + this.rect.getCornerRadius() + 'px;' +
                    'background-color: ' + this.rect.getFill() + '; ' +
                    'color: ' + this.kText.getFill() + '; ' +
                    'font-family: ' + this.kText.getFontFamily() + '; ' +
                    'font-size: ' + this.kText.getFontSize() + 'pt; ' +
                    'white-space: pre-wrap; word-wrap: break-word; overflow:hidden; height:auto;'
            });
        var self = this;
        textarea.onblur = function () {
            self.setText(this.value);
            self.rect.setWidth(self.getWidth());
            self.rect.setHeight(self.getHeight());
            self.capa.draw();
            this.remove();
        };
        document.body.appendChild(textarea);
        textarea.select();
        textarea.focus();
    },

    ponerPosicion: function (evento) {
        console.log('Nodo posición : ' + this.posicionString());
    },

    ponerMensaje: function (evento) {
        console.log(evento + ': ' + this.posicionString());
    },

    posicionString: function () {
        var mousePos = this.escenario.getMousePosition();
        return 'x: ' + mousePos.x + ', y: ' + mousePos.y;
    },

    nop: function () {
    }

});

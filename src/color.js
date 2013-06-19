/**
 * @file color.js Funciones y utiles para manejo de colores.
 * @author José Luis Molina Soria
 * @version 20130523
 */

MM.color = {};

/** 
 * @desc Función semialeatoria de colores en formato HSL. Esta función ha
 *       sido ajustada para evitar colores molestos o demasiado claros/oscuros.
 * @method randomHslColor 
 * @return {Object} Objecto con los campos h, s y l 
 * @memberof MM.color
 * @static
 */
MM.color.randomHslColor = function () {
    var rand = function (max, min) {
        return parseInt(Math.random() * (max-min+1), 10) + min;
    };

    // h = Tonalidad 1-360;  s = saturación 30-100%;  l = brillo 20-50%
    return { h: rand(1, 360), s: rand(30, 100), l:rand(20, 50) };
};

MM.color.addBrillo = function (hsl, offsetBrillo) {
    offsetBrillo = offsetBrillo || 0;
    return { h: hsl.h, s: hsl.s, l: hsl.l+offsetBrillo };
};


/** 
 * @desc Calcula la cadena hsl en formato CSS
 * @method hslToCSS
 * @param {Object} hsl          Objecto con los campos h, s y l 
 * @param {number} offsetBrillo Desplazamiento al brillo. 
 * @return {string} Cadena CSS del color en formato HSL
 * @memberof MM.color
 * @static
 */
MM.color.hslToCSS = function ( hsl, offsetBrillo ) {
    offsetBrillo = offsetBrillo || 0;
    return 'hsl(' + Math.floor(hsl.h) + ',' + Math.floor(hsl.s) + '%,' + Math.floor(hsl.l + offsetBrillo) + '%)';
};

MM.color.rgbToCSS = function ( rgb ) {
    return 'rgb(' + Math.floor(rgb.r) + ', ' + Math.floor(rgb.g) + ', ' + Math.floor(rgb.b) + ')';
};

MM.color.rgbToHexCSS = function ( rgb ) {
    
    return '#' + MM.color.intToHex (rgb.r) + MM.color.intToHex (rgb.g) + MM.color.intToHex (rgb.b);
};


MM.color.intToHex = function ( valor, longitud ) {
    longitud = longitud || 2;
    var hex = Math.floor(valor).toString(16);
    while ( hex.length < longitud ) { hex = '0' + hex; }
    return hex;
};


MM.color.hue = function  ( rgb, maximum, range ) {
    var hue = 0;
    if (range !== 0) {
        switch (maximum) {
        case rgb.r:
            hue = (rgb.g - rgb.b) / range * 60;
            if (hue < 0) { hue += 360; }
            break;
        case rgb.g:
          hue = (rgb.b - rgb.r) / range * 60 + 120;
          break;
        case rgb.b:
          hue = (rgb.r - rgb.g) / range * 60 + 240;
          break;
        }
    }
    return hue;
};

MM.color.rgbToHsl = function ( rgb ) {
    var maximum = Math.max(rgb.r, rgb.g, rgb.b);
    var range   = maximum - Math.min(rgb.r, rgb.g, rgb.b);
    var l = maximum / 255 - range / 510;
    
    return {
        'h' : MM.color.hue(rgb, maximum, range),
        's' : (range === 0 ? 0 : range / 2.55 / (l < 0.5 ? l * 2 : 2 - l * 2)),
        'l' : 100 * l
    };
};


MM.color.hslToRgb = function ( hsl ) {
    var rgb = {
        'r' : hsl.l * 2.55,
        'g' : hsl.l * 2.55,
        'b' : hsl.l * 2.55
    };

    if (hsl.s !== 0) {
        var p = hsl.l < 50
                ? hsl.l * (1 + hsl.s / 100)
                : hsl.l + hsl.s - hsl.l * hsl.s / 100;
        var q = 2 * hsl.l - p;
        
        rgb = {
            'r' : (hsl.h + 120) / 60 % 6,
            'g' : hsl.h / 60,
            'b' : (hsl.h + 240) / 60 % 6
        };

        for (var key in rgb) {
            if (rgb.hasOwnProperty(key)) {
                if (rgb[key] < 1) {
                    rgb[key] = q + (p - q) * rgb[key];
                } else if (rgb[key] < 3) {
                    rgb[key] = p;
                } else if (rgb[key] < 4) {
                    rgb[key] = q + (p - q) * (4 - rgb[key]);
                } else {
                    rgb[key] = q;
                }
                rgb[key] *= 2.55;
            }
        }
    }
    return rgb;
};

/**
  var rgb = { r: 250, g: 235, b: 215 };
  var hsl = { h: 34, s: 78, l: 91 };
  
*/

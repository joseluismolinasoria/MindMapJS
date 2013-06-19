# MindMapJS

  Librería JavaScript para Editores de mapas mentales.

  Para poder utilizar, compilar y/o construir el proyecto necesitas tener instalado [node](http://nodejs.org/) y [grunt](http://gruntjs.com/). 

---
### Resolver dependencias. 
   
  Una vez instalado node y grunt. Ejecuta la siguiente instrucción, en consola, para resolver las dependencias.

  `$ npm install`

---
### Construir el proyecto.
#### Versión de desarrollo.
  Para obtener una versión para desarrollo. Ejecuta el siguiente comando.
  
  `$ grunt dev`
  
  Con el obtendremos una concatenación de todos los módulos del MindMapJS. *dist/MindMapJS-vXXX.js* donde XXX es la versión.
    
#### Versión de producción.
  Para versión de producción es identica a la versión desarrollo pero comprimida con [Uglify](https://github.com/mishoo/UglifyJS).

  `$ grunt full`
    
  El fichero comprimido es *dist/MindMapJS-vXXX.min.js*

---
### JSHint
  Valida el código fuente en función de la especificación [JSHint](http://www.jshint.com/).

  `$ grunt hint`

---
### Tests
  Lanza la batería de pruebas.

  `$ grunt test`

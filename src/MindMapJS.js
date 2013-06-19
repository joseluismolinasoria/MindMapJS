/**
 * @file MindMapJS.js Definición del espacio de nombres de la aplicación MM
 * @author José Luis Molina Soria
 * @version @@version
 * @date    @@date
 */

/**
 * Espacio de nombres de la aplicación MindMapJS. Reducido a MM por comodidad
 * @namespace MM
 * @property {MM.Class}        Class      - Sistema de clases para MM
 * @property {MM.Arbol}        Arbol      - Constructor de Árboles enarios.
 * @property {MM.Properties}   Properties - Extensión para manejo de propiedades
 * @property {MM.DOM}          DOM        - Funciones para manejo del DOM
 * @property {MM.PubSub}       PubSub     - Patrón Publish/Subscribe
 * @property {MM.teclado}      teclado    - Gestión y manejo de eventos de teclado
 */
var MM = {}; 

if ( typeof module !== 'undefined' ) {
    module.exports = MM;
}

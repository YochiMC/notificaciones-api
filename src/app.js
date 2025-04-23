/*Archivo que inicializa nuestra aplicación*/

/*Importación de los módulos*/
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express(); //Aquí se define la app de express y el puerto

/*Funciones de la app*/
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(require('./routes/index'));

app.use(express.static(path.join(__dirname, 'public'))); 

module.exports = app; // Exporta la aplicación para usarla en otros archivos
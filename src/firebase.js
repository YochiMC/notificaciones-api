/*Aquí se realiza la conexión con firebase----------------------
Es necesaria la clave de la base de datos y crear el respectivo archivo*/

require('dotenv').config();

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore')

initializeApp({
    credential: applicationDefault()
});

const db = getFirestore();

module.exports = {
    db
};
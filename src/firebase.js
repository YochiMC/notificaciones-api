/*Aquí se realiza la conexión con firebase----------------------
Es necesaria la clave de la base de datos y crear el respectivo archivo*/

require('dotenv').config();
const path = require('path');
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Obtiene la ruta desde la variable de entorno o usa un valor por defecto
const firebaseKeyPath = process.env.FIREBASE_KEY_PATH || 'notificaciones-f6934-firebase-adminsdk-fbsvc-e1613be407.json';

// Construye la ruta absoluta al archivo JSON desde la raíz del proyecto
const serviceAccountPath = path.resolve(__dirname, firebaseKeyPath);
const serviceAccount = require(serviceAccountPath);

// Inicializa Firebase con la credencial
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Obtiene la instancia de Firestore
const db = getFirestore();

// Exporta la base de datos para usar en otros archivos
module.exports = {
  db
};
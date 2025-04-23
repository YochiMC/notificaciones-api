/*Importación de otros módulos*/
const app = require('./app'); 

const port = process.env.PORT || 3000; // Puerto por defecto o el que se especifique en el entorno

// Aquí se inicia el servidor
app.listen(port);
console.log(`Servidor escuchando en el puerto ${port}`);


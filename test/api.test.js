const request = require('supertest');
const app = require('./app'); // Asume que el servidor Express está en 'app.js'

describe('Pruebas básicas de API', () => {
  
  // Test 1: Comprobar que la API responde correctamente en la ruta raíz
  it('debe responder con estado 200 en la ruta raíz', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
  });

  // Test 2: Comprobar que la ruta '/tareas' devuelve una lista vacía
  it('debe devolver una lista vacía de tareas', async () => {
    const res = await request(app).get('/tareas');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]); // Esperamos que la lista de tareas esté vacía
  });

});

const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Simulamos las respuestas de Firebase usando jest.fn()
app.use(bodyParser.json());
const routes = require('../src/routes');
app.use('/api', routes);  // Rutas de la API

// Test 1: Obtener notificaciones (GET /api/notificaciones)
describe('GET /api/notificaciones', () => {
  it('should return a list of notifications', async () => {
    // Mock de la respuesta de Firebase
    const mockNotificaciones = [
      { id: '1', docente: 'Juan', mensaje: 'Clase sobre JS', fecha: '2022-10-01', nueva: true },
      { id: '2', docente: 'Maria', mensaje: 'Clase sobre Node.js', fecha: '2022-10-02', nueva: false }
    ];

    // Simula la implementación de Firebase
    jest.spyOn(require('../src/firebase').db, 'collection').mockReturnValue({
      orderBy: () => ({
        get: jest.fn().mockResolvedValue({
          docs: mockNotificaciones.map(noti => ({
            id: noti.id,
            data: () => noti
          }))
        })
      })
    });

    const res = await request(app).get('/api/notificaciones');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockNotificaciones);
  });
});

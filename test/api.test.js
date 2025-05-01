const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { db } = require('../src/firebase'); // Simularemos las funciones de Firebase

// Aquí simulamos las respuestas de Firebase
jest.mock('../src/firebase'); 

app.use(bodyParser.json());
const routes = require('../src/routes');
app.use('/api', routes);  // Rutas de la API

// Test 1: Obtener notificaciones (GET /api/notificaciones)
describe('GET /api/notificaciones', () => {
  it('should return a list of notifications', async () => {
    // Simulamos lo que Firebase nos devolvería
    db.collection.mockReturnValue({
      orderBy: () => ({
        get: jest.fn().mockResolvedValue({
          docs: [
            { id: '1', data: () => ({ docente: 'Juan', mensaje: 'Clase sobre JS', fecha: '2022-10-01', nueva: true }) },
            { id: '2', data: () => ({ docente: 'Maria', mensaje: 'Clase sobre Node.js', fecha: '2022-10-02', nueva: false }) }
          ]
        })
      })
    });

    const res = await request(app).get('/api/notificaciones');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { id: '1', docente: 'Juan', mensaje: 'Clase sobre JS', fecha: '2022-10-01', nueva: true },
      { id: '2', docente: 'Maria', mensaje: 'Clase sobre Node.js', fecha: '2022-10-02', nueva: false }
    ]);
  });
});

// Test 2: Crear una nueva notificación (POST /api/nueva-notificacion)
describe('POST /api/nueva-notificacion', () => {
  it('should create a new notification', async () => {
    // Simulamos la creación exitosa de una notificación en Firebase
    db.collection.mockReturnValue({
      add: jest.fn().mockResolvedValue({ id: '3' })
    });

    const newNotificacion = {
      docente: 'Juan Pérez',
      mensaje: 'Nueva clase sobre JavaScript'
    };

    const res = await request(app).post('/api/nueva-notificacion').send(newNotificacion);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Notificación guardada correctamente');
  });

  it('should return an error if required fields are missing', async () => {
    const res = await request(app).post('/api/nueva-notificacion').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Faltan campos: docente y mensaje son obligatorios.');
  });
});

// Test 3: Marcar notificación como vieja (PATCH /api/notificaciones/:id/nueva)
describe('PATCH /api/notificaciones/:id/nueva', () => {
  it('should mark a notification as read', async () => {
    // Simulamos la existencia de una notificación en Firebase
    db.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: true,
          data: () => ({ docente: 'Juan Pérez', mensaje: 'Clase de JS', nueva: true })
        }),
        update: jest.fn().mockResolvedValue()
      })
    });

    const res = await request(app).patch('/api/notificaciones/1/nueva');
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe('Notificación marcada como completada.');
  });

  it('should return 404 if notification not found', async () => {
    db.collection.mockReturnValue({
      doc: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({
          exists: false
        })
      })
    });

    const res = await request(app).patch('/api/notificaciones/nonexistent-id/nueva');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Notificación no encontrada.');
  });
});

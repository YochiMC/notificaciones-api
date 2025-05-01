const request = require('supertest');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Suponemos que tus rutas están en un archivo llamado 'routes/index.js'
const routes = require('../src/routes'); // Ajusta la ruta según la ubicación de tu archivo de rutas.

app.use(bodyParser.json());
app.use('/api', routes); // Define las rutas

// Test para obtener todas las notificaciones
describe('GET /api/notificaciones', () => {
  it('should return a list of notifications', async () => {
    const res = await request(app).get('/api/notificaciones');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Aseguramos que la respuesta sea un array
  });

  it('should return notifications with the correct fields', async () => {
    const res = await request(app).get('/api/notificaciones');
    expect(res.status).toBe(200);
    res.body.forEach((notificacion) => {
      expect(notificacion).toHaveProperty('id');
      expect(notificacion).toHaveProperty('docente');
      expect(notificacion).toHaveProperty('mensaje');
      expect(notificacion).toHaveProperty('fecha');
      expect(notificacion).toHaveProperty('nueva');
    });
  });
});

// Test para crear una nueva notificación
describe('POST /api/nueva-notificacion', () => {
  it('should create a new notification', async () => {
    const newNotificacion = {
      docente: 'Juan Pérez',
      mensaje: 'Nueva clase sobre JavaScript',
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

// Test para actualizar una notificación y marcarla como "vieja"
describe('PATCH /api/notificaciones/:id/nueva', () => {
  it('should mark a notification as read', async () => {
    // Primero, creamos una notificación para probar
    const newNotificacion = {
      docente: 'Juan Pérez',
      mensaje: 'Nueva clase sobre React',
    };

    const postRes = await request(app).post('/api/nueva-notificacion').send(newNotificacion);
    const notificacionId = postRes.body.id; // Suponiendo que la respuesta contiene el ID

    // Ahora, marcamos esa notificación como leída
    const res = await request(app).patch(`/api/notificaciones/${notificacionId}/nueva`);
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe('Notificación marcada como completada.');
  });

  it('should return 404 if notification not found', async () => {
    const res = await request(app).patch('/api/notificaciones/nonexistent-id/nueva');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Notificación no encontrada.');
  });
});

// Test para obtener todas las tareas
describe('GET /api/tareas', () => {
  it('should return a list of tasks', async () => {
    const res = await request(app).get('/api/tareas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true); // Aseguramos que la respuesta sea un array
  });
});

// Test para crear una nueva tarea
describe('POST /api/tareas', () => {
  it('should create a new task', async () => {
    const nuevaTarea = {
      materia: 'Matemáticas',
      detalle: 'Resolver problemas del capítulo 3',
    };

    const res = await request(app).post('/api/tareas').send(nuevaTarea);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Tarea guardada correctamente');
  });

  it('should return an error if required fields are missing', async () => {
    const res = await request(app).post('/api/tareas').send({});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Faltan campos: materia y detalle son obligatorios.');
  });
});

// Test para editar una tarea
describe('PUT /api/tareas/:id', () => {
  it('should update a task', async () => {
    // Primero, creamos una tarea para probar
    const nuevaTarea = {
      materia: 'Biología',
      detalle: 'Estudiar el ciclo del agua',
    };

    const postRes = await request(app).post('/api/tareas').send(nuevaTarea);
    const tareaId = postRes.body.id; // Suponiendo que la respuesta contiene el ID

    const tareaActualizada = {
      materia: 'Biología',
      detalle: 'Estudiar la fotosíntesis',
    };

    const res = await request(app).put(`/api/tareas/${tareaId}`).send(tareaActualizada);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Tarea actualizada correctamente');
  });

  it('should return 404 if task not found', async () => {
    const res = await request(app).put('/api/tareas/nonexistent-id').send({});
    expect(res.status).toBe(404);
    expect(res.text).toBe('Tarea no encontrada');
  });
});

// Test para eliminar una tarea
describe('DELETE /api/tareas/:id', () => {
  it('should delete a task', async () => {
    // Primero, creamos una tarea para probar
    const nuevaTarea = {
      materia: 'Historia',
      detalle: 'Leer el capítulo 5',
    };

    const postRes = await request(app).post('/api/tareas').send(nuevaTarea);
    const tareaId = postRes.body.id; // Suponiendo que la respuesta contiene el ID

    const res = await request(app).delete(`/api/tareas/${tareaId}`);
    expect(res.status).toBe(200);
    expect(res.text).toBe('Tarea eliminada correctamente');
  });

  it('should return 404 if task not found', async () => {
    const res = await request(app).delete('/api/tareas/nonexistent-id');
    expect(res.status).toBe(404);
    expect(res.text).toBe('Tarea no encontrada');
  });
});
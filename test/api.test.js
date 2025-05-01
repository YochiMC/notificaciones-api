const request = require('supertest');
const app = require('./app'); // Asume que el servidor Express está en 'app.js'

describe('Gestión de tareas y notificaciones', () => {

  // Test: Obtener tareas
  describe('GET /tareas', () => {
    it('debe devolver una lista de tareas vacía inicialmente', async () => {
      const res = await request(app).get('/tareas');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // Test: Crear tarea
  describe('POST /tareas', () => {
    it('debe crear una nueva tarea', async () => {
      const newTarea = { materia: 'Matemáticas', detalle: 'Resolver ejercicios de álgebra' };
      const res = await request(app)
        .post('/tareas')
        .send(newTarea);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(newTarea);
    });
  });

  // Test: Eliminar tarea
  describe('DELETE /tareas/:id', () => {
    it('debe eliminar una tarea existente', async () => {
      const newTarea = { materia: 'Ciencias', detalle: 'Estudiar biología' };
      const tareaRes = await request(app).post('/tareas').send(newTarea);
      const tareaId = tareaRes.body.id;
      
      const res = await request(app).delete(`/tareas/${tareaId}`);
      expect(res.status).toBe(200);

      // Verificar que la tarea ya no exista
      const getRes = await request(app).get('/tareas');
      expect(getRes.body).not.toContainEqual(expect.objectContaining({ id: tareaId }));
    });

    it('debe devolver un error si la tarea no existe', async () => {
      const res = await request(app).delete('/tareas/nonexistent-id');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Tarea no encontrada');
    });
  });

  // Test: Obtener notificaciones
  describe('GET /notificaciones', () => {
    it('debe devolver una lista de notificaciones vacía inicialmente', async () => {
      const res = await request(app).get('/notificaciones');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  // Test: Crear notificación
  describe('POST /nueva-notificacion', () => {
    it('debe crear una nueva notificación', async () => {
      const newNotificacion = { docente: 'Juan', mensaje: 'Nueva tarea sobre álgebra' };
      const res = await request(app)
        .post('/nueva-notificacion')
        .send(newNotificacion);
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject(newNotificacion);
    });
  });

  // Test: Marcar notificación como completada
  describe('PATCH /notificaciones/:id/nueva', () => {
    it('debe marcar una notificación como completada', async () => {
      const newNotificacion = { docente: 'Juan', mensaje: 'Clase de historia' };
      const notiRes = await request(app).post('/nueva-notificacion').send(newNotificacion);
      const notiId = notiRes.body.id;

      const res = await request(app).patch(`/notificaciones/${notiId}/nueva`);
      expect(res.status).toBe(200);
      expect(res.body.mensaje).toBe('Notificación marcada como completada.');

      // Verificar que la notificación ahora está marcada como completada
      const getRes = await request(app).get('/notificaciones');
      expect(getRes.body[0].nueva).toBe(false);
    });

    it('debe devolver un error si la notificación no existe', async () => {
      const res = await request(app).patch('/notificaciones/nonexistent-id/nueva');
      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Notificación no encontrada');
    });
  });
});

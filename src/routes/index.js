/*Este archivo es el indice de las rutas
/*Aquí se definen todas las rutas de la API
POST, GET, etc...

Esto va en base de las acciones necesarias para las notificaciones:
lanzar notificicacion
mostrar notificaciones
marcar notificación como vieja*/
const { Router } = require('express');
const { db } = require('../firebase');

const router = Router();

// Obtener todas las notificaciones
router.get('/notificaciones', async (req, res) => {
    try {
        const querySnapshot = await db.collection('notificaciones').orderBy('fecha', 'desc').get();
        const notificaciones = querySnapshot.docs.map(doc => ({
            id: doc.id,
            docente: doc.data().docente,
            mensaje: doc.data().mensaje,
            fecha: doc.data().fecha,
            nueva: doc.data().nueva
        }));        
        res.json(notificaciones);
    } catch (err) {
        console.error("ERROR al obtener notificaciones:", err);
        res.status(500).send('Error al obtener notificaciones');
    }
});

// Crear nueva notificación
router.post('/nueva-notificacion', async (req, res) => {
    const { docente, mensaje } = req.body;

    if (!docente || !mensaje) {
        return res.status(400).json({ error: 'Faltan campos: docente y mensaje son obligatorios.' });
    }

    const nuevaNotificacion = {
        docente,
        mensaje,
        fecha: new Date().toISOString(),
        nueva: true
    };

    try {
        await db.collection('notificaciones').add(nuevaNotificacion);
        res.send('Notificación guardada correctamente');
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send('Error al guardar la notificación');
    }
});

router.patch('/notificaciones/:id/nueva', async (req, res) => {
    const id = req.params.id;

    try {
        const ref = db.collection('notificaciones').doc(id);
        const doc = await ref.get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Notificación no encontrada.' });
        }

        const data = doc.data();

        if (!data.nueva) {
            return res.status(200).json({ mensaje: 'La notificación ya estaba completada.' });
        }

        await ref.update({ nueva: false });

        const notiActualizada = await ref.get();
        res.json({ mensaje: 'Notificación marcada como completada.', notificacion: notiActualizada.data() });
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: 'Error interno al actualizar la notificación.' });
    }
});


// Obtener todas las tareas
router.get('/tareas', async (req, res) => {
    try {
        const snapshot = await db.collection('tareas').orderBy('fechaCreacion', 'desc').get();
        const tareas = snapshot.docs.map(doc => ({
            id: doc.id,
            materia: doc.data().materia,
            detalle: doc.data().detalle,
            fechaCreacion: doc.data().fechaCreacion
        }));
        res.json(tareas);
    } catch (err) {
        console.error("ERROR al obtener tareas:", err);
        res.status(500).send('Error al obtener tareas');
    }
});

// Crear nueva tarea
router.post('/tareas', async (req, res) => {
    const { materia, detalle } = req.body;

    if (!materia || !detalle) {
        return res.status(400).json({ error: 'Faltan campos: materia y detalle son obligatorios.' });
    }

    try {
        await db.collection('tareas').add({
            materia,
            detalle,
            fechaCreacion: new Date().toISOString()
        });
        res.send('Tarea guardada correctamente');
    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).send('Error al guardar la tarea');
    }
});

// Editar tarea
router.put('/tareas/:id', async (req, res) => {
    const { materia, detalle } = req.body;
    const id = req.params.id;

    try {
        const ref = db.collection('tareas').doc(id);
        await ref.update({ materia, detalle });
        res.send('Tarea actualizada correctamente');
    } catch (err) {
        console.error("ERROR:", err);
        res.status(404).send('Tarea no encontrada');
    }
});

// Eliminar tarea
router.delete('/tareas/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await db.collection('tareas').doc(id).delete();
        res.send('Tarea eliminada correctamente');
    } catch (err) {
        console.error("ERROR:", err);
        res.status(404).send('Tarea no encontrada');
    }
});

module.exports = router;

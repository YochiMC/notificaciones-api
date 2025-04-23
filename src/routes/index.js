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

router.get('/notificaciones', async (req, res) => {

    const querySnapshot = await db.collection('notificaciones').get();

    const notificaciones = querySnapshot.docs.map(doc => ({
        docente: doc.data().docente,
        mensaje: doc.data().mensaje,
        fecha: doc.data().fecha,
    }));

    console.log(notificaciones);

    res.send('Hola estrellitas, la tierra les dice hola');


});

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
        const ref = await db.collection('notificaciones').add(nuevaNotificacion);
        res.send('Notificación guardada correctamente');
    } catch (err) {
        console.error("ERROR:", err);
        res.send('Error al guardar la notificación' + err);
    }

});

router.patch('/notificaciones/:id/nueva', async (req, res) => {
    const id = req.params.id;

    try {
        const ref = db.collection('notificaciones').doc(id);
        await ref.update({ nueva: false });
        const notiActualizada = await ref.get();
        res.json({ mensaje: 'Notificación marcada como vieja.', notificacion: notiActualizada.data() });
    } catch (err) {
        console.error("ERROR:", err);
        res.status(404).json({ error: 'Notificación no encontrada.' });
    }
});

module.exports = router; // Exporta el router para usarlo en otros archivos
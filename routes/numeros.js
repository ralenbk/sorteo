const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todos los números
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM numeros');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los números' });
    }
});

// Actualizar estado de un número
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { estado, usuario } = req.body;

    try {
        await db.query('UPDATE numeros SET estado = ?, usuario = ? WHERE id = ?', [estado, usuario, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el número' });
    }
});

module.exports = router;

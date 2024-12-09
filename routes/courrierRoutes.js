// routes/courrierRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtenir tous les courriers
router.get('/', (req, res) => {
    db.query("SELECT * FROM courriers", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Créer un nouveau courrier
router.post('/', (req, res) => {
    const { title, content, sender, receiver, date_sent, user_id } = req.body;
    const query = "INSERT INTO courriers (title, content, sender, receiver, date_sent, user_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [title, content, sender, receiver, date_sent, user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Courrier créé', id: results.insertId });
    });
});

// Mettre à jour un courrier
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, status } = req.body;
    const query = "UPDATE courriers SET title = ?, content = ?, status = ? WHERE id = ?";
    db.query(query, [title, content, status, id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Courrier mis à jour' });
    });
});

// Supprimer un courrier
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM courriers WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Courrier supprimé' });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// CREATE - Ajouter un nouveau courrier sortant
router.post('/', (req, res) => {
    const { numero_courrier, date_sortie, observation, nom_prenom, nom_responsable } = req.body;
    const query = 'INSERT INTO courrier_sortant (numero_courrier, date_sortie, observation, nom_prenom, nom_responsable) VALUES (?, ?, ?, ?, ?)';
    
    db.query(query, [numero_courrier, date_sortie, observation, nom_prenom, nom_responsable], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, message: 'Courrier sortant créé avec succès' });
    });
});

// READ - Obtenir tous les courriers sortants
router.get('/', (req, res) => {
    const query = 'SELECT * FROM courrier_sortant';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// READ - Obtenir un courrier sortant par ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM courrier_sortant WHERE id_sortant = ?';
    
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Courrier sortant non trouvé' });
        }
        res.json(results[0]);
    });
});

// UPDATE - Mettre à jour un courrier sortant
router.put('/:id', (req, res) => {
    const { numero_courrier, date_sortie, observation, nom_prenom, nom_responsable } = req.body;
    const query = 'UPDATE courrier_sortant SET numero_courrier = ?, date_sortie = ?, observation = ?, nom_prenom = ?, nom_responsable = ? WHERE id_sortant = ?';
    
    db.query(query, [numero_courrier, date_sortie, observation, nom_prenom, nom_responsable, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Courrier sortant non trouvé' });
        }
        res.json({ message: 'Courrier sortant mis à jour avec succès' });
    });
});

// DELETE - Supprimer un courrier sortant
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM courrier_sortant WHERE id_sortant = ?';
    
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Courrier sortant non trouvé' });
        }
        res.json({ message: 'Courrier sortant supprimé avec succès' });
    });
});

module.exports = router;

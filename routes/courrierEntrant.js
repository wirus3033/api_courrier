const express = require('express');
const router = express.Router();
const db = require('../config/db');

// CREATE - Ajouter un nouveau courrier entrant
router.post('/', (req, res) => {
    const { numero_courrier, date_entree, direction, date_BE, numero_BE, refence_courrier } = req.body;
    const query = 'INSERT INTO courrier_entrant (numero_courrier, date_entree, direction, date_BE, numero_BE, refence_courrier) VALUES (?, ?, ?, ?, ?, ?)';
    
    db.query(query, [numero_courrier, date_entree, direction, date_BE, numero_BE, refence_courrier], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, message: 'Courrier entrant créé avec succès' });
    });
});

router.get('/count', async (req, res) => {
        try {
          const [rows] = await db.promise().query('SELECT COUNT(*) as count FROM courrier_entrant');
          res.json({ count: rows[0].count });
        } catch (error) {
          console.error('Error getting courrier count:', error);
          res.status(500).json({ message: 'Error fetching courrier count' });
        }
      });

// READ - Obtenir tous les courriers entrants
router.get('/', (req, res) => {
    const query = 'SELECT * FROM courrier_entrant';
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// READ - Obtenir un courrier entrant par ID
router.get('/:id', (req, res) => {
    const query = 'SELECT * FROM courrier_entrant WHERE id_entrant = ?';
    
    db.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Courrier entrant non trouvé' });
        }
        res.json(results[0]);
    });
});

// UPDATE - Mettre à jour un courrier entrant
router.put('/:id', (req, res) => {
    const { numero_courrier, date_entree, direction, date_BE, numero_BE, refence_courrier } = req.body;
    const query = 'UPDATE courrier_entrant SET numero_courrier = ?, date_entree = ?, direction = ?, date_BE = ?, numero_BE = ?, refence_courrier = ? WHERE id_entrant = ?';
    
    db.query(query, [numero_courrier, date_entree, direction, date_BE, numero_BE, refence_courrier, req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Courrier entrant non trouvé' });
        }
        res.json({ message: 'Courrier entrant mis à jour avec succès' });
    });
});

// DELETE - Supprimer un courrier entrant
router.delete('/:id', (req, res) => {
    const query = 'DELETE FROM courrier_entrant WHERE id_entrant = ?';
    
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Courrier entrant non trouvé' });
        }
        res.json({ message: 'Courrier entrant supprimé avec succès' });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route : Récupérer toutes les directions
router.get('/', (req, res) => {
  const query = 'SELECT * FROM direction';
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la récupération des directions.' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Route : Récupérer une direction par ID
router.get('/:id', (req, res) => {
  const query = 'SELECT * FROM direction WHERE id_direction = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la récupération de la direction.' });
    } else {
      if (result.length > 0) {
        res.status(200).json(result[0]);
      } else {
        res.status(404).json({ message: 'Direction introuvable.' });
      }
    }
  });
});

// Route : Ajouter une nouvelle direction
router.post('/', (req, res) => {
  const { nom_direction } = req.body;
  if (!nom_direction) {
    return res.status(400).json({ error: 'Le champ nom_direction est obligatoire.' });
  }

  const query = 'INSERT INTO direction (nom_direction) VALUES (?)';
  db.query(query, [nom_direction], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de l’ajout de la direction.' });
    } else {
      res.status(201).json({ message: 'Direction ajoutée avec succès.', id: result.insertId });
    }
  });
});

// Route : Mettre à jour une direction
router.put('/:id', (req, res) => {
  const { nom_direction } = req.body;
  if (!nom_direction) {
    return res.status(400).json({ error: 'Le champ nom_direction est obligatoire.' });
  }

  const query = 'UPDATE direction SET nom_direction = ? WHERE id_direction = ?';
  db.query(query, [nom_direction, req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la direction.' });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Direction mise à jour avec succès.' });
      } else {
        res.status(404).json({ message: 'Direction introuvable.' });
      }
    }
  });
});

// Route : Supprimer une direction
router.delete('/:id', (req, res) => {
  const query = 'DELETE FROM direction WHERE id_direction = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Erreur lors de la suppression de la direction.' });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Direction supprimée avec succès.' });
      } else {
        res.status(404).json({ message: 'Direction introuvable.' });
      }
    }
  });
});

module.exports = router;

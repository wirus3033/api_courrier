// routes/courrierRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Route pour récupérer tous les courriers
router.get('/courriers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM courrier');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des courriers.' });
  }
});

// Route pour ajouter un nouveau courrier
router.post('/courriers', async (req, res) => {
  const { date_arrivee, date_pre_reference, pre_reference, origin, reference, objet, classement, status, utilisateur, modifier_par } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO courrier (date_arrivee, date_pre_reference, pre_reference, origin, reference, objet, classement, status, utilisateur, modifier_par) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [date_arrivee, date_pre_reference, pre_reference, origin, reference, objet, classement, status, utilisateur, modifier_par]
    );
    res.json({ id: result.insertId, message: 'Courrier ajouté avec succès.' });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: 'Erreur lors de l'ajout du courrier.' }); 
  }
});


// Route pour récupérer les courriers entrants
router.get('/courriers/entrants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM entrant INNER JOIN courrier ON entrant.id_courrier = courrier.id_courrier');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des courriers entrants.' });
  }
});

// Route pour ajouter un courrier entrant
router.post('/courriers/entrants', async (req, res) => {
  const { id_courrier, date_courrier } = req.body;
  try {
    const [result] = await db.query('INSERT INTO entrant (id_courrier, date_courrier) VALUES (?, ?)', [id_courrier, date_courrier]);
    res.json({ id: result.insertId, message: 'Courrier entrant ajouté avec succès.' });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: 'Erreur lors de l'ajout du courrier entrant.' });
  }
});

// Route pour récupérer les courriers sortants
router.get('/courriers/sortants', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM sortant INNER JOIN courrier ON sortant.id_courrier = courrier.id_courrier');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la récupération des courriers sortants.' });
  }
});

// Route pour ajouter un courrier sortant
router.post('/courriers/sortants', async (req, res) => {
  const { id_courrier, destinataire } = req.body;
  try {
    const [result] = await db.query('INSERT INTO sortant (id_courrier, destinataire) VALUES (?, ?)', [id_courrier, destinataire]);
    res.json({ id: result.insertId, message: 'Courrier sortant ajouté avec succès.' });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: 'Erreur lors de l'ajout du courrier sortant.' });
  }
});

module.exports = router;

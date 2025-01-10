// routes/courrierRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Route pour récupérer tous les courriers
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM courriers");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des courriers." });
  }
});

// Route pour récupérer les courriers entrants
router.get("/entrants", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id_courrier, num_courrier, date_entrant, direction_courrier, date_BE, num_BE, reference_courrier " +
        "FROM courriers WHERE type_courrier = 'Entrant'"
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des courriers entrants." });
  }
});

// Route pour récupérer les courriers sortants
router.get("/sortants", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT id_courrier, date_sortie, observation, nom_prenom, nom_responsable " +
        "FROM courriers WHERE type_courrier = 'Sortant'"
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la récupération des courriers sortants." });
  }
});

// Route pour ajouter un courrier
router.post("/", async (req, res) => {
  const {
    type_courrier,
    num_courrier,
    date_entrant,
    direction_courrier,
    date_BE,
    num_BE,
    reference_courrier,
    date_sortie,
    observation,
    nom_prenom,
    nom_responsable,
  } = req.body;

  try {
    const [result] = await db.promise().query(
      "INSERT INTO courriers (type_courrier, num_courrier, date_entrant, direction_courrier, date_BE, num_BE, reference_courrier, date_sortie, observation, nom_prenom, nom_responsable) " +
      "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        type_courrier,
        num_courrier,
        date_entrant,
        direction_courrier,
        date_BE,
        num_BE,
        reference_courrier,
        date_sortie,
        observation,
        nom_prenom,
        nom_responsable,
      ]
    );
    res.json({ id: result.insertId, message: "Courrier ajouté avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de l'ajout du courrier." });
  }
});

// Route pour mettre à jour un courrier
router.put("/:id", async (req, res) => {
  const {
    type_courrier,
    num_courrier,
    date_entrant,
    direction_courrier,
    date_BE,
    num_BE,
    reference_courrier,
    date_sortie,
    observation,
    nom_prenom,
    nom_responsable,
  } = req.body;
  const { id } = req.params;

  try {
    const [result] = await db.promise().query(
      "UPDATE courriers SET type_courrier = ?, num_courrier = ?, date_entrant = ?, direction_courrier = ?, date_BE = ?, num_BE = ?, reference_courrier = ?, date_sortie = ?, observation = ?, nom_prenom = ?, nom_responsable = ? " +
      "WHERE id_courrier = ?",
      [
        type_courrier,
        num_courrier,
        date_entrant,
        direction_courrier,
        date_BE,
        num_BE,
        reference_courrier,
        date_sortie,
        observation,
        nom_prenom,
        nom_responsable,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Courrier non trouvé." });
    }
    res.json({ message: "Courrier mis à jour avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la mise à jour du courrier." });
  }
});

// Route pour supprimer un courrier
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.promise().query(
      "DELETE FROM courriers WHERE id_courrier = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Courrier non trouvé." });
    }
    res.json({ message: "Courrier supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression du courrier." });
  }
});

module.exports = router;

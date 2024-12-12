// routes/courrierRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Route pour récupérer tous les courriers
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM courrier");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des courriers." });
  }
});

// Route pour ajouter un nouveau courrier
router.post("/", async (req, res) => {
  const {
    date_arrivee,
    date_pre_reference,
    pre_reference,
    origine,
    reference,
    objet,
    classement,
    status,
    utilisateur,
    modifier_par,
  } = req.body;
  try {
    const [result] = await db
      .promise()
      .query(
        "INSERT INTO courrier (date_arrivee, date_pre_reference, pre_reference, origine, reference, objet, classement, status, utilisateur, modifier_par) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          date_arrivee,
          date_pre_reference,
          pre_reference,
          origine,
          reference,
          objet,
          classement,
          status,
          utilisateur,
          modifier_par,
        ]
      );
    res.json({ id: result.insertId, message: "Courrier ajouté avec succès." });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: 'Erreur lors de l'ajout du courrier.' });
  }
});

// Route pour mettre à jour un courrier existant
router.put("/:id", async (req, res) => {
  const {
    date_arrivee,
    date_pre_reference,
    pre_reference,
    origine,
    reference,
    objet,
    classement,
    status,
    utilisateur,
    modifier_par,
  } = req.body;
  const { id } = req.params;

  try {
    const [result] = await db
      .promise()
      .query(
        "UPDATE courrier SET date_arrivee = ?, date_pre_reference = ?, pre_reference = ?, origine = ?, reference = ?, objet = ?, classement = ?, status = ?, utilisateur = ?, modifier_par = ? WHERE id_courrier = ?",
        [
          new Date(date_arrivee),
          new Date(date_pre_reference),
          pre_reference,
          origine,
          reference,
          objet,
          classement,
          status,
          utilisateur,
          modifier_par,
          id,
        ]
      );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Courrier non trouvé." });
    } else {
      res.json({ message: "Courrier mis à jour avec succès." });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour du courrier." });
  }
});

// Route pour récupérer les courriers entrants
router.get("/entrants", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM entrant INNER JOIN courrier ON entrant.id_courrier = courrier.id_courrier"
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur lors de la récupération des courriers entrants.",
    });
  }
});

// Route pour supprimer un courrier par son ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Attempt to delete the courrier from the 'entrant' table (no error if not found)
    // await db.promise().query("DELETE FROM entrant WHERE id_courrier = ?", [id]);

    // Attempt to delete the courrier from the 'sortant' table (no error if not found)
    // await db.promise().query("DELETE FROM sortant WHERE id_courrier = ?", [id]);

    // Then delete the courrier from the 'courrier' table
    const [result] = await db
      .promise()
      .query("DELETE FROM courrier WHERE id_courrier = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Courrier non trouvé." });
    }

    res.json({ message: "Courrier supprimé avec succès." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du courrier." });
  }
});

// Route pour ajouter un courrier entrant
router.post("/entrants", async (req, res) => {
  const { id_courrier, date_courrier } = req.body;
  try {
    const [result] = await db
      .promise()
      .query("INSERT INTO entrant (id_courrier, date_courrier) VALUES (?, ?)", [
        id_courrier,
        date_courrier,
      ]);
    res.json({
      id: result.insertId,
      message: "Courrier entrant ajouté avec succès.",
    });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: 'Erreur lors de l'ajout du courrier entrant.' });
  }
});

// Route pour récupérer les courriers sortants
router.get("/sortants", async (req, res) => {
  try {
    const [rows] = await db
      .promise()
      .query(
        "SELECT * FROM sortant INNER JOIN courrier ON sortant.id_courrier = courrier.id_courrier"
      );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Erreur lors de la récupération des courriers sortants.",
    });
  }
});

// Route pour ajouter un courrier sortant
router.post("/sortants", async (req, res) => {
  const { id_courrier, destinataire } = req.body;
  try {
    const [result] = await db
      .promise()
      .query("INSERT INTO sortant (id_courrier, destinataire) VALUES (?, ?)", [
        id_courrier,
        destinataire,
      ]);
    res.json({
      id: result.insertId,
      message: "Courrier sortant ajouté avec succès.",
    });
  } catch (err) {
    console.error(err);
    // res.status(500).json({ error: 'Erreur lors de l'ajout du courrier sortant.' });
  }
});

module.exports = router;

// routes/authRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");
const dotenv = require("dotenv");

dotenv.config();
const router = express.Router();

// Middleware pour protéger les routes
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "Accès refusé, token manquant." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalide." });
    req.user = user;
    next();
  });
};

router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM utilisateur");
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

// Route pour la connexion
router.post("/login", async (req, res) => {
  const { pseudo, passe } = req.body;

  try {
    // Rechercher l'utilisateur par pseudo
    const query = "SELECT * FROM utilisateur WHERE pseudo_util = ?";
    const [rows] = await db.promise().query(query, [pseudo]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Utilisateur non trouvé." });
    }

    const user = rows[0];

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(passe, user.mot_de_passe_util);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id_utilisateur, role: user.acces_util },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.acces_util });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

// Route pour créer un utilisateur (seulement par un administrateur)
router.post("/register", authenticateToken, async (req, res) => {
  const { pseudo, passe, nom, prenom, matricule, direction, fonction, acces } =
    req.body;

  // Vérifier si l'utilisateur actuel est un administrateur
  if (req.user.role !== 1) {
    return res.status(403).json({
      message: "Seuls les administrateurs peuvent créer des comptes.",
    });
  }

  try {
    // Vérifier si le pseudo existe déjà
    const checkQuery = "SELECT * FROM utilisateur WHERE pseudo_util = ?";
    const [existingUser] = await db.promise().query(checkQuery, [pseudo]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Ce pseudo est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(passe, 10);

    // Insérer le nouvel utilisateur
    const query = `
            INSERT INTO utilisateur 
            (pseudo_util, mot_de_passe_util, nom_util, prenom_util, matricule_util, direction_util, fonction_util, acces_util) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
    await db
      .promise()
      .query(query, [
        pseudo,
        hashedPassword,
        nom,
        prenom,
        matricule,
        direction,
        fonction,
        acces,
      ]);

    res.status(201).json({ message: "Utilisateur créé avec succès." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db
      .promise()
      .query("SELECT * FROM utilisateur WHERE id_utilisateur = ?", [userId]);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
});

router.put("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { nom_util, prenom_util } = req.body;

    // Update the user details
    await db
      .promise()
      .query(
        "UPDATE utilisateur SET nom_util = ?, prenom_util = ? WHERE id_utilisateur = ?",
        [nom_util, prenom_util, userId]
      );

    // Fetch the updated user details
    const [rows] = await db
      .promise()
      .query("SELECT * FROM utilisateur WHERE id_utilisateur = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
  }
});

// Route pour changer le mot de passe
router.put("/me/password", authenticateToken, async (req, res) => {
  const userId = req.user.id; // Extract user ID from JWT token
  const { newPassword } = req.body;

  try {
    // Validate the new password (example: minimum 8 characters)
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          message:
            "Le nouveau mot de passe doit comporter au moins 8 caractères.",
        });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database directly
    const updateQuery =
      "UPDATE utilisateur SET mot_de_passe_util = ? WHERE id_utilisateur = ?";
    await db.promise().query(updateQuery, [hashedNewPassword, userId]);

    res.status(200).json({ message: "Mot de passe changé avec succès." });
  } catch (err) {
    console.error("Erreur lors du changement de mot de passe :", err);
    res.status(500).json({ message: "Erreur du serveur." });
  }
});

// Route pour récupérer les directions
router.get("/directions", async (req, res) => {
  try {
    const query = "SELECT * FROM direction";
    const [rows] = await db.promise().query(query);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des directions." });
  }
});

module.exports = router;

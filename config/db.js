// config/db.js
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Configuration de la connexion MySQL avec support des promesses
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Export de la connexion avec support des promesses
module.exports = db;

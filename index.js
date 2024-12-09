// index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Importation du middleware CORS
const db = require('./config/db');

dotenv.config();
const app = express();

// Configuration de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Autoriser les requêtes venant de votre frontend React
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'] // En-têtes autorisés
}));

app.use(express.json());

// Importation des routes
const courrierRoutes = require('./routes/courrierRoutes');
// const userRoutes = require('./routes/userRoutes');
const directionRoutes = require('./routes/directionRoures'); 
const authRoutes = require('./routes/userRoutes');


app.use('/api', authRoutes);
// Utilisation des routes
app.use('/api/courriers', courrierRoutes);
// app.use('/api/', userRoutes);
app.use('/api/directions', directionRoutes);

// Lancement du serveur
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

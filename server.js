const express = require('express');
const app = express();
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User'); // Importer le modèle User

const PORT = process.env.PORT || 3000;



// Middleware:
app.use(express.json());

// Routes::

// GET: Renvoie tous les utilisateurs.
app.get('/users', (req, res) => {

  // Utilise la méthode find() de Mongoose pour récupérer tous les utilisateurs 
  User.find()
    .then((users) => {
      res.json(users); 
      // Renvoie les utilisateurs dans la réponse sous forme de JSON
    })
    .catch((error) => {
      console.error('erreur récupération des utilisateurs', error);
      res.status(500).json({ error: 'erreur récupération des utilisateurs' });
    });
});

// POST: ujout un nouvel utilisateur 
app.post('/users', (req, res) => {
  const { firstName, lastName, email, age } = req.body;

  //méthode create() de Mongoose pour créer un nouvel utilisateur
  User.create({ firstName, lastName, email, age })
    .then((user) => {
      res.status(201).json(user); // nouvel utilisateur créé dans la réponse sous forme de JSON
    })
    .catch((error) => {
      console.error('Erreur lors de la création de l\'utilisateur', error);
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    });
});

// PUT: modifie un utilisateur par ID
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, age } = req.body;

  // utilise la méthode findByIdAndUpdate() de mongoose pour trouver et mettre à jour l'utilisateur avec l'ID spécifié
  User.findByIdAndUpdate(id, { firstName, lastName, email, age }, { new: true })
    .then((user) => {
      if (user) {
        res.json(user); // Renvoie l'utilisateur mis à jour dans la réponse sous forme de JSON
      } else {
        res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
    })
    .catch((error) => {
      console.error('erreur lors de la mise à jour de l\'utilisateur', error);
      res.status(500).json({ error: 'eerrreur lors de la mise à jour de l\'utilisateur' });
    });
});

// DELETE: supprime  utilisateur par ID
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  // Utilise la méthode findByIdAndRemove() de Mongoose pour trouver et supprimer l'utilisateur avec l'ID spécifié
  User.findByIdAndRemove(id)
    .then((user) => {
      if (user) {
        res.json({ message: 'utilisateur supprimé avec succès' });
      } else {
        res.status(404).json({ error: 'utilisateur non trouvé' });
      }
    })
    .catch((error) => {
      console.error('erreur lors de la suppression de l\'utilisateur', error);
      res.status(500).json({ error: 'erreur lors de la suppression de l\'utilisateur' });
    });
});

// Connecte à la base de données
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connecté à la base de données');
    // Démarre le serveur
    app.listen(PORT, () => {
      console.log(`serveur fonctionne sur le port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('error de connexion à la base de données', error);
  });

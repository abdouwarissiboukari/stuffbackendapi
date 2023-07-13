require("express-async-errors");
require("dotenv").config();

const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const sequelize = require('./databases/sequelize')


const app = express();

app
.use(bodyParser.json())
.use(cors())

sequelize.initDb();

app.get('/', (req, res) => {
    res.json('API accessible 👋🏿')
  })

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'images')));

const roleRoutes = require('./routes/roleRoute');
app.use('/api/role', roleRoutes);

const utilisateurRoutes = require('./routes/utilisateurRoute');
app.use('/api/utilisateur', utilisateurRoutes);

const productRoutes = require('./routes/produitRoute');
app.use('/api/produit', productRoutes);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).json({ error: error.message });
  });

app.use(({res}) => {
    const message = 'Impossible de trouver la ressource demandée! vous pouvez essayez une autre URL.'
    res.status(404).json({message})
  })

module.exports = app;
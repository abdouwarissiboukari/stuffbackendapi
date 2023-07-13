const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const produitCtrl = require('../controllers/produitCtrl');

router.post('/add', auth, multer, produitCtrl.createProduit);
router.put('/update/:code', auth, multer, produitCtrl.updateProduit);
router.delete('/delete/:code', auth, produitCtrl.deleteProduit);
router.get('/single/:code', auth, produitCtrl.getOneProduit);
router.get('/all/', auth, produitCtrl.getAllProduit);

module.exports = router;
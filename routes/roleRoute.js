const express = require('express');
const router = express.Router();

const ctlrRole = require('../controllers/roleCtrl');
const auth = require('../middleware/auth');

router.post('/Add/', auth, ctlrRole.createRole);
router.get('/OneByid/:id', auth, ctlrRole.getOneRole);
router.get('/OneByLibelle/:libelle', auth, ctlrRole.getOneRoleByLibelle);
router.put('/updateByid/:id', auth, ctlrRole.updateRole);
router.put('/updateByLibelle/:libelle', auth, ctlrRole.updateRoleByLibelle);
router.delete('/delete/:id', auth, ctlrRole.deleteRole);
router.get('/all/', auth, ctlrRole.getAllRoles);
// router.get('/Allbylibelle/:libelle', auth, ctlrRole.getAllRolesByLibelle);


module.exports = router;
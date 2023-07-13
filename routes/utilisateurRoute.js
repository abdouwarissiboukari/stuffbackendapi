const express = require('express');
const router = express.Router();

const utilisateurctrl = require('../controllers/utilisateurCtrl');
const auth = require('../middleware/auth');

router.post('/signup/', utilisateurctrl.signUp);
router.post('/signin/', utilisateurctrl.signIn);
router.post('/requestresetPasswordtoken/', utilisateurctrl.resetPasswordRequestControllerToken)
router.post('/requestresetPasswordcode/', utilisateurctrl.resetPasswordRequestControllerCode)
router.post('/resetpassword/', utilisateurctrl.resetPasswordController)
router.post('/emailvalidation/', utilisateurctrl.emailValidationController)
router.put('/update/:id', auth, utilisateurctrl.updateUtilisateur);
router.get('/byid/:id', auth, utilisateurctrl.getOneUtilisateur);
router.delete('/delete/:id', auth, utilisateurctrl.deleteOneUtilisateur);
router.put('/state/', auth, utilisateurctrl.updateUtilisateurState);
router.get('/all/', auth, utilisateurctrl.getAllUtilisateur);
router.get('/allbyrole/:_role', auth, utilisateurctrl.getAllUtilisateurByRole);
router.get('/', auth, utilisateurctrl.getCurrentUser);

module.exports = router;

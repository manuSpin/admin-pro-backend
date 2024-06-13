// Ruta:/api/login
const { Router } = require('express');
const { login, loginWithGoogle } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');


const router = Router();

router.post('/', [
    check('email', 'Campo obligatorio.').isEmail(),
    check('password', 'Campo obligatorio.').not().isEmpty(),
    validarCampos

], login)

router.post('/google', [
    check('token', 'El token de Google es obligatorio.').not().isEmpty(),
    validarCampos

], loginWithGoogle)

module.exports = router;
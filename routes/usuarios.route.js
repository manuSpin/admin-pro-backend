// Ruta: /api/usuarios
const { Router } = require('express');
const { check } = require('express-validator');
const { getUsuarios, crearUsuario, editUsuario, deleteUser } = require('../controllers/usuarios.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT, validateUserRole, validateAdminOrLoginUser } = require('../middlewares/validat-jwt');

const router = Router();

router.get('/', validateJWT,  getUsuarios);

router.post('/create', [
    check('nombre', 'No puede crear un usuario sin un nombre.').not().isEmpty(),
    check('password', 'La contraseña es necesaria para crear un usuario.').not().isEmpty(),
    check('email', 'Necesita poner un email para crear un usuario.').isEmail(),
    validarCampos
], crearUsuario);

router.put('/edit/:id', [
    validateJWT,
    validateAdminOrLoginUser,
    check('nombre', 'El nombre es obligatorio.').not().isEmpty(),
    check('email', 'El email es obligatorio.').isEmail(),
    check('role', 'El rol es obligatorio.').not().isEmpty(),
    validarCampos
],editUsuario);

router.delete('/delete/:id', [
    validateJWT,
    validateUserRole
], deleteUser);

module.exports = router;


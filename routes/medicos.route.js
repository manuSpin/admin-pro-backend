// Ruta: /api/medicos
const { Router } = require('express');
const { check } = require('express-validator');
const { getMedicos, createMedico, editMedico, deletetMedico } = require('../controllers/medicos.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validat-jwt');

const router = Router();

router.get('/', validateJWT, getMedicos);

router.post('/create', [
    validateJWT,
    check('nombre', 'El nombre del médico es obligatorio.').not().isEmpty(),
    check('hospital', 'El hospital id no es válido.').isMongoId(),
    check('hospital', 'El hospital es obligatorio.').not().isEmpty(),
    validarCampos
], createMedico);

router.put('/edit/:id', [
    validateJWT,
    check('nombre', 'El nombre del hospital es obligatorio.').not().isEmpty(),
    check('hospital', 'El hospital es obligatorio.').not().isEmpty(),
    validarCampos
], editMedico);

router.delete('/delete/:id', validateJWT, deletetMedico);

module.exports = router;
// Ruta: /api/hospitales
const { Router } = require('express');
const { check } = require('express-validator');
const { getHospitales, createHospital, editHospital, deletetHospital } = require('../controllers/hospitales.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validateJWT } = require('../middlewares/validat-jwt');

const router = Router();

router.get('/', validateJWT, getHospitales);

router.post('/create', [
    validateJWT,
    check('nombre', 'El nombre del hospital es obligatorio.').not().isEmpty(),
    validarCampos
], createHospital);

router.put('/edit/:id', [
    validateJWT,
    check('nombre', 'El nombre del hospital es obligatorio.').not().isEmpty(),
    validarCampos
], editHospital);

router.delete('/delete/:id', validateJWT, deletetHospital);

module.exports = router;
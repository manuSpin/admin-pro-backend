// Ruta: /api/todo:busqueda
const { Router } = require('express');
const { getAll, getAllByCollection } = require('../controllers/busquedas.controller');
const { validateJWT } = require('../middlewares/validat-jwt');

const router = Router();

router.get('/:busqueda', validateJWT, getAll);

router.get('/collection/:model/:busqueda', validateJWT, getAllByCollection);

module.exports = router;
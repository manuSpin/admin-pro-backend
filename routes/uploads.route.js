// Ruta: /api/uploads/
const { Router } = require('express');
const { fileUpload, showImage } = require('../controllers/uploads.controller');
const expressFileUpload = require('express-fileupload');
const { validateJWT } = require('../middlewares/validat-jwt');

const router = Router();

router.use(expressFileUpload());

router.put('/:model/:id', validateJWT, fileUpload);
router.get('/:model/:img', showImage);


module.exports = router;
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const validateJWT = (request, response, next) => {
    const token = request.header('x-token');

    if (!token) {
        return response.status(401).json({
            ok: false,
            msg: 'Error: La petición no tiene token'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        request.uid = uid;
        next();

    } catch (error) {
        return response.status(401).json({
            ok: false,
            msg: 'Error: Token inválido'
        });
    }
}

const validateUserRole = async (request, response, next) => {
    const uid = request.uid;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return response.status(404).json({
                ok: false,
                msg: 'Error: No se ha encontrado el usuario'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return response.status(403).json({
                ok: false,
                msg: 'Error: No tiene permisos para realizar esta acción'
            });
        }

        next();

    } catch (error) {
        return response.status(500).json({
            ok: false,
            msg: 'Error: ' + error
        });

    }

}

const validateAdminOrLoginUser = async (request, response, next) => {
    const uid = request.uid;
    const id = request.params.id

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return response.status(404).json({
                ok: false,
                msg: 'Error: No se ha encontrado el usuario'
            });
        }

        if (usuarioDB.role !== 'ADMIN_ROLE' && uid !== id) {
            return response.status(403).json({
                ok: false,
                msg: 'Error: No tiene permisos para realizar esta acción'
            });
        }

        next();

    } catch (error) {
        return response.status(500).json({
            ok: false,
            msg: 'Error: ' + error
        });

    }

}

module.exports = { validateJWT, validateUserRole, validateAdminOrLoginUser }
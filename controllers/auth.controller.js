const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generateTokenJWT } = require('../helpers/jwt');


const login = async (request, res = response) => {
    const { email, password } = request.body;

    try {

        // Verificar email y contraseña
        const usuarioDB = await Usuario.findOne({ email });
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if (!usuarioDB || !validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrecta.'
            });
        }

        // Generar token
        const token = await generateTokenJWT(usuarioDB.id);

        res.json({
            ok: true,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

module.exports = { login }


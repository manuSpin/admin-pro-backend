const { response } = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generateTokenJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenu } = require('../helpers/menu');


const login = async (request, res = response) => {
    const { email, password } = request.body;

    try {

        // Verificar email y contraseña
        const usuarioDB = await Usuario.findOne({ email });
        let validPassword = false;
        if (usuarioDB) {
            validPassword = bcrypt.compareSync(password, usuarioDB?.password);
        }

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
            token: token,
            menu: getMenu(usuarioDB.role)
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const loginWithGoogle = async (request, res = response) => {
    try {
        const { email, name, picture } = await googleVerify(request.body.token);

        const usuarioDB = await Usuario.findOne({ email: email });
        let usuario;

        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            })
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        await usuario.save();

        const token = await generateTokenJWT(usuario.id);

        res.json({
            ok: true,
            email: email,
            name: name,
            picture: picture,
            token: token,
            menu: getMenu(usuario.role)
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });

    }
}

const renewToken = async (request, res = response) => {
    const token = await generateTokenJWT(request.uid);

    const usuario = await Usuario.findById(request.uid);

    res.json({
        ok: true,
        token: token,
        usuario: usuario,
        menu: getMenu(usuario.role)
    });
}

module.exports = { login, loginWithGoogle, renewToken }


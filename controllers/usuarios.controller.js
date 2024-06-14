const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { generateTokenJWT } = require('../helpers/jwt');


const getUsuarios = async (request, res = response) => {
    const from = Number(request.query.from) || 0;
    const size = Number(request.query.size) || 5;

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'id nombre apellidos email role google img').skip(from).limit(size),
        Usuario.countDocuments()
    ]);

    res.json({
        ok: true,
        usuarios: usuarios,
        total: total
    });
}

const crearUsuario = async (request, res = response) => {
    const { email, password } = request.body;

    try {
        const emailExist = await Usuario.findOne({ email: email });

        if (emailExist) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario registrado con este email.'
            });
        }

        const usuario = new Usuario(request.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        const createdUser = await usuario.save();

        // Generar token JWT
        const token = await generateTokenJWT(createdUser.id);

        res.json({
            ok: true,
            usuario: usuario,
            token: token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const editUsuario = async (request, res = response) => {

    const uid = request.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario.'
            });
        }

        //  Modificación de los datos
        const { password, google, email, ...userFields } = request.body;

        if (usuarioDB.email !== email) {
            const emailExist = await Usuario.findOne({ email: email });

            if (emailExist) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario registrado con este email.'
                });
            }
        }

        userFields.email = email;

        const updatedUser = await Usuario.findByIdAndUpdate(uid, userFields, { new: true });

        res.json({
            ok: true,
            usuario: updatedUser
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const deleteUser = async (request, res = response) => {
    const uid = request.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No se ha encontrado el usuario.'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'El usuario ha sido borrado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

module.exports = { getUsuarios, crearUsuario, editUsuario, deleteUser }
const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');
const fs = require('fs');


const deleteImage = (path) => {
    if (fs.existsSync(path)) {
        // borrar la imagen anterior
        fs.unlinkSync(path);
    }
}


const updateImage = async (model, id, filename) => {

    let oldPath = '';

    switch (model) {
        case 'usuarios':
            const usuario = await Usuario.findById(id);

            if (!usuario) {
                return false;
            }

            oldPath = './uploads/usuarios/' + usuario.img;

            deleteImage(oldPath);

            usuario.img = filename;
            await usuario.save();

            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);

            if (!hospital) {
                return false;
            }

            oldPath = './uploads/hospitales/' + hospital.img;

            deleteImage(oldPath);

            hospital.img = filename;
            await hospital.save();

            return true;

        case 'medicos':
            const medico = await Medico.findById(id);

            if (!medico) {
                return false;
            }

            oldPath = './uploads/medicos/' + medico.img;

            deleteImage(oldPath);

            medico.img = filename;
            await medico.save();

            return true;

        default:
            return false;

    }

}

module.exports = { updateImage }
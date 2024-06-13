const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-image');
const path = require('path');
const fs = require('fs');

const fileUpload = async (request, res = response) => {
    const model = request.params.model;
    const id = request.params.id;

    // Validar tipo
    const validTypes = ['usuarios', 'hospitales', 'medicos'];
    if (!validTypes.includes(model)) {
        res.status(400).json({
            ok: false,
            msg: 'No es un usuario, hospital o médico'
        });
    }

    // Validar existencia del archivo
    if (!request.files || Object.keys(request.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ninguna imágen que subir.'
        });
    }

    // Procesar la imagen
    const file = request.files.imagen;
    const splittedName = file.name.split('.')
    const extension = splittedName[splittedName.length - 1];

    // Validar extensiones
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if (!validExtensions.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: 'El formato de la imagen no es válido.'
        });
    }

    // Generar el nombre del archivo
    const filename = uuidv4() + '.' + extension;

    // Path para guardar la imagen
    const uploadPath = './uploads/' + model + '/' + filename;

    file.mv(uploadPath, function (error) {
        if (error) {
            return res.status(500).json({
                ok: false,
                msg: 'Error: ' + error
            });
        }


        // Actualizar BD
        updateImage(model, id, filename);


        res.json({
            ok: true,
            filename: filename,
            msg: 'El archivo se ha subido correctamente'
        });
    });
}

const showImage = async (request, res = response) => {
    const model = request.params.model;
    const image = request.params.img;

    const pathImg = path.join(__dirname, '../uploads/' + model + '/' + image);
    
    //Imágen por defecto
    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
        } else {
        const pathNoImg = path.join(__dirname, '../uploads/no-image.svg');
        res.sendFile(pathNoImg);
    }
}

module.exports = { fileUpload, showImage }
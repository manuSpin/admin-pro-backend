const { response } = require('express');
const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');

const getAll = async (request, res = response) => {
    const busqueda = request.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ nombre: regex }, 'id nombre apellido email role google'),
        Hospital.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
    ]);

    const resultados = { usuarios, hospitales, medicos };
    const total = usuarios.length + hospitales.length + medicos.length;

    res.json({
        ok: true,
        resultados: resultados,
        total: total
    });
}

const getAllByCollection = async (request, res = response) => {

    const model = request.params.model;
    const busqueda = request.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    let resultados = [];

    switch (model) {
        case 'usuarios':
            resultados = await Usuario.find({ nombre: regex }, 'id nombre apellido email role google');
            break;

        case 'hospitales':
            resultados = await Hospital.find({ nombre: regex }).populate('creator', 'nombre img');
            break;

        case 'medicos':
            resultados = await Medico.find({ nombre: regex }).populate('creator', 'nombre img').populate('hospital', 'nombre img');
            break;
        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla por la que esta buscando no existe o la ha escrito mal. Pruebe de nuevo con usuarios/medicos/hospitales'
            });
    }

    res.json({
        ok: true,
        resultados: resultados,
        total: resultados.length
    });
}

module.exports = { getAll, getAllByCollection }
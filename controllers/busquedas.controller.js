const { response } = require('express');
const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');

const getAll = async (request, res = response) => {
    const busqueda = request.params.busqueda;
    const regex = new RegExp(busqueda, 'i');

    const [usuarios, hospitales, medicos] = await Promise.all([
        Usuario.find({ nombre: regex }, 'id nombre apellido email role google img'),
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
    const from = Number(request.query.from) || 0;
    const size = Number(request.query.size) || 5;
    const regex = new RegExp(busqueda, 'i');

    let resultados = [];
    let total = 0;

    switch (model) {
        case 'usuarios':
            resultados = await Usuario.find({ nombre: regex }, 'id nombre apellido email role google').skip(from).limit(size);
            total = await Usuario.find({ nombre: regex }, 'id nombre apellido email role google');
            break;

        case 'hospitales':
            resultados = await Hospital.find({ nombre: regex }).populate('creator', 'nombre img').skip(from).limit(size);
            total = await Hospital.find({ nombre: regex }).populate('creator', 'nombre img');
            break;

        case 'medicos':
            resultados = await Medico.find({ nombre: regex }).populate('creator', 'nombre img').populate('hospital', 'nombre img').skip(from).limit(size);
            total = await await Medico.find({ nombre: regex }).populate('creator', 'nombre img').populate('hospital', 'nombre img');
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
        total: total.length
    });
}

module.exports = { getAll, getAllByCollection }
const { response } = require('express');
const Medico = require('../models/medico.model');

const getMedicos = async (request, res = response) => {
    const from = Number(request.query.from) || 0;
    const size = Number(request.query.size) || 5;

    const [medicos, total] = await Promise.all([
        Medico.find().populate('creator', 'nombre img').populate('hospital', 'nombre img').skip(from).limit(size),
        Medico.countDocuments()
    ]);

    res.json({
        ok: true,
        medicos: medicos,
        total: total
    });

}

const createMedico = async (request, res = response) => {
    const medico = new Medico({ creator: request.uid, ...request.body });

    try {
        const newMedico = await medico.save();

        res.json({
            ok: true,
            medico: newMedico
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const editMedico = async (request, res = response) => {
    const uid = request.params.id;
    
    try {
        const medicoDB = await Medico.findById(uid);

        if (!medicoDB) {
            res.status(404).json({
                ok: false,
                error: 'No se ha encontrado el médico'
            });
        }

        const cambios = { ...request.body, usuarios: request.uid };

        const updatedMedico = await Medico.findByIdAndUpdate(uid, cambios, { new: true });

        res.json({
            ok: true,
            medico: updatedMedico,
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const deletetMedico = async (request, res = response) => {
    const uid = request.params.id

    try {

        const medicoDB = Medico.findById(uid);

        if (!medicoDB) {
            res.status(404).json({
                ok: false,
                error: 'No se ha encontrado el médico'
            });
        }

        await Medico.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'El medico ha sido borrado.'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

module.exports = { getMedicos, createMedico, editMedico, deletetMedico }
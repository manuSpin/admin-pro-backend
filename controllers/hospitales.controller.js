const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitales = async (request, res = response) => {
    const hospitales = await Hospital.find().populate('creator', 'nombre img');

    res.json({
        ok: true,
        hospitales: hospitales,
        total: hospitales.length
    });
}

const createHospital = async (request, res = response) => {
    const hospital = new Hospital({ creator: request.uid, ...request.body });

    try {
        const newHospital = await hospital.save();

        res.json({
            ok: true,
            hospital: newHospital
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const editHospital = async (request, res = response) => {
    const uid = request.params.id;

    try {
        const hospitalDB = Hospital.findById(uid);

        if (!hospitalDB) {
            res.status(404).json({
                ok: false,
                error: 'No se ha encontrado el hospital'
            });
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(uid, request.body, { new: true });

        res.json({
            ok: true,
            hospital: updatedHospital
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

const deletetHospital = async (request, res = response) => {
    const uid = request.params.id;

    try {
        const hospitalDB = await Hospital.findById(uid);

        if (!hospitalDB) {
            res.status(404).json({
                ok: false,
                error: 'No se ha encontrado el hospital'
            });
        }

        await Hospital.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'El hospital ha sido borrado'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: 'Error: ' + error
        });
    }
}

module.exports = { getHospitales, createHospital, editHospital, deletetHospital }
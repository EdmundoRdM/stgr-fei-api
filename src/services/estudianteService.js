const Estudiante = require('../models/Estudiante');

const registrarEstudiante = async (datos) => {
    return await Estudiante.create(datos);
};

const obtenerEstudiantes = async () => {
    return await Estudiante.findAll();
};

module.exports = {
    registrarEstudiante,
    obtenerEstudiantes
};
const estudianteService = require('../services/estudianteService');

const crear = async (req, res) => {
    try {
        const nuevoEstudiante = await estudianteService.registrarEstudiante(req.body);
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el estudiante', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const estudiantes = await estudianteService.obtenerEstudiantes();
        res.status(200).json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar estudiantes', detalle: error.message });
    }
};

module.exports = { crear, listar };
const academicoService = require('../services/academicoService');

const crear = async (req, res) => {
    try {
        const nuevoAcademico = await academicoService.registrarAcademico(req.body);
        
        const respuestaAcademico = nuevoAcademico.toJSON();
        delete respuestaAcademico.Contrasenia;

        res.status(201).json(respuestaAcademico);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el académico', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const academicos = await academicoService.obtenerAcademicos();
        res.status(200).json(academicos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar', detalle: error.message });
    }
};

module.exports = { crear, listar };
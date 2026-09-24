const participanteService = require('../services/participanteService');


const asignarAcademico = async (req, res) => {
    try {
        const nuevaAsignacionAcademico = await participanteService.asignarAcademico(req.body);
        res.status(201).json({ mensaje: 'Académico asignado correctamente al trabajo recepcional', nuevaAsignacion: nuevaAsignacionAcademico });
    } catch (error) {
        res.status(400).json({ error: 'Error al asignar el académico', detalle: error.message });
    }
};

const listarAcademicosPorTrabajo = async (req, res) => {
    try {
        const { idTrabajo: idTrabajoRecepcional } = req.params;
        const listaAcademicos = await participanteService.obtenerAcademicosPorTrabajo(idTrabajoRecepcional);
        res.status(200).json(listaAcademicos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los académicos del trabajo recepcional', detalle: error.message });
    }
};

const eliminarAcademico = async (req, res) => {
    try {
        const { id: idParticipacionAcademico } = req.params;
        const resultadoEliminacion = await participanteService.removerAcademico(idParticipacionAcademico);
        res.status(200).json(resultadoEliminacion);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo remover al académico', detalle: error.message });
    }
};



const asignarEstudiante = async (req, res) => {
    try {
        const nuevaAsignacionEstudiante = await participanteService.asignarEstudiante(req.body);
        res.status(201).json({ mensaje: 'Estudiante asignado correctamente al trabajo recepcional', nuevaAsignacion: nuevaAsignacionEstudiante });
    } catch (error) {
        res.status(400).json({ error: 'Error al asignar el estudiante', detalle: error.message });
    }
};

const listarEstudiantesPorTrabajo = async (req, res) => {
    try {
        const { idTrabajo: idTrabajoRecepcional } = req.params;
        const listaEstudiantes = await participanteService.obtenerEstudiantesPorTrabajo(idTrabajoRecepcional);
        res.status(200).json(listaEstudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los estudiantes del trabajo recepcional', detalle: error.message });
    }
};

const eliminarEstudiante = async (req, res) => {
    try {
        const { id: idAsignacionEstudiante } = req.params;
        const resultadoEliminacion = await participanteService.removerEstudiante(idAsignacionEstudiante);
        res.status(200).json(resultadoEliminacion);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo remover al estudiante', detalle: error.message });
    }
};


const listarTodosPorTrabajo = async (req, res) => {
    try {
        const { idTrabajo: idTrabajoRecepcional } = req.params;
        const resumenParticipantes = await participanteService.obtenerTodosLosParticipantes(idTrabajoRecepcional);
        res.status(200).json(resumenParticipantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los participantes del trabajo recepcional', detalle: error.message });
    }
};

module.exports = {
    asignarAcademico,
    listarAcademicosPorTrabajo,
    eliminarAcademico,
    asignarEstudiante,
    listarEstudiantesPorTrabajo,
    eliminarEstudiante,
    listarTodosPorTrabajo,
    // Aliases para compatibilidad previa
    asignar: asignarAcademico,
    listarPorTrabajo: listarAcademicosPorTrabajo,
    eliminar: eliminarAcademico
};
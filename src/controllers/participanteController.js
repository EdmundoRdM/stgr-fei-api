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
        const numeroPersonal = req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
        const nuevaAsignacionEstudiante = await participanteService.asignarEstudiante({
            ...req.body,
            Numero_Personal: numeroPersonal
        });
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

const asignarExterno = async (req, res) => {
    try {
        const numeroPersonal = req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
        const nuevaAsignacion = await participanteService.asignarParticipanteExterno({
            ...req.body,
            Numero_Personal: numeroPersonal
        });
        res.status(201).json({ mensaje: 'Participante externo asignado correctamente al trabajo recepcional', nuevaAsignacion });
    } catch (error) {
        res.status(400).json({ error: 'Error al asignar participante externo', detalle: error.message });
    }
};

const listarExternosPorTrabajo = async (req, res) => {
    try {
        const { idTrabajo } = req.params;
        const lista = await participanteService.obtenerParticipantesExternosPorTrabajo(idTrabajo);
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar participantes externos', detalle: error.message });
    }
};

const eliminarExterno = async (req, res) => {
    try {
        const { id } = req.params;
        const numeroPersonal = req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
        const resultado = await participanteService.removerParticipanteExterno(id, numeroPersonal);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Error al desvincular participante externo', detalle: error.message });
    }
};

module.exports = {
    asignarAcademico,
    listarAcademicosPorTrabajo,
    eliminarAcademico,
    asignarEstudiante,
    listarEstudiantesPorTrabajo,
    eliminarEstudiante,
    asignarExterno,
    listarExternosPorTrabajo,
    eliminarExterno,
    listarTodosPorTrabajo,
    asignar: asignarAcademico,
    listarPorTrabajo: listarAcademicosPorTrabajo,
    eliminar: eliminarAcademico
};
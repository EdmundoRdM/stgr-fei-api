const participanteExternoService = require('../services/participanteExternoService');

const extraerNumeroPersonal = (req) => {
    return req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
};

const crear = async (req, res) => {
    try {
        const nuevoParticipante = await participanteExternoService.crearParticipanteExterno(req.body);
        res.status(201).json(nuevoParticipante);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar participante externo', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const filtros = {
            Institucion: req.query.Institucion,
            busqueda: req.query.busqueda
        };
        const lista = await participanteExternoService.obtenerParticipantesExternos(filtros);
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar participantes externos', detalle: error.message });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const participante = await participanteExternoService.obtenerParticipanteExternoPorId(id);
        res.status(200).json(participante);
    } catch (error) {
        res.status(404).json({ error: 'Participante externo no encontrado', detalle: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const actualizado = await participanteExternoService.actualizarParticipanteExterno(id, req.body);
        res.status(200).json({ mensaje: 'Participante externo actualizado exitosamente', participante: actualizado });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar participante externo', detalle: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await participanteExternoService.eliminarParticipanteExterno(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo eliminar el participante externo', detalle: error.message });
    }
};

const asignarATrabajo = async (req, res) => {
    try {
        const numeroPersonal = extraerNumeroPersonal(req);
        const asignacion = await participanteExternoService.asignarParticipanteExternoATrabajo({
            ...req.body,
            Numero_Personal: numeroPersonal
        });
        res.status(201).json({ mensaje: 'Participante externo asignado exitosamente', asignacion });
    } catch (error) {
        res.status(400).json({ error: 'Error al asignar participante externo', detalle: error.message });
    }
};

const listarPorTrabajo = async (req, res) => {
    try {
        const { idTrabajo } = req.params;
        const lista = await participanteExternoService.obtenerParticipantesExternosPorTrabajo(idTrabajo);
        res.status(200).json(lista);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar participantes externos del trabajo', detalle: error.message });
    }
};

const removerDeTrabajo = async (req, res) => {
    try {
        const { id } = req.params;
        const numeroPersonal = extraerNumeroPersonal(req);
        const resultado = await participanteExternoService.removerParticipanteExternoDeTrabajo(id, numeroPersonal);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Error al desvincular participante externo', detalle: error.message });
    }
};

module.exports = {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar,
    asignarATrabajo,
    listarPorTrabajo,
    removerDeTrabajo
};

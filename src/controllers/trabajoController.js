const trabajoService = require('../services/trabajoService');

const extraerNumeroPersonal = (req) => {
    return req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
};

const crear = async (req, res) => {
    try {
        const nuevoTrabajoCreado = await trabajoService.crearTrabajoBorrador(req.body);
        res.status(201).json(nuevoTrabajoCreado);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el trabajo recepcional', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const filtrosBusqueda = {
            Id_Carrera: req.query.Id_Carrera,
            Id_Estado: req.query.Id_Estado,
            Modalidad: req.query.Modalidad
        };
        const listaTrabajos = await trabajoService.obtenerTrabajos(filtrosBusqueda);
        res.status(200).json(listaTrabajos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar los trabajos recepcionales', detalle: error.message });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const trabajoRecepcional = await trabajoService.obtenerTrabajoPorId(idTrabajoRecepcional);
        res.status(200).json(trabajoRecepcional);
    } catch (error) {
        res.status(404).json({ error: 'No se pudo encontrar el registro', detalle: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const numeroPersonal = extraerNumeroPersonal(req);
        const trabajoActualizado = await trabajoService.actualizarTrabajo(idTrabajoRecepcional, req.body, numeroPersonal);
        res.status(200).json({ mensaje: 'Trabajo recepcional actualizado con éxito', trabajo: trabajoActualizado });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar el trabajo recepcional', detalle: error.message });
    }
};

const enviarAValidacion = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const trabajoEnviado = await trabajoService.enviarAValidacion(idTrabajoRecepcional);
        res.status(200).json({ mensaje: 'Trabajo recepcional enviado a validación con éxito', trabajo: trabajoEnviado });
    } catch (error) {
        res.status(400).json({ error: 'Error al enviar a validación', detalle: error.message });
    }
};

const validar = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const numeroPersonal = extraerNumeroPersonal(req);
        const trabajoValidado = await trabajoService.validarTrabajo(idTrabajoRecepcional, numeroPersonal);
        res.status(200).json({ mensaje: 'Trabajo recepcional aprobado con éxito', trabajo: trabajoValidado });
    } catch (error) {
        res.status(400).json({ error: 'Error al validar el trabajo recepcional', detalle: error.message });
    }
};

const rechazar = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const { motivo: motivoRechazo } = req.body;
        const numeroPersonal = extraerNumeroPersonal(req);
        const resultadoRechazo = await trabajoService.rechazarTrabajo(idTrabajoRecepcional, motivoRechazo, numeroPersonal);
        res.status(200).json(resultadoRechazo);
    } catch (error) {
        res.status(400).json({ error: 'Error al rechazar el trabajo recepcional', detalle: error.message });
    }
};

// CU-06: Generar acta tras completar checklist de documentos
const generarActa = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const numeroPersonal = extraerNumeroPersonal(req);
        const trabajoGenerado = await trabajoService.generarActa(idTrabajoRecepcional, numeroPersonal);
        res.status(200).json({ mensaje: 'Acta generada exitosamente. Trabajo en estado Generado.', trabajo: trabajoGenerado });
    } catch (error) {
        res.status(400).json({ error: 'Error al generar el acta de trabajo recepcional', detalle: error.message });
    }
};

const finalizar = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const { Folio, Resultado } = req.body;
        const numeroPersonal = extraerNumeroPersonal(req);
        const trabajoFinalizado = await trabajoService.finalizarTrabajo(idTrabajoRecepcional, { Folio, Resultado, Numero_Personal: numeroPersonal });
        res.status(200).json({ mensaje: 'Trabajo recepcional finalizado con éxito', trabajo: trabajoFinalizado });
    } catch (error) {
        res.status(400).json({ error: 'Error al finalizar el trabajo recepcional', detalle: error.message });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const { nuevoEstado } = req.body;
        const trabajoActualizado = await trabajoService.actualizarEstadoTrabajo(idTrabajoRecepcional, nuevoEstado);
        res.status(200).json({ mensaje: 'Estado actualizado con éxito', trabajo: trabajoActualizado });
    } catch (error) {
        res.status(400).json({ error: 'No se pudo actualizar el estado', detalle: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const numeroPersonal = extraerNumeroPersonal(req);
        const resultadoEliminacion = await trabajoService.eliminarTrabajo(idTrabajoRecepcional, numeroPersonal);
        res.status(200).json(resultadoEliminacion);
    } catch (error) {
        res.status(400).json({ error: 'No se pudo eliminar el registro', detalle: error.message });
    }
};

module.exports = {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    enviarAValidacion,
    validar,
    rechazar,
    generarActa,
    finalizar,
    cambiarEstado,
    eliminar
};
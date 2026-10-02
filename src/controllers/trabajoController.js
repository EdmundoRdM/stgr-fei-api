const trabajoService = require('../services/trabajoService');
const folioService = require('../services/folioService');
const estadoTrabajoService = require('../services/estadoTrabajoService');
const defensaService = require('../services/defensaService');

const extraerNumeroPersonal = (req) => {
    return req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
};

const crear = async (req, res) => {
    try {
        const numeroPersonal = extraerNumeroPersonal(req);
        const nuevoTrabajoCreado = await trabajoService.crearTrabajoBorrador(req.body, numeroPersonal);
        res.status(201).json(nuevoTrabajoCreado);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar el trabajo recepcional', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const numeroPersonal = extraerNumeroPersonal(req);
        const filtrosBusqueda = {
            Id_Carrera: req.query.Id_Carrera,
            Id_Estado: req.query.Id_Estado,
            Modalidad: req.query.Modalidad
        };
        const listaTrabajos = await trabajoService.obtenerTrabajos(filtrosBusqueda, numeroPersonal);
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
        const { Tomo, Numero_Folio, Folio } = req.body || {}; const trabajoGenerado = await trabajoService.generarActa(idTrabajoRecepcional, { Tomo, Numero_Folio, Folio, Numero_Personal: numeroPersonal });
        res.status(200).json({ mensaje: 'Acta generada exitosamente. Trabajo en estado Generado.', trabajo: trabajoGenerado });
    } catch (error) {
        res.status(400).json({ error: 'Error al generar el acta de trabajo recepcional', detalle: error.message });
    }
};

const finalizar = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const { Tomo, Numero_Folio, Folio, Resultado } = req.body;
        const numeroPersonal = extraerNumeroPersonal(req);
        const trabajoFinalizado = await trabajoService.finalizarTrabajo(idTrabajoRecepcional, {
            Tomo,
            Numero_Folio,
            Folio,
            Resultado,
            Numero_Personal: numeroPersonal
        });
        res.status(200).json({ mensaje: 'Trabajo recepcional finalizado con éxito', trabajo: trabajoFinalizado });
    } catch (error) {
        res.status(400).json({ error: 'Error al finalizar el trabajo recepcional', detalle: error.message });
    }
};

const sugerirFolio = async (req, res) => {
    try {
        const { Id_Carrera, Tomo } = req.query;
        if (!Id_Carrera) {
            return res.status(400).json({ error: 'El parámetro Id_Carrera es requerido' });
        }
        const sugerencia = await folioService.sugerirSiguienteFolio(
            parseInt(Id_Carrera, 10),
            Tomo ? parseInt(Tomo, 10) : null
        );
        res.status(200).json(sugerencia);
    } catch (error) {
        res.status(400).json({ error: 'Error al sugerir el siguiente folio', detalle: error.message });
    }
};

const consultarEstadoTomo = async (req, res) => {
    try {
        const { Id_Carrera, Tomo } = req.query;
        if (!Id_Carrera || !Tomo) {
            return res.status(400).json({ error: 'Los parámetros Id_Carrera y Tomo son requeridos' });
        }
        const estadoTomo = await folioService.consultarEstadoTomo(
            parseInt(Id_Carrera, 10),
            parseInt(Tomo, 10)
        );
        res.status(200).json(estadoTomo);
    } catch (error) {
        res.status(400).json({ error: 'Error al consultar el estado del tomo', detalle: error.message });
    }
};

const listarTomos = async (req, res) => {
    try {
        const { Id_Carrera } = req.query;
        if (!Id_Carrera) {
            return res.status(400).json({ error: 'El parámetro Id_Carrera es requerido' });
        }
        const tomos = await folioService.listarTomosPorCarrera(parseInt(Id_Carrera, 10));
        res.status(200).json(tomos);
    } catch (error) {
        res.status(400).json({ error: 'Error al listar los tomos de la carrera', detalle: error.message });
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

const obtenerHistorialEstados = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const historial = await estadoTrabajoService.obtenerHistorialPorTrabajo(idTrabajoRecepcional);
        res.status(200).json(historial);
    } catch (error) {
        res.status(404).json({ error: 'Error al consultar historial de estados', detalle: error.message });
    }
};

const programarDefensa = async (req, res) => {
    try {
        const { id: idTrabajoRecepcional } = req.params;
        const numeroPersonal = extraerNumeroPersonal(req);
        const trabajoActualizado = await defensaService.programarDefensa(idTrabajoRecepcional, req.body, numeroPersonal);
        res.status(200).json({
            mensaje: 'Defensa de trabajo recepcional programada exitosamente',
            trabajo: trabajoActualizado
        });
    } catch (error) {
        res.status(400).json({ error: 'Error al programar la defensa', detalle: error.message });
    }
};

const consultarDisponibilidadAgenda = async (req, res) => {
    try {
        const disponibilidad = await defensaService.consultarDisponibilidad(req.query);
        res.status(200).json(disponibilidad);
    } catch (error) {
        res.status(400).json({ error: 'Error al consultar disponibilidad de horario y lugares', detalle: error.message });
    }
};

const consultarAgendaDefensas = async (req, res) => {
    try {
        const defensas = await defensaService.obtenerAgendaDefensas(req.query);
        res.status(200).json(defensas);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la agenda de defensas', detalle: error.message });
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
    sugerirFolio,
    consultarEstadoTomo,
    listarTomos,
    cambiarEstado,
    eliminar,
    obtenerHistorialEstados,
    programarDefensa,
    consultarDisponibilidadAgenda,
    consultarAgendaDefensas
};
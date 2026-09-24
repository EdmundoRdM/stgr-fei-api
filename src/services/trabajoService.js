const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const EstadoLista = require('../models/EstadoLista');
const Carrera = require('../models/Carrera');
const Lugar = require('../models/Lugar');
const EstudianteTrabajo = require('../models/EstudianteTrabajo');
const Estudiante = require('../models/Estudiante');
const ParticipantesTrabajo = require('../models/ParticipantesTrabajo');
const Academico = require('../models/Academico');
const RolDeParticipacion = require('../models/Rol_de_participacion');
const EstudianteDocumento = require('../models/EstudianteDocumento');
const bitacoraService = require('./bitacoraService');
const documentoService = require('./documentoService');

const validarFechaDefensa = (fecha) => {
    if (fecha !== undefined && fecha !== null && fecha !== '') {
        const fechaParseada = new Date(fecha);
        if (isNaN(fechaParseada.getTime())) {
            throw new Error('El campo Fecha_defensa debe ser una fecha y hora válida (ejemplo: 2026-06-25T10:00:00)');
        }
    }
};

const crearTrabajoBorrador = async (datosNuevoTrabajo) => {
    validarFechaDefensa(datosNuevoTrabajo.Fecha_defensa);
    const estadoBorrador = await EstadoLista.findOne({ where: { EstadoNombre: 'Borrador' } });
    
    const nuevoTrabajoRecepcional = {
        ...datosNuevoTrabajo,
        Id_Estado: estadoBorrador ? estadoBorrador.Id_Estado : 1,
        Folio: 'Pendiente',
        Resultado: 'Pendiente'
    };

    return await TrabajoRecepcional.create(nuevoTrabajoRecepcional);
};

const obtenerTrabajos = async (filtrosBusqueda = {}) => {
    const condicionesBusqueda = {};
    if (filtrosBusqueda.Id_Carrera) condicionesBusqueda.Id_Carrera = filtrosBusqueda.Id_Carrera;
    if (filtrosBusqueda.Id_Estado) condicionesBusqueda.Id_Estado = filtrosBusqueda.Id_Estado;
    if (filtrosBusqueda.Modalidad) condicionesBusqueda.Modalidad = filtrosBusqueda.Modalidad;

    return await TrabajoRecepcional.findAll({
        where: condicionesBusqueda,
        include: [
            { model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] },
            { model: Lugar, attributes: ['Id_Lugar', 'Nombre', 'Edificio'] },
            { model: EstadoLista, attributes: ['Id_Estado', 'EstadoNombre'] }
        ],
        order: [['Id_TrabajoR', 'DESC']]
    });
};

const obtenerTrabajoPorId = async (idTrabajoRecepcional) => {
    const trabajoRecepcionalEncontrado = await TrabajoRecepcional.findByPk(idTrabajoRecepcional, {
        include: [
            { model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] },
            { model: Lugar, attributes: ['Id_Lugar', 'Nombre', 'Edificio'] },
            { model: EstadoLista, attributes: ['Id_Estado', 'EstadoNombre'] },
            {
                model: EstudianteTrabajo,
                include: [
                    {
                        model: Estudiante,
                        attributes: ['Matricula', 'NombreCompleto', 'CorreoInstitucional', 'CorreoAlterno']
                    }
                ]
            },
            {
                model: ParticipantesTrabajo,
                include: [
                    {
                        model: Academico,
                        attributes: ['Numero_Personal', 'Nombre', 'ApellidoP', 'ApellidoM', 'CorreoInstitucional']
                    },
                    {
                        model: RolDeParticipacion,
                        attributes: ['Id_rol', 'NombreRol']
                    }
                ]
            }
        ]
    });
    if (!trabajoRecepcionalEncontrado) throw new Error('Trabajo recepcional no encontrado');
    return trabajoRecepcionalEncontrado;
};

const actualizarTrabajo = async (idTrabajoRecepcional, datosActualizacion, Numero_Personal) => {
    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const registroEstado = await EstadoLista.findByPk(trabajoRecepcional.Id_Estado);
    const estadoNombreActual = registroEstado ? registroEstado.EstadoNombre : '';

    // Restricción de negocio CU-05:
    // En Aprobado y Generado, Folio y Resultado permanecen bloqueados
    if (estadoNombreActual === 'Aprobado' || estadoNombreActual === 'Generado') {
        if ((datosActualizacion.Folio !== undefined && datosActualizacion.Folio !== trabajoRecepcional.Folio) ||
            (datosActualizacion.Resultado !== undefined && datosActualizacion.Resultado !== trabajoRecepcional.Resultado)) {
            throw new Error('Los campos Folio y Resultado se encuentran bloqueados para trabajos en estado Aprobado o Generado');
        }
    }

    if (datosActualizacion.Fecha_defensa !== undefined) {
        validarFechaDefensa(datosActualizacion.Fecha_defensa);
    }

    const camposPermitidosActualizacion = ['Titulo', 'Modalidad', 'Fecha_defensa', 'Id_Lugar', 'Id_Carrera'];
    if (estadoNombreActual === 'Finalizado') {
        camposPermitidosActualizacion.push('Folio', 'Resultado');
    }

    camposPermitidosActualizacion.forEach(nombreCampo => {
        if (datosActualizacion[nombreCampo] !== undefined) {
            trabajoRecepcional[nombreCampo] = datosActualizacion[nombreCampo];
        }
    });

    await trabajoRecepcional.save();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Edición de trabajo recepcional',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR: idTrabajoRecepcional,
        Detalles: `Se actualizó la información del trabajo "${trabajoRecepcional.Titulo}"`
    });

    return await obtenerTrabajoPorId(idTrabajoRecepcional);
};

const enviarAValidacion = async (idTrabajoRecepcional) => {
    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const registroEstado = await EstadoLista.findByPk(trabajoRecepcional.Id_Estado);
    if (!registroEstado || registroEstado.EstadoNombre !== 'Borrador') {
        throw new Error(`Solo los trabajos en estado 'Borrador' pueden enviarse a validación. Estado actual: ${registroEstado ? registroEstado.EstadoNombre : 'Desconocido'}`);
    }

    const estadoRegistrado = await EstadoLista.findOne({ where: { EstadoNombre: 'Registrado' } });
    if (!estadoRegistrado) throw new Error("Estado 'Registrado' no encontrado en el catálogo");

    trabajoRecepcional.Id_Estado = estadoRegistrado.Id_Estado;
    await trabajoRecepcional.save();
    return await obtenerTrabajoPorId(idTrabajoRecepcional);
};

const validarTrabajo = async (idTrabajoRecepcional, Numero_Personal) => {
    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const registroEstado = await EstadoLista.findByPk(trabajoRecepcional.Id_Estado);
    if (!registroEstado || registroEstado.EstadoNombre !== 'Registrado') {
        throw new Error(`Solo los trabajos en estado 'Registrado' pueden ser validados/aprobados. Estado actual: ${registroEstado ? registroEstado.EstadoNombre : 'Desconocido'}`);
    }

    const estadoAprobado = await EstadoLista.findOne({ where: { EstadoNombre: 'Aprobado' } });
    if (!estadoAprobado) throw new Error("Estado 'Aprobado' no encontrado en el catálogo");

    trabajoRecepcional.Id_Estado = estadoAprobado.Id_Estado;
    await trabajoRecepcional.save();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Validación de trabajo recepcional',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR: idTrabajoRecepcional,
        Detalles: `Trabajo recepcional "${trabajoRecepcional.Titulo}" validado y aprobado exitosamente.`
    });

    return await obtenerTrabajoPorId(idTrabajoRecepcional);
};

const rechazarTrabajo = async (idTrabajoRecepcional, motivoRechazo, Numero_Personal) => {
    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const registroEstado = await EstadoLista.findByPk(trabajoRecepcional.Id_Estado);
    if (!registroEstado || registroEstado.EstadoNombre !== 'Registrado') {
        throw new Error(`Solo los trabajos en estado 'Registrado' pueden ser rechazados. Estado actual: ${registroEstado ? registroEstado.EstadoNombre : 'Desconocido'}`);
    }

    const estadoBorrador = await EstadoLista.findOne({ where: { EstadoNombre: 'Borrador' } });
    if (!estadoBorrador) throw new Error("Estado 'Borrador' no encontrado en el catálogo");

    trabajoRecepcional.Id_Estado = estadoBorrador.Id_Estado;
    await trabajoRecepcional.save();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Rechazo de trabajo recepcional',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR: idTrabajoRecepcional,
        Detalles: `Trabajo recepcional "${trabajoRecepcional.Titulo}" devuelto a borrador. Motivo: ${motivoRechazo || 'Sin motivo especificado'}`
    });

    return {
        mensaje: 'Trabajo recepcional devuelto a borrador para corrección',
        motivo: motivoRechazo || 'Sin motivo especificado',
        trabajo: await obtenerTrabajoPorId(idTrabajoRecepcional)
    };
};

// CU-06: Generar acta tras completar checklist de documentos
const generarActa = async (idTrabajoRecepcional, Numero_Personal) => {
    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const registroEstado = await EstadoLista.findByPk(trabajoRecepcional.Id_Estado);
    if (!registroEstado || registroEstado.EstadoNombre !== 'Aprobado') {
        throw new Error(`Solo los trabajos en estado 'Aprobado' pueden generar acta. Estado actual: ${registroEstado ? registroEstado.EstadoNombre : 'Desconocido'}`);
    }

    const checklist = await documentoService.obtenerChecklistPorTrabajo(idTrabajoRecepcional);
    if (!checklist.checklistCompleto) {
        throw new Error(`No se puede generar el acta: faltan documentos por entregar (${checklist.totalEntregados}/${checklist.totalDocumentosRequeridos} entregados)`);
    }

    const estadoGenerado = await EstadoLista.findOne({ where: { EstadoNombre: 'Generado' } });
    if (!estadoGenerado) throw new Error("Estado 'Generado' no encontrado en el catálogo");

    trabajoRecepcional.Id_Estado = estadoGenerado.Id_Estado;
    await trabajoRecepcional.save();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Generación de acta de trabajo recepcional',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR: idTrabajoRecepcional,
        Detalles: `Se generó el acta oficial tras recibir el 100% de los documentos requeridos para el trabajo "${trabajoRecepcional.Titulo}".`
    });

    return await obtenerTrabajoPorId(idTrabajoRecepcional);
};

const finalizarTrabajo = async (idTrabajoRecepcional, { Folio, Resultado, Numero_Personal }) => {
    if (!Folio || Folio.trim() === '' || Folio === 'Pendiente') {
        throw new Error('Se requiere un Folio válido para finalizar el trabajo recepcional');
    }
    if (!Resultado || Resultado.trim() === '' || Resultado === 'Pendiente') {
        throw new Error('Se requiere registrar el Resultado de la defensa para finalizar el trabajo recepcional');
    }

    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const registroEstado = await EstadoLista.findByPk(trabajoRecepcional.Id_Estado);
    const estadoNombre = registroEstado ? registroEstado.EstadoNombre : '';
    if (estadoNombre !== 'Generado') {
        throw new Error(`Solo los trabajos en estado 'Generado' (con acta generada) pueden ser finalizados. Estado actual: ${estadoNombre}`);
    }

    const estadoFinalizado = await EstadoLista.findOne({ where: { EstadoNombre: 'Finalizado' } });
    if (!estadoFinalizado) throw new Error("Estado 'Finalizado' no encontrado en el catálogo");

    trabajoRecepcional.Folio = Folio;
    trabajoRecepcional.Resultado = Resultado;
    trabajoRecepcional.Id_Estado = estadoFinalizado.Id_Estado;
    await trabajoRecepcional.save();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Finalización de trabajo recepcional',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR: idTrabajoRecepcional,
        Detalles: `Trabajo finalizado con Folio: ${Folio}, Resultado: ${Resultado}`
    });

    return await obtenerTrabajoPorId(idTrabajoRecepcional);
};

const actualizarEstadoTrabajo = async (idTrabajoRecepcional, nombreEstadoDestino) => {
    const estadoDestino = await EstadoLista.findOne({ where: { EstadoNombre: nombreEstadoDestino } });
    if (!estadoDestino) throw new Error('Estado no válido en el catálogo');

    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    trabajoRecepcional.Id_Estado = estadoDestino.Id_Estado;
    await trabajoRecepcional.save();
    return await obtenerTrabajoPorId(idTrabajoRecepcional);
};

const eliminarTrabajo = async (idTrabajoRecepcional, Numero_Personal) => {
    const trabajoRecepcional = await TrabajoRecepcional.findByPk(idTrabajoRecepcional);
    if (!trabajoRecepcional) throw new Error('Trabajo recepcional no encontrado');

    const titulo = trabajoRecepcional.Titulo;

    await EstudianteDocumento.destroy({ where: { Id_TrabajoR: idTrabajoRecepcional } });
    await ParticipantesTrabajo.destroy({ where: { Id_TrabajoR: idTrabajoRecepcional } });
    await EstudianteTrabajo.destroy({ where: { Id_TrabajoR: idTrabajoRecepcional } });

    await trabajoRecepcional.destroy();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Eliminación de trabajo recepcional',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR: null,
        Detalles: `Se eliminó el trabajo recepcional "${titulo}" (ID previo: ${idTrabajoRecepcional})`
    });

    return { mensaje: 'Trabajo recepcional eliminado correctamente' };
};

module.exports = {
    crearTrabajoBorrador,
    obtenerTrabajos,
    obtenerTrabajoPorId,
    actualizarTrabajo,
    enviarAValidacion,
    validarTrabajo,
    rechazarTrabajo,
    generarActa,
    finalizarTrabajo,
    actualizarEstadoTrabajo,
    eliminarTrabajo
};
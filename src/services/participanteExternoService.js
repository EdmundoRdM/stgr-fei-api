const { Op } = require('sequelize');
const ParticipanteExterno = require('../models/ParticipanteExterno');
const ParticipantesExternosTrabajo = require('../models/ParticipantesExternosTrabajo');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const RolDeParticipacion = require('../models/Rol_de_participacion');
const bitacoraService = require('./bitacoraService');

const crearParticipanteExterno = async (datos) => {
    const { Nombre, ApellidoP, ApellidoM, CorreoElectronico, Institucion } = datos;

    if (!Nombre || !ApellidoP) {
        throw new Error('El Nombre y Apellido Paterno son obligatorios para el participante externo');
    }

    if (CorreoElectronico) {
        const existente = await ParticipanteExterno.findOne({ where: { CorreoElectronico } });
        if (existente) {
            throw new Error(`Ya existe un participante externo registrado con el correo ${CorreoElectronico}`);
        }
    }

    return await ParticipanteExterno.create({
        Nombre,
        ApellidoP,
        ApellidoM: ApellidoM || null,
        CorreoElectronico: CorreoElectronico || null,
        Institucion: Institucion || null
    });
};

const obtenerParticipantesExternos = async (filtros = {}) => {
    const condiciones = {};

    if (filtros.Institucion) {
        condiciones.Institucion = { [Op.like]: `%${filtros.Institucion}%` };
    }

    if (filtros.busqueda) {
        condiciones[Op.or] = [
            { Nombre: { [Op.like]: `%${filtros.busqueda}%` } },
            { ApellidoP: { [Op.like]: `%${filtros.busqueda}%` } },
            { ApellidoM: { [Op.like]: `%${filtros.busqueda}%` } },
            { Institucion: { [Op.like]: `%${filtros.busqueda}%` } },
            { CorreoElectronico: { [Op.like]: `%${filtros.busqueda}%` } }
        ];
    }

    return await ParticipanteExterno.findAll({
        where: condiciones,
        order: [['ApellidoP', 'ASC'], ['Nombre', 'ASC']]
    });
};

const obtenerParticipanteExternoPorId = async (id) => {
    const participante = await ParticipanteExterno.findByPk(id, {
        include: [
            {
                model: ParticipantesExternosTrabajo,
                include: [
                    {
                        model: TrabajoRecepcional,
                        attributes: ['Id_TrabajoR', 'Titulo', 'Folio', 'Modalidad']
                    },
                    {
                        model: RolDeParticipacion,
                        attributes: ['Id_rol', 'NombreRol']
                    }
                ]
            }
        ]
    });

    if (!participante) {
        throw new Error(`Participante externo no encontrado con el identificador ${id}`);
    }

    return participante;
};

const actualizarParticipanteExterno = async (id, datosActualizacion) => {
    const participante = await ParticipanteExterno.findByPk(id);
    if (!participante) {
        throw new Error(`Participante externo no encontrado con el identificador ${id}`);
    }

    if (datosActualizacion.CorreoElectronico && datosActualizacion.CorreoElectronico !== participante.CorreoElectronico) {
        const existente = await ParticipanteExterno.findOne({
            where: {
                CorreoElectronico: datosActualizacion.CorreoElectronico,
                Id_ParticipanteExt: { [Op.ne]: id }
            }
        });
        if (existente) {
            throw new Error(`El correo ${datosActualizacion.CorreoElectronico} ya pertenece a otro participante externo`);
        }
    }

    const camposPermitidos = ['Nombre', 'ApellidoP', 'ApellidoM', 'CorreoElectronico', 'Institucion'];
    camposPermitidos.forEach(campo => {
        if (datosActualizacion[campo] !== undefined) {
            participante[campo] = datosActualizacion[campo];
        }
    });

    await participante.save();
    return participante;
};

const eliminarParticipanteExterno = async (id) => {
    const participante = await ParticipanteExterno.findByPk(id);
    if (!participante) {
        throw new Error(`Participante externo no encontrado con el identificador ${id}`);
    }

    const asignaciones = await ParticipantesExternosTrabajo.count({ where: { Id_ParticipanteExt: id } });
    if (asignaciones > 0) {
        throw new Error(`No se puede eliminar el participante externo porque está asignado a ${asignaciones} trabajo(s) recepcional(es)`);
    }

    await participante.destroy();
    return { mensaje: 'Participante externo eliminado correctamente' };
};

const asignarParticipanteExternoATrabajo = async (datos) => {
    const { Id_TrabajoR, Id_ParticipanteExt, Id_rol, Numero_Personal } = datos;

    if (!Id_TrabajoR || !Id_ParticipanteExt || !Id_rol) {
        throw new Error('Se requieren Id_TrabajoR, Id_ParticipanteExt y Id_rol');
    }

    const trabajo = await TrabajoRecepcional.findByPk(Id_TrabajoR);
    if (!trabajo) throw new Error('Trabajo recepcional no encontrado');

    const participante = await ParticipanteExterno.findByPk(Id_ParticipanteExt);
    if (!participante) throw new Error('Participante externo no encontrado');

    const rol = await RolDeParticipacion.findByPk(Id_rol);
    if (!rol) throw new Error('Rol de participación no válido');

    const existente = await ParticipantesExternosTrabajo.findOne({
        where: { Id_TrabajoR, Id_ParticipanteExt }
    });
    if (existente) {
        throw new Error(`El participante externo ya está asignado a este trabajo recepcional`);
    }

    const asignacion = await ParticipantesExternosTrabajo.create({
        Id_TrabajoR,
        Id_ParticipanteExt,
        Id_rol
    });

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Asignación de participante externo',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR,
        Detalles: `Se asignó al participante externo ${participante.Nombre} ${participante.ApellidoP} (${participante.Institucion || 'Externo'}) con rol ${rol.NombreRol}`
    });

    return await ParticipantesExternosTrabajo.findByPk(asignacion.Id_ParticipanteExtTrabajo, {
        include: [
            { model: ParticipanteExterno },
            { model: RolDeParticipacion }
        ]
    });
};

const obtenerParticipantesExternosPorTrabajo = async (idTrabajoRecepcional) => {
    return await ParticipantesExternosTrabajo.findAll({
        where: { Id_TrabajoR: idTrabajoRecepcional },
        include: [
            {
                model: ParticipanteExterno,
                attributes: ['Id_ParticipanteExt', 'Nombre', 'ApellidoP', 'ApellidoM', 'CorreoElectronico', 'Institucion']
            },
            {
                model: RolDeParticipacion,
                attributes: ['Id_rol', 'NombreRol']
            }
        ]
    });
};

const removerParticipanteExternoDeTrabajo = async (idAsignacion, Numero_Personal = null) => {
    const asignacion = await ParticipantesExternosTrabajo.findByPk(idAsignacion, {
        include: [
            { model: ParticipanteExterno },
            { model: RolDeParticipacion }
        ]
    });

    if (!asignacion) {
        throw new Error('Asignación de participante externo no encontrada');
    }

    const idTrabajoR = asignacion.Id_TrabajoR;
    const nombreCompleto = asignacion.ParticipanteExterno ? `${asignacion.ParticipanteExterno.Nombre} ${asignacion.ParticipanteExterno.ApellidoP}` : 'Externo';
    const rolNombre = asignacion.Rol_de_participacion?.NombreRol || 'Participante';

    await asignacion.destroy();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Desvinculación de participante externo',
        Numero_Personal,
        Id_TrabajoR: idTrabajoR,
        Detalles: `Se desvinculó al participante externo ${nombreCompleto} (rol: ${rolNombre}) del trabajo recepcional`
    });

    return { mensaje: 'Participante externo desvinculado del trabajo recepcional exitosamente' };
};

module.exports = {
    crearParticipanteExterno,
    obtenerParticipantesExternos,
    obtenerParticipanteExternoPorId,
    actualizarParticipanteExterno,
    eliminarParticipanteExterno,
    asignarParticipanteExternoATrabajo,
    obtenerParticipantesExternosPorTrabajo,
    removerParticipanteExternoDeTrabajo
};

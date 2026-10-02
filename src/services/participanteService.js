const ParticipantesTrabajo = require('../models/ParticipantesTrabajo');
const EstudianteTrabajo = require('../models/EstudianteTrabajo');
const Academico = require('../models/Academico');
const Estudiante = require('../models/Estudiante');
const RolDeParticipacion = require('../models/Rol_de_participacion');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const cursoService = require('./cursoService');
const academicoService = require('./academicoService');
const participanteExternoService = require('./participanteExternoService');


const asignarAcademico = async (datosAsignacionAcademico) => {
    const { Id_TrabajoR, Numero_Personal, Id_rol } = datosAsignacionAcademico;
    if (!Id_TrabajoR || !Numero_Personal || !Id_rol) {
        throw new Error('Se requiere Id_TrabajoR, Numero_Personal y Id_rol');
    }

    const trabajoRecepcionalEncontrado = await TrabajoRecepcional.findByPk(Id_TrabajoR);
    if (!trabajoRecepcionalEncontrado) throw new Error('Trabajo recepcional no encontrado');

    return await ParticipantesTrabajo.create({
        Id_TrabajoR,
        Numero_Personal,
        Id_rol
    });
};

const obtenerAcademicosPorTrabajo = async (idTrabajoRecepcional) => {
    return await ParticipantesTrabajo.findAll({
        where: { Id_TrabajoR: idTrabajoRecepcional },
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
    });
};

const removerAcademico = async (idParticipacionAcademico) => {
    const participacionAcademico = await ParticipantesTrabajo.findByPk(idParticipacionAcademico);
    if (!participacionAcademico) throw new Error('Asignación de académico no encontrada');

    await participacionAcademico.destroy();
    return { mensaje: 'Académico removido del trabajo recepcional exitosamente' };
};


const asignarEstudiante = async (datosAsignacionEstudiante) => {
    const { Id_TrabajoR, Matricula, Numero_Personal } = datosAsignacionEstudiante;
    if (!Id_TrabajoR || !Matricula) {
        throw new Error('Se requiere Id_TrabajoR y Matricula');
    }

    const trabajoRecepcionalEncontrado = await TrabajoRecepcional.findByPk(Id_TrabajoR);
    if (!trabajoRecepcionalEncontrado) throw new Error('Trabajo recepcional no encontrado');

    // Regla de Negocio: si quien asigna es profesor, solo puede con alumnos en su grupo del periodo actual
    if (Numero_Personal) {
        const perfil = await academicoService.obtenerPerfilAcademico(Numero_Personal);
        if (perfil && perfil.tipoRol === 'Profesor') {
            const verificacion = await cursoService.esEstudianteDeProfesorEnPeriodoActual(Numero_Personal, Matricula);
            if (!verificacion.valido) {
                throw new Error(verificacion.razon);
            }
        }
    }

    return await EstudianteTrabajo.create({
        Id_TrabajoR,
        Matricula
    });
};

const obtenerEstudiantesPorTrabajo = async (idTrabajoRecepcional) => {
    return await EstudianteTrabajo.findAll({
        where: { Id_TrabajoR: idTrabajoRecepcional },
        include: [
            {
                model: Estudiante,
                attributes: ['Matricula', 'NombreCompleto', 'CorreoInstitucional', 'CorreoAlterno']
            }
        ]
    });
};

const removerEstudiante = async (idAsignacionEstudiante) => {
    const asignacionEstudiante = await EstudianteTrabajo.findByPk(idAsignacionEstudiante);
    if (!asignacionEstudiante) throw new Error('Relación estudiante-trabajo no encontrada');

    await asignacionEstudiante.destroy();
    return { mensaje: 'Estudiante desvinculado del trabajo recepcional correctamente' };
};

const obtenerTodosLosParticipantes = async (idTrabajoRecepcional) => {
    const [listaAcademicos, listaEstudiantes, listaExternos] = await Promise.all([
        obtenerAcademicosPorTrabajo(idTrabajoRecepcional),
        obtenerEstudiantesPorTrabajo(idTrabajoRecepcional),
        participanteExternoService.obtenerParticipantesExternosPorTrabajo(idTrabajoRecepcional)
    ]);
    return {
        Id_TrabajoR: idTrabajoRecepcional,
        academicos: listaAcademicos,
        estudiantes: listaEstudiantes,
        participantesExternos: listaExternos
    };
};

module.exports = {
    asignarAcademico,
    obtenerAcademicosPorTrabajo,
    removerAcademico,

    asignarEstudiante,
    obtenerEstudiantesPorTrabajo,
    removerEstudiante,

    asignarParticipanteExterno: participanteExternoService.asignarParticipanteExternoATrabajo,
    obtenerParticipantesExternosPorTrabajo: participanteExternoService.obtenerParticipantesExternosPorTrabajo,
    removerParticipanteExterno: participanteExternoService.removerParticipanteExternoDeTrabajo,

    obtenerTodosLosParticipantes,

    asignarParticipante: asignarAcademico,
    obtenerParticipantesPorTrabajo: obtenerAcademicosPorTrabajo,
    removerParticipante: removerAcademico,
    asignarEstudianteATrabajo: asignarEstudiante,
    removerEstudianteDeTrabajo: removerEstudiante
};
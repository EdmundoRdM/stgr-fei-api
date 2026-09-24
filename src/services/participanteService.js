const ParticipantesTrabajo = require('../models/ParticipantesTrabajo');
const EstudianteTrabajo = require('../models/EstudianteTrabajo');
const Academico = require('../models/Academico');
const Estudiante = require('../models/Estudiante');
const RolDeParticipacion = require('../models/Rol_de_participacion');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');


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
    const { Id_TrabajoR, Matricula } = datosAsignacionEstudiante;
    if (!Id_TrabajoR || !Matricula) {
        throw new Error('Se requiere Id_TrabajoR y Matricula');
    }

    const trabajoRecepcionalEncontrado = await TrabajoRecepcional.findByPk(Id_TrabajoR);
    if (!trabajoRecepcionalEncontrado) throw new Error('Trabajo recepcional no encontrado');

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
    const [listaAcademicos, listaEstudiantes] = await Promise.all([
        obtenerAcademicosPorTrabajo(idTrabajoRecepcional),
        obtenerEstudiantesPorTrabajo(idTrabajoRecepcional)
    ]);
    return {
        Id_TrabajoR: idTrabajoRecepcional,
        academicos: listaAcademicos,
        estudiantes: listaEstudiantes
    };
};

module.exports = {
    asignarAcademico,
    obtenerAcademicosPorTrabajo,
    removerAcademico,

    asignarEstudiante,
    obtenerEstudiantesPorTrabajo,
    removerEstudiante,

    obtenerTodosLosParticipantes,

    asignarParticipante: asignarAcademico,
    obtenerParticipantesPorTrabajo: obtenerAcademicosPorTrabajo,
    removerParticipante: removerAcademico,
    asignarEstudianteATrabajo: asignarEstudiante,
    removerEstudianteDeTrabajo: removerEstudiante
};
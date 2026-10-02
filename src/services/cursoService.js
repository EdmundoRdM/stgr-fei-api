const CursoER = require('../models/CursoER');
const AcademicoCursoER = require('../models/AcademicoCursoER');
const CursoEREstudiante = require('../models/CursoEREstudiante');
const Academico = require('../models/Academico');
const Estudiante = require('../models/Estudiante');
const Carrera = require('../models/Carrera');
const PeriodosEscolares = require('../models/Periodos_Escolares');
const periodoService = require('./periodoService');

const crearCurso = async (datosCurso) => {
    const { NRC, Nombre } = datosCurso;
    if (!NRC) throw new Error('El campo NRC es obligatorio');

    const cursoExistente = await CursoER.findOne({ where: { NRC } });
    if (cursoExistente) throw new Error(`Ya existe un curso registrado con el NRC ${NRC}`);

    return await CursoER.create({
        NRC,
        Nombre: Nombre || 'Experiencia Recepcional'
    });
};

const listarCursos = async () => {
    return await CursoER.findAll({
        order: [['NRC', 'ASC']]
    });
};

const obtenerCursoPorId = async (idCurso) => {
    const curso = await CursoER.findByPk(idCurso, {
        include: [
            {
                model: AcademicoCursoER,
                include: [
                    {
                        model: Academico,
                        attributes: ['Numero_Personal', 'Nombre', 'ApellidoP', 'ApellidoM', 'CorreoInstitucional']
                    },
                    {
                        model: PeriodosEscolares,
                        attributes: ['Id_Periodo', 'Nomenclatura', 'Fecha_inicio', 'Fecha_fin']
                    }
                ]
            },
            {
                model: CursoEREstudiante,
                include: [
                    {
                        model: Estudiante,
                        attributes: ['Matricula', 'NombreCompleto', 'CorreoInstitucional'],
                        include: [{ model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] }]
                    },
                    {
                        model: PeriodosEscolares,
                        attributes: ['Id_Periodo', 'Nomenclatura']
                    }
                ]
            }
        ]
    });
    if (!curso) throw new Error('Curso de Experiencia Recepcional no encontrado');
    return curso;
};

const resolverIdCurso = async ({ Id_Curso, NRC }) => {
    if (Id_Curso) return Id_Curso;
    if (NRC) {
        const curso = await CursoER.findOne({ where: { NRC } });
        if (!curso) throw new Error(`No se encontró ningún curso con el NRC ${NRC}`);
        return curso.Id_Curso;
    }
    throw new Error('Debe proporcionar el Id_Curso o el NRC');
};

const asignarProfesorACurso = async ({ Id_Curso, NRC, Numero_Personal, Id_Periodo }) => {
    const idCursoFinal = await resolverIdCurso({ Id_Curso, NRC });

    if (!Numero_Personal) throw new Error('El campo Numero_Personal es obligatorio');
    const academico = await Academico.findByPk(Numero_Personal);
    if (!academico) throw new Error('Académico no encontrado');

    let idPeriodoFinal = Id_Periodo;
    if (!idPeriodoFinal) {
        const periodoActual = await periodoService.obtenerPeriodoActual();
        if (!periodoActual) throw new Error('No se pudo determinar el periodo escolar actual');
        idPeriodoFinal = periodoActual.Id_Periodo;
    }

    const asignacionExistente = await AcademicoCursoER.findOne({
        where: {
            Id_Curso: idCursoFinal,
            Numero_Personal,
            Id_Periodo: idPeriodoFinal
        }
    });

    if (asignacionExistente) {
        throw new Error('El profesor ya se encuentra asignado a este curso en el periodo especificado');
    }

    return await AcademicoCursoER.create({
        Id_Curso: idCursoFinal,
        Numero_Personal,
        Id_Periodo: idPeriodoFinal
    });
};

const inscribirEstudianteACurso = async ({ Id_Curso, NRC, Matricula, Id_Periodo }) => {
    const idCursoFinal = await resolverIdCurso({ Id_Curso, NRC });

    if (!Matricula) throw new Error('El campo Matricula es obligatorio');
    const estudiante = await Estudiante.findByPk(Matricula);
    if (!estudiante) throw new Error('Estudiante no encontrado');

    let idPeriodoFinal = Id_Periodo;
    if (!idPeriodoFinal) {
        const periodoActual = await periodoService.obtenerPeriodoActual();
        if (!periodoActual) throw new Error('No se pudo determinar el periodo escolar actual');
        idPeriodoFinal = periodoActual.Id_Periodo;
    }

    const inscripcionExistente = await CursoEREstudiante.findOne({
        where: {
            Id_Curso: idCursoFinal,
            Matricula,
            Id_Periodo: idPeriodoFinal
        }
    });

    if (inscripcionExistente) {
        throw new Error('El estudiante ya se encuentra inscrito en este curso en el periodo especificado');
    }

    return await CursoEREstudiante.create({
        Id_Curso: idCursoFinal,
        Matricula,
        Id_Periodo: idPeriodoFinal
    });
};

const inscribirEstudiantesLote = async ({ Id_Curso, NRC, Matriculas, Id_Periodo }) => {
    if (!Array.isArray(Matriculas) || Matriculas.length === 0) {
        throw new Error('Debe proporcionar un arreglo de matrículas no vacío');
    }

    const resultados = [];
    for (const matricula of Matriculas) {
        try {
            const inscripcion = await inscribirEstudianteACurso({
                Id_Curso,
                NRC,
                Matricula: matricula,
                Id_Periodo
            });
            resultados.push({ matricula, exito: true, inscripcion });
        } catch (error) {
            resultados.push({ matricula, exito: false, error: error.message });
        }
    }
    return resultados;
};

const obtenerGruposProfesor = async (Numero_Personal, soloPeriodoActual = false) => {
    if (!Numero_Personal) throw new Error('El Numero_Personal es obligatorio');

    const condiciones = { Numero_Personal };
    if (soloPeriodoActual) {
        const periodoActual = await periodoService.obtenerPeriodoActual();
        if (periodoActual) {
            condiciones.Id_Periodo = periodoActual.Id_Periodo;
        }
    }

    const asignaciones = await AcademicoCursoER.findAll({
        where: condiciones,
        include: [
            {
                model: CursoER,
                attributes: ['Id_Curso', 'NRC', 'Nombre']
            },
            {
                model: PeriodosEscolares,
                attributes: ['Id_Periodo', 'Nomenclatura', 'Fecha_inicio', 'Fecha_fin']
            }
        ],
        order: [[PeriodosEscolares, 'Fecha_inicio', 'DESC']]
    });

    // Para cada grupo, anexar los estudiantes inscritos en ese curso y periodo
    const gruposConAlumnos = await Promise.all(asignaciones.map(async (asig) => {
        const inscritos = await CursoEREstudiante.findAll({
            where: {
                Id_Curso: asig.Id_Curso,
                Id_Periodo: asig.Id_Periodo
            },
            include: [
                {
                    model: Estudiante,
                    attributes: ['Matricula', 'NombreCompleto', 'CorreoInstitucional'],
                    include: [{ model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] }]
                }
            ]
        });

        return {
            idAsignacion: asig.Id_AcademicoCursoER,
            curso: asig.CursoER,
            periodo: asig.Periodos_Escolare || asig.PeriodosEscolare,
            estudiantes: inscritos.map(ins => ins.Estudiante)
        };
    }));

    return gruposConAlumnos;
};

const obtenerEstudiantesGrupo = async (Id_Curso, Id_Periodo) => {
    const idCursoFinal = await resolverIdCurso({ Id_Curso });
    let idPeriodoFinal = Id_Periodo;
    if (!idPeriodoFinal) {
        const periodoActual = await periodoService.obtenerPeriodoActual();
        if (periodoActual) idPeriodoFinal = periodoActual.Id_Periodo;
    }

    const inscritos = await CursoEREstudiante.findAll({
        where: {
            Id_Curso: idCursoFinal,
            ...(idPeriodoFinal ? { Id_Periodo: idPeriodoFinal } : {})
        },
        include: [
            {
                model: Estudiante,
                attributes: ['Matricula', 'NombreCompleto', 'CorreoInstitucional'],
                include: [{ model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] }]
            },
            {
                model: PeriodosEscolares,
                attributes: ['Id_Periodo', 'Nomenclatura']
            }
        ]
    });

    return inscritos;
};

/**
 * Valida si un alumno está inscrito en el grupo de ER del profesor en el periodo actual.
 * (Regla de negocio: para registrar, solo se puede con alumnos que estén en el grupo del periodo actual)
 */
const esEstudianteDeProfesorEnPeriodoActual = async (Numero_Personal, Matricula) => {
    const periodoActual = await periodoService.obtenerPeriodoActual();
    if (!periodoActual) {
        throw new Error('No se encontró un periodo escolar vigente en el sistema');
    }

    // Cursos del profesor en el periodo actual
    const cursosProfesor = await AcademicoCursoER.findAll({
        where: {
            Numero_Personal,
            Id_Periodo: periodoActual.Id_Periodo
        },
        attributes: ['Id_Curso']
    });

    if (!cursosProfesor || cursosProfesor.length === 0) {
        return {
            valido: false,
            razon: 'El profesor no cuenta con grupos de Experiencia Recepcional asignados en el periodo escolar vigente',
            periodoActual
        };
    }

    const listaIdCursos = cursosProfesor.map(c => c.Id_Curso);

    const inscripcion = await CursoEREstudiante.findOne({
        where: {
            Id_Curso: listaIdCursos,
            Matricula,
            Id_Periodo: periodoActual.Id_Periodo
        }
    });

    if (!inscripcion) {
        return {
            valido: false,
            razon: `El estudiante con matrícula ${Matricula} no se encuentra inscrito en el grupo de Experiencia Recepcional del profesor para el periodo escolar actual (${periodoActual.Nomenclatura})`,
            periodoActual
        };
    }

    return {
        valido: true,
        periodoActual,
        idCurso: inscripcion.Id_Curso
    };
};

/**
 * Obtiene todas las matrículas históricas asociadas a los grupos de un profesor (todos los periodos)
 */
const obtenerMatriculasEstudiantesDeProfesor = async (Numero_Personal) => {
    const cursosProfesor = await AcademicoCursoER.findAll({
        where: { Numero_Personal },
        attributes: ['Id_Curso', 'Id_Periodo']
    });

    if (!cursosProfesor || cursosProfesor.length === 0) {
        return [];
    }

    const condicionesOr = cursosProfesor.map(c => ({
        Id_Curso: c.Id_Curso,
        Id_Periodo: c.Id_Periodo
    }));

    const { Op } = require('sequelize');
    const inscripciones = await CursoEREstudiante.findAll({
        where: { [Op.or]: condicionesOr },
        attributes: ['Matricula']
    });

    return [...new Set(inscripciones.map(i => i.Matricula))];
};

module.exports = {
    crearCurso,
    listarCursos,
    obtenerCursoPorId,
    asignarProfesorACurso,
    inscribirEstudianteACurso,
    inscribirEstudiantesLote,
    obtenerGruposProfesor,
    obtenerEstudiantesGrupo,
    esEstudianteDeProfesorEnPeriodoActual,
    obtenerMatriculasEstudiantesDeProfesor
};

const cursoService = require('../services/cursoService');
const periodoService = require('../services/periodoService');

const extraerNumeroPersonal = (req) => {
    return req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
};

const crear = async (req, res) => {
    try {
        const nuevoCurso = await cursoService.crearCurso(req.body);
        res.status(201).json({ mensaje: 'Curso de Experiencia Recepcional creado con éxito', curso: nuevoCurso });
    } catch (error) {
        res.status(400).json({ error: 'Error al crear el curso', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const cursos = await cursoService.listarCursos();
        res.status(200).json(cursos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar los cursos', detalle: error.message });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const curso = await cursoService.obtenerCursoPorId(id);
        res.status(200).json(curso);
    } catch (error) {
        res.status(404).json({ error: 'Curso no encontrado', detalle: error.message });
    }
};

const asignarProfesor = async (req, res) => {
    try {
        const asignacion = await cursoService.asignarProfesorACurso(req.body);
        res.status(201).json({ mensaje: 'Profesor asignado al curso con éxito', asignacion });
    } catch (error) {
        res.status(400).json({ error: 'Error al asignar profesor al curso', detalle: error.message });
    }
};

const inscribirEstudiante = async (req, res) => {
    try {
        const inscripcion = await cursoService.inscribirEstudianteACurso(req.body);
        res.status(201).json({ mensaje: 'Estudiante inscrito al curso con éxito', inscripcion });
    } catch (error) {
        res.status(400).json({ error: 'Error al inscribir estudiante', detalle: error.message });
    }
};

const inscribirLote = async (req, res) => {
    try {
        const resultados = await cursoService.inscribirEstudiantesLote(req.body);
        res.status(200).json({ mensaje: 'Proceso de inscripción por lote completado', resultados });
    } catch (error) {
        res.status(400).json({ error: 'Error al procesar inscripción por lote', detalle: error.message });
    }
};

const misGrupos = async (req, res) => {
    try {
        const numeroPersonal = extraerNumeroPersonal(req);
        if (!numeroPersonal) {
            return res.status(400).json({ error: 'Se requiere el Numero_Personal (vía header x-numero-personal o query)' });
        }
        const soloActual = req.query.soloActual === 'true' || req.query.actual === '1';
        const grupos = await cursoService.obtenerGruposProfesor(numeroPersonal, soloActual);
        res.status(200).json(grupos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los grupos del profesor', detalle: error.message });
    }
};

const obtenerEstudiantes = async (req, res) => {
    try {
        const { id } = req.params;
        const idPeriodo = req.query.Id_Periodo || null;
        const estudiantes = await cursoService.obtenerEstudiantesGrupo(id, idPeriodo);
        res.status(200).json(estudiantes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estudiantes del curso', detalle: error.message });
    }
};

const obtenerPeriodoActual = async (req, res) => {
    try {
        const periodo = await periodoService.obtenerPeriodoActual();
        res.status(200).json(periodo);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el periodo actual', detalle: error.message });
    }
};

const listarPeriodos = async (req, res) => {
    try {
        const periodos = await periodoService.listarPeriodos();
        res.status(200).json(periodos);
    } catch (error) {
        res.status(500).json({ error: 'Error al listar periodos escolares', detalle: error.message });
    }
};

module.exports = {
    crear,
    listar,
    obtenerPorId,
    asignarProfesor,
    inscribirEstudiante,
    inscribirLote,
    misGrupos,
    obtenerEstudiantes,
    obtenerPeriodoActual,
    listarPeriodos
};

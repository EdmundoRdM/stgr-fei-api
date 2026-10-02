const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');

/**
 * @swagger
 * tags:
 *   name: Cursos ER
 *   description: Gestión de Cursos de Experiencia Recepcional (NRC), grupos y asignaciones de profesores y alumnos
 */

/**
 * @swagger
 * /api/cursos/periodo-actual:
 *   get:
 *     summary: Obtener el periodo escolar actual
 *     tags: [Cursos ER]
 *     responses:
 *       200:
 *         description: Periodo escolar vigente
 */
router.get('/periodo-actual', cursoController.obtenerPeriodoActual);

/**
 * @swagger
 * /api/cursos/periodos:
 *   get:
 *     summary: Listar todos los periodos escolares registrados
 *     tags: [Cursos ER]
 *     responses:
 *       200:
 *         description: Lista de periodos escolares
 */
router.get('/periodos', cursoController.listarPeriodos);

/**
 * @swagger
 * /api/cursos/mis-grupos:
 *   get:
 *     summary: Obtener los grupos de ER asignados a un profesor con sus alumnos inscritos
 *     tags: [Cursos ER]
 *     parameters:
 *       - in: header
 *         name: x-numero-personal
 *         schema:
 *           type: string
 *         description: Número de personal del profesor
 *       - in: query
 *         name: soloActual
 *         schema:
 *           type: boolean
 *         description: Si es true, solo retorna los grupos del periodo escolar vigente
 *     responses:
 *       200:
 *         description: Grupos asignados al profesor
 */
router.get('/mis-grupos', cursoController.misGrupos);

/**
 * @swagger
 * /api/cursos:
 *   post:
 *     summary: Crear un nuevo curso/NRC de Experiencia Recepcional
 *     tags: [Cursos ER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - NRC
 *             properties:
 *               NRC:
 *                 type: string
 *                 example: "12345"
 *               Nombre:
 *                 type: string
 *                 example: "Experiencia Recepcional"
 *     responses:
 *       201:
 *         description: Curso creado con éxito
 */
router.post('/', cursoController.crear);

/**
 * @swagger
 * /api/cursos:
 *   get:
 *     summary: Listar todos los cursos de Experiencia Recepcional
 *     tags: [Cursos ER]
 *     responses:
 *       200:
 *         description: Lista de cursos
 */
router.get('/', cursoController.listar);

/**
 * @swagger
 * /api/cursos/asignar-profesor:
 *   post:
 *     summary: Asignar un profesor como titular de un curso/NRC en un periodo escolar
 *     tags: [Cursos ER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Numero_Personal
 *             properties:
 *               NRC:
 *                 type: string
 *                 example: "12345"
 *               Id_Curso:
 *                 type: integer
 *                 example: 1
 *               Numero_Personal:
 *                 type: string
 *                 example: "123456"
 *               Id_Periodo:
 *                 type: integer
 *                 example: 1
 *                 description: Opcional. Si no se envía, se utiliza el periodo escolar actual.
 *     responses:
 *       201:
 *         description: Profesor asignado al curso
 */
router.post('/asignar-profesor', cursoController.asignarProfesor);

/**
 * @swagger
 * /api/cursos/inscribir-estudiante:
 *   post:
 *     summary: Inscribir a un estudiante en un curso/NRC para un periodo escolar
 *     tags: [Cursos ER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Matricula
 *             properties:
 *               NRC:
 *                 type: string
 *                 example: "12345"
 *               Id_Curso:
 *                 type: integer
 *                 example: 1
 *               Matricula:
 *                 type: string
 *                 example: "s20014589"
 *               Id_Periodo:
 *                 type: integer
 *                 example: 1
 *                 description: Opcional. Si no se envía, se utiliza el periodo escolar actual.
 *     responses:
 *       201:
 *         description: Estudiante inscrito al curso
 */
router.post('/inscribir-estudiante', cursoController.inscribirEstudiante);

/**
 * @swagger
 * /api/cursos/inscribir-lote:
 *   post:
 *     summary: Inscribir un lote de estudiantes a un curso/NRC
 *     tags: [Cursos ER]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - Matriculas
 *             properties:
 *               NRC:
 *                 type: string
 *                 example: "12345"
 *               Id_Curso:
 *                 type: integer
 *                 example: 1
 *               Matriculas:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["s20014589", "s20014590"]
 *               Id_Periodo:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Resultados de inscripción por lote
 */
router.post('/inscribir-lote', cursoController.inscribirLote);

/**
 * @swagger
 * /api/cursos/{id}:
 *   get:
 *     summary: Obtener el detalle de un curso con profesores y estudiantes asignados
 *     tags: [Cursos ER]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del curso
 */
router.get('/:id', cursoController.obtenerPorId);

/**
 * @swagger
 * /api/cursos/{id}/estudiantes:
 *   get:
 *     summary: Obtener la lista de estudiantes inscritos en un curso específico
 *     tags: [Cursos ER]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: Id_Periodo
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de estudiantes inscritos
 */
router.get('/:id/estudiantes', cursoController.obtenerEstudiantes);

module.exports = router;

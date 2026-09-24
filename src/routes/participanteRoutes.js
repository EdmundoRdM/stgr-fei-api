const express = require('express');
const router = express.Router();
const participanteController = require('../controllers/participanteController');

/**
 * @swagger
 * tags:
 *   name: Participantes
 *   description: Gestión unificada de participantes asignados a trabajos recepcionales (académicos y estudiantes)
 */

/**
 * @swagger
 * /api/participantes/trabajo/{idTrabajo}:
 *   get:
 *     summary: Obtener el resumen completo de participantes (académicos y estudiantes) de un trabajo recepcional
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: idTrabajo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Listado con arreglos de académicos y estudiantes asignados
 *       500:
 *         description: Error en la consulta
 */
router.get('/trabajo/:idTrabajo', participanteController.listarTodosPorTrabajo);

/**
 * @swagger
 * /api/participantes/academico:
 *   post:
 *     summary: Asignar un académico con rol (director, codirector, sinodal) a un trabajo recepcional
 *     tags: [Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsignarAcademicoDTO'
 *     responses:
 *       201:
 *         description: Académico asignado exitosamente
 *       400:
 *         description: Parámetros inválidos o asignación duplicada
 */
router.post('/academico', participanteController.asignarAcademico);

/**
 * @swagger
 * /api/participantes/academico/trabajo/{idTrabajo}:
 *   get:
 *     summary: Listar únicamente los académicos participantes de un trabajo recepcional
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: idTrabajo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Lista de académicos participantes
 */
router.get('/academico/trabajo/:idTrabajo', participanteController.listarAcademicosPorTrabajo);

/**
 * @swagger
 * /api/participantes/academico/{id}:
 *   delete:
 *     summary: Remover la asignación de un académico de un trabajo recepcional
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la participación (Id_Participacion)
 *     responses:
 *       200:
 *         description: Académico removido exitosamente
 *       400:
 *         description: Asignación no encontrada
 */
router.delete('/academico/:id', participanteController.eliminarAcademico);

/**
 * @swagger
 * /api/participantes/estudiante:
 *   post:
 *     summary: Asignar un estudiante a un trabajo recepcional
 *     tags: [Participantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AsignarEstudianteDTO'
 *     responses:
 *       201:
 *         description: Estudiante asignado exitosamente
 *       400:
 *         description: Parámetros inválidos o estudiante ya asignado al trabajo
 */
router.post('/estudiante', participanteController.asignarEstudiante);

/**
 * @swagger
 * /api/participantes/estudiante/trabajo/{idTrabajo}:
 *   get:
 *     summary: Listar los estudiantes asignados a un trabajo recepcional
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: idTrabajo
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Lista de estudiantes asignados
 */
router.get('/estudiante/trabajo/:idTrabajo', participanteController.listarEstudiantesPorTrabajo);

/**
 * @swagger
 * /api/participantes/estudiante/{id}:
 *   delete:
 *     summary: Remover la asignación de un estudiante de un trabajo recepcional
 *     tags: [Participantes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación del estudiante (Id_EstudianteTrabajo)
 *     responses:
 *       200:
 *         description: Estudiante desvinculado exitosamente
 *       400:
 *         description: Asignación no encontrada
 */
router.delete('/estudiante/:id', participanteController.eliminarEstudiante);

// Compatibilidad previa
router.post('/', participanteController.asignarAcademico);
router.delete('/:id', participanteController.eliminarAcademico);

module.exports = router;
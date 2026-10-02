const express = require('express');
const router = express.Router();
const participanteExternoController = require('../controllers/participanteExternoController');

/**
 * @swagger
 * tags:
 *   name: Participantes Externos
 *   description: Catálogo y gestión de directores, codirectores o sinodales externos a la Universidad Veracruzana
 */

/**
 * @swagger
 * /api/participantes-externos:
 *   post:
 *     summary: Registrar un nuevo participante externo
 *     tags: [Participantes Externos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Nombre, ApellidoP]
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: 'Roberto'
 *               ApellidoP:
 *                 type: string
 *                 example: 'Martínez'
 *               ApellidoM:
 *                 type: string
 *                 example: 'Soto'
 *               CorreoElectronico:
 *                 type: string
 *                 example: 'roberto.martinez@empresa.com'
 *               Institucion:
 *                 type: string
 *                 example: 'Instituto Nacional de Investigaciones Eléctricas'
 *     responses:
 *       201:
 *         description: Participante externo registrado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/', participanteExternoController.crear);

/**
 * @swagger
 * /api/participantes-externos:
 *   get:
 *     summary: Listar participantes externos con filtros opcionales
 *     tags: [Participantes Externos]
 *     parameters:
 *       - in: query
 *         name: Institucion
 *         schema:
 *           type: string
 *         description: Filtrar por institución de procedencia
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Búsqueda general por nombre, apellido, correo o institución
 *     responses:
 *       200:
 *         description: Lista de participantes externos
 */
router.get('/', participanteExternoController.listar);

/**
 * @swagger
 * /api/participantes-externos/{id}:
 *   get:
 *     summary: Obtener el detalle de un participante externo por ID
 *     tags: [Participantes Externos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del participante externo y trabajos vinculados
 *       404:
 *         description: No encontrado
 */
router.get('/:id', participanteExternoController.obtenerPorId);

/**
 * @swagger
 * /api/participantes-externos/{id}:
 *   put:
 *     summary: Actualizar la información de un participante externo
 *     tags: [Participantes Externos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Participante externo actualizado correctamente
 *       400:
 *         description: Error al actualizar
 */
router.put('/:id', participanteExternoController.actualizar);

/**
 * @swagger
 * /api/participantes-externos/{id}:
 *   delete:
 *     summary: Eliminar un participante externo
 *     tags: [Participantes Externos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado exitosamente
 *       400:
 *         description: No se puede eliminar si tiene trabajos vinculados
 */
router.delete('/:id', participanteExternoController.eliminar);

/**
 * @swagger
 * /api/participantes-externos/asignar:
 *   post:
 *     summary: Asignar un participante externo a un trabajo recepcional con un rol
 *     tags: [Participantes Externos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Id_TrabajoR, Id_ParticipanteExt, Id_rol]
 *             properties:
 *               Id_TrabajoR:
 *                 type: integer
 *                 example: 1
 *               Id_ParticipanteExt:
 *                 type: integer
 *                 example: 1
 *               Id_rol:
 *                 type: integer
 *                 example: 2
 *                 description: ID del rol (Director, Codirector, Sinodal, etc.)
 *     responses:
 *       201:
 *         description: Participante externo asignado correctamente
 */
router.post('/asignar', participanteExternoController.asignarATrabajo);

/**
 * @swagger
 * /api/participantes-externos/trabajo/{idTrabajo}:
 *   get:
 *     summary: Listar los participantes externos asignados a un trabajo recepcional
 *     tags: [Participantes Externos]
 *     parameters:
 *       - in: path
 *         name: idTrabajo
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de participantes externos asignados
 */
router.get('/trabajo/:idTrabajo', participanteExternoController.listarPorTrabajo);

/**
 * @swagger
 * /api/participantes-externos/asignacion/{id}:
 *   delete:
 *     summary: Desvincular a un participante externo de un trabajo recepcional
 *     tags: [Participantes Externos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la asignación (Id_ParticipanteExtTrabajo)
 *     responses:
 *       200:
 *         description: Participante externo desvinculado con éxito
 */
router.delete('/asignacion/:id', participanteExternoController.removerDeTrabajo);

module.exports = router;

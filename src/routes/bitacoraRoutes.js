const express = require('express');
const router = express.Router();
const bitacoraController = require('../controllers/bitacoraController');

/**
 * @swagger
 * tags:
 *   name: Bitácora
 *   description: Registro y consulta de auditoría de acciones realizadas en el sistema
 */

/**
 * @swagger
 * /api/bitacora:
 *   get:
 *     summary: Consultar el historial de acciones en la bitácora
 *     tags: [Bitácora]
 *     parameters:
 *       - in: query
 *         name: Numero_Personal
 *         schema:
 *           type: string
 *         description: Filtrar por número de personal del usuario/secretaria
 *       - in: query
 *         name: Id_TrabajoR
 *         schema:
 *           type: integer
 *         description: Filtrar por ID de trabajo recepcional
 *       - in: query
 *         name: Nombreaccion
 *         schema:
 *           type: string
 *         description: Filtrar por nombre de acción (búsqueda parcial)
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial de búsqueda (YYYY-MM-DD)
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final de búsqueda (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Listado de acciones registradas ordenadas cronológicamente
 *       500:
 *         description: Error al consultar la bitácora
 */
router.get('/', bitacoraController.listar);

/**
 * @swagger
 * /api/bitacora:
 *   post:
 *     summary: Registrar manualmente una acción en la bitácora
 *     tags: [Bitácora]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Nombreaccion]
 *             properties:
 *               Nombreaccion:
 *                 type: string
 *                 example: 'Revisión manual de expediente'
 *               Numero_Personal:
 *                 type: string
 *                 example: 'S001'
 *               Id_TrabajoR:
 *                 type: integer
 *                 example: 1
 *               Detalles:
 *                 type: string
 *                 example: 'Se cotejó la documentación impresa con la secretaría'
 *     responses:
 *       201:
 *         description: Acción registrada con éxito
 *       400:
 *         description: Datos inválidos
 */
router.post('/', bitacoraController.registrar);

module.exports = router;

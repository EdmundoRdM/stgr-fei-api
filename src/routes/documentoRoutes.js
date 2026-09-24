const express = require('express');
const router = express.Router();
const documentoController = require('../controllers/documentoController');

/**
 * @swagger
 * tags:
 *   name: Documentos
 *   description: Catálogo institucional de documentos y control de entrega por estudiante y trabajo recepcional
 */

/**
 * @swagger
 * /api/documentos:
 *   get:
 *     summary: Obtener el catálogo oficial de documentos requeridos para titulación
 *     tags: [Documentos]
 *     responses:
 *       200:
 *         description: Lista de los 8 documentos oficiales de titulación
 */
router.get('/', documentoController.obtenerCatalogo);

/**
 * @swagger
 * /api/documentos/trabajo/{id}:
 *   get:
 *     summary: Obtener el checklist de entrega de documentos de un trabajo recepcional
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Checklist completo con detalle de documentos por cada estudiante del trabajo
 *       404:
 *         description: Trabajo recepcional no encontrado
 */
router.get('/trabajo/:id', documentoController.obtenerChecklist);

/**
 * @swagger
 * /api/documentos/entrega:
 *   post:
 *     summary: Registrar o actualizar la entrega de un documento
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Id_TrabajoR, Matricula, Id_Documento]
 *             properties:
 *               Id_TrabajoR:
 *                 type: integer
 *                 example: 1
 *               Matricula:
 *                 type: string
 *                 example: 's20014589'
 *               Id_Documento:
 *                 type: integer
 *                 example: 1
 *               Entregado:
 *                 type: boolean
 *                 example: true
 *               Numero_Personal:
 *                 type: string
 *                 example: 'S001'
 *     responses:
 *       200:
 *         description: Entrega registrada y auditada en bitácora
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/entrega', documentoController.registrarEntrega);

/**
 * @swagger
 * /api/documentos/entrega:
 *   delete:
 *     summary: Revocar o eliminar el registro de entrega de un documento
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Id_TrabajoR, Matricula, Id_Documento]
 *             properties:
 *               Id_TrabajoR:
 *                 type: integer
 *                 example: 1
 *               Matricula:
 *                 type: string
 *                 example: 's20014589'
 *               Id_Documento:
 *                 type: integer
 *                 example: 1
 *               Numero_Personal:
 *                 type: string
 *                 example: 'S001'
 *     responses:
 *       200:
 *         description: Entrega revocada y auditada en bitácora
 *       400:
 *         description: Error al revocar entrega
 */
router.delete('/entrega', documentoController.eliminarEntrega);

/**
 * @swagger
 * /api/documentos/lote:
 *   post:
 *     summary: Registrar entregas de documentos en lote
 *     tags: [Documentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Id_TrabajoR, entregas]
 *             properties:
 *               Id_TrabajoR:
 *                 type: integer
 *                 example: 1
 *               Numero_Personal:
 *                 type: string
 *                 example: 'S001'
 *               entregas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [Matricula, Id_Documento]
 *                   properties:
 *                     Matricula:
 *                       type: string
 *                       example: 's20014589'
 *                     Id_Documento:
 *                       type: integer
 *                       example: 2
 *                     Entregado:
 *                       type: boolean
 *                       example: true
 *     responses:
 *       200:
 *         description: Entregas procesadas exitosamente
 *       400:
 *         description: Error al procesar lote
 */
router.post('/lote', documentoController.registrarLote);

module.exports = router;

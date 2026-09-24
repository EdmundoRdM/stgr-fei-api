const express = require('express');
const router = express.Router();
const estudianteController = require('../controllers/estudianteController');

/**
 * @swagger
 * tags:
 *   name: Estudiantes
 *   description: Catálogo y gestión de estudiantes de las licenciaturas de la FEI
 */

/**
 * @swagger
 * /api/estudiantes:
 *   post:
 *     summary: Registrar un nuevo estudiante
 *     tags: [Estudiantes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Matricula, NombreCompleto, CorreoInstitucional, Id_Carrera]
 *             properties:
 *               Matricula:
 *                 type: string
 *                 example: 's20014589'
 *               NombreCompleto:
 *                 type: string
 *                 example: 'Carlos Morales Delgado'
 *               CorreoInstitucional:
 *                 type: string
 *                 example: 'zs20014589@estudiantes.uv.mx'
 *               CorreoAlterno:
 *                 type: string
 *                 example: 'carlos.md@gmail.com'
 *               Id_Carrera:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Estudiante registrado exitosamente
 *       400:
 *         description: Matrícula duplicada o datos inválidos
 */
router.post('/', estudianteController.crear);

/**
 * @swagger
 * /api/estudiantes:
 *   get:
 *     summary: Listar todos los estudiantes registrados
 *     tags: [Estudiantes]
 *     responses:
 *       200:
 *         description: Lista de estudiantes obtenida exitosamente
 */
router.get('/', estudianteController.listar);

module.exports = router;
const express = require('express');
const router = express.Router();
const academicoController = require('../controllers/academicoController');

/**
 * @swagger
 * tags:
 *   name: Académicos
 *   description: Catálogo y gestión de profesores y personal académico de la FEI
 */

/**
 * @swagger
 * /api/academicos:
 *   post:
 *     summary: Registrar un nuevo académico
 *     tags: [Académicos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Numero_Personal, Nombre, ApellidoP, ApellidoM, CorreoInstitucional, Password, Id_Carrera]
 *             properties:
 *               Numero_Personal:
 *                 type: integer
 *                 example: 24589
 *               Nombre:
 *                 type: string
 *                 example: 'María'
 *               ApellidoP:
 *                 type: string
 *                 example: 'González'
 *               ApellidoM:
 *                 type: string
 *                 example: 'Pérez'
 *               CorreoInstitucional:
 *                 type: string
 *                 example: 'mgonzalez@uv.mx'
 *               Password:
 *                 type: string
 *                 example: 'temporal123'
 *               Id_Carrera:
 *                 type: integer
 *                 example: 1
 *               Id_Rol:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Académico registrado exitosamente
 *       400:
 *         description: Error en los datos proporcionados
 */
router.post('/', academicoController.crear);

/**
 * @swagger
 * /api/academicos:
 *   get:
 *     summary: Listar todos los académicos registrados
 *     tags: [Académicos]
 *     responses:
 *       200:
 *         description: Lista de académicos obtenida exitosamente
 */
router.get('/', academicoController.listar);

module.exports = router;
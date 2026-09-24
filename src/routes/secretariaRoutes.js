const express = require('express');
const router = express.Router();
const secretariaController = require('../controllers/secretariaController');

/**
 * @swagger
 * tags:
 *   name: Secretarias
 *   description: Gestión y CRUD de Secretarias de Grupo (Personal Administrativo)
 */

/**
 * @swagger
 * /api/secretarias:
 *   post:
 *     summary: Registrar una nueva secretaria de grupo
 *     tags: [Secretarias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Numero_Personal, Nombre, ApellidoP, ApellidoM, CorreoInstitucional]
 *             properties:
 *               Numero_Personal:
 *                 type: string
 *                 example: 'S001'
 *               Nombre:
 *                 type: string
 *                 example: 'Carmen'
 *               ApellidoP:
 *                 type: string
 *                 example: 'López'
 *               ApellidoM:
 *                 type: string
 *                 example: 'Hernández'
 *               CorreoInstitucional:
 *                 type: string
 *                 example: 'carlopez@uv.mx'
 *               Contrasenia:
 *                 type: string
 *                 example: 'secre2026'
 *               Rol:
 *                 type: string
 *                 example: 'Secretaria de Grupo'
 *     responses:
 *       201:
 *         description: Secretaria registrada exitosamente
 *       400:
 *         description: Datos inválidos o número de personal/correo duplicado
 */
router.post('/', secretariaController.crear);

/**
 * @swagger
 * /api/secretarias:
 *   get:
 *     summary: Listar todas las secretarias registradas
 *     tags: [Secretarias]
 *     parameters:
 *       - in: query
 *         name: Rol
 *         schema:
 *           type: string
 *         description: Filtrar por rol
 *     responses:
 *       200:
 *         description: Lista de secretarias obtenida exitosamente
 */
router.get('/', secretariaController.listar);

/**
 * @swagger
 * /api/secretarias/{id}:
 *   get:
 *     summary: Obtener el detalle de una secretaria por su número de personal o ID
 *     tags: [Secretarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de personal o Id_Secretaria
 *     responses:
 *       200:
 *         description: Registro de la secretaria encontrado
 *       404:
 *         description: Secretaria no encontrada
 */
router.get('/:id', secretariaController.obtenerPorId);

/**
 * @swagger
 * /api/secretarias/{id}:
 *   put:
 *     summary: Actualizar información de una secretaria
 *     tags: [Secretarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de personal o Id_Secretaria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Nombre:
 *                 type: string
 *                 example: 'Carmen María'
 *               ApellidoP:
 *                 type: string
 *                 example: 'López'
 *               ApellidoM:
 *                 type: string
 *                 example: 'Hernández'
 *               CorreoInstitucional:
 *                 type: string
 *                 example: 'carlopez@uv.mx'
 *               Contrasenia:
 *                 type: string
 *                 example: 'nuevaClave2026'
 *     responses:
 *       200:
 *         description: Secretaria actualizada con éxito
 *       400:
 *         description: Error en los datos proporcionados
 */
router.put('/:id', secretariaController.actualizar);

/**
 * @swagger
 * /api/secretarias/{id}:
 *   delete:
 *     summary: Eliminar una secretaria de grupo
 *     tags: [Secretarias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de personal o Id_Secretaria
 *     responses:
 *       200:
 *         description: Secretaria eliminada exitosamente
 *       400:
 *         description: Error al eliminar
 */
router.delete('/:id', secretariaController.eliminar);

module.exports = router;

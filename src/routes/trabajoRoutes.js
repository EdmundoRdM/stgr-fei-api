const express = require('express');
const router = express.Router();
const trabajoController = require('../controllers/trabajoController');

/**
 * @swagger
 * tags:
 *   name: Trabajos Recepcionales
 *   description: Gestión del ciclo de vida de los trabajos recepcionales (Casos de uso CU-01 al CU-05)
 */

/**
 * @swagger
 * /api/trabajos:
 *   post:
 *     summary: Crear un nuevo trabajo recepcional en estado Borrador (CU-01)
 *     tags: [Trabajos Recepcionales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearTrabajoDTO'
 *     responses:
 *       201:
 *         description: Trabajo recepcional creado exitosamente como borrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TrabajoRecepcional'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorRespuesta'
 */
router.post('/', trabajoController.crear);

/**
 * @swagger
 * /api/trabajos:
 *   get:
 *     summary: Listar trabajos recepcionales con filtros opcionales
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: query
 *         name: Id_Carrera
 *         schema:
 *           type: integer
 *         description: Filtrar por identificador de la carrera
 *       - in: query
 *         name: Id_Estado
 *         schema:
 *           type: integer
 *         description: Filtrar por identificador del estado (1:Borrador, 2:Registrado, 3:Aprobado, 4:Generado, 5:Finalizado)
 *       - in: query
 *         name: Modalidad
 *         schema:
 *           type: string
 *         description: Filtrar por modalidad (Tesis, Tesina, Monografía, etc.)
 *     responses:
 *       200:
 *         description: Lista de trabajos recepcionales obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TrabajoRecepcional'
 *       500:
 *         description: Error al consultar los registros
 */
router.get('/', trabajoController.listar);

/**
 * @swagger
 * /api/trabajos/{id}:
 *   get:
 *     summary: Obtener el detalle completo de un trabajo recepcional por su ID
 *     description: Incluye carrera, lugar, estado, estudiantes vinculados y académicos con sus roles de participación.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Registro encontrado con detalle completo
 *       404:
 *         description: Trabajo recepcional no encontrado
 */
router.get('/:id', trabajoController.obtenerPorId);

/**
 * @swagger
 * /api/trabajos/{id}:
 *   put:
 *     summary: Editar información de un trabajo recepcional (CU-05)
 *     description: En estados Aprobado o Generado los campos Folio y Resultado están bloqueados. En estado Finalizado todos los campos son editables.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActualizarTrabajoDTO'
 *     responses:
 *       200:
 *         description: Trabajo recepcional actualizado con éxito
 *       400:
 *         description: Error de validación o campo bloqueado según el estado
 */
router.put('/:id', trabajoController.actualizar);

/**
 * @swagger
 * /api/trabajos/{id}/enviar:
 *   post:
 *     summary: Enviar trabajo recepcional a validación de Secretaría (CU-02)
 *     description: Cambia el estado del trabajo de Borrador a Registrado.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Trabajo recepcional enviado a validación con éxito
 *       400:
 *         description: El trabajo no se encuentra en estado Borrador
 */
router.post('/:id/enviar', trabajoController.enviarAValidacion);

/**
 * @swagger
 * /api/trabajos/{id}/validar:
 *   post:
 *     summary: Aprobar trabajo recepcional (CU-03)
 *     description: Cambia el estado del trabajo de Registrado a Aprobado por la Secretaría de Facultad.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Trabajo recepcional aprobado con éxito
 *       400:
 *         description: El trabajo no se encuentra en estado Registrado
 */
router.post('/:id/validar', trabajoController.validar);

/**
 * @swagger
 * /api/trabajos/{id}/rechazar:
 *   post:
 *     summary: Rechazar trabajo recepcional y devolver a borrador (CU-04)
 *     description: Regresa el estado del trabajo a Borrador para correcciones del profesor responsable.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RechazarTrabajoDTO'
 *     responses:
 *       200:
 *         description: Trabajo recepcional devuelto a borrador
 *       400:
 *         description: El trabajo no se encuentra en estado Registrado
 */
router.post('/:id/rechazar', trabajoController.rechazar);

/**
 * @swagger
 * /api/trabajos/{id}/finalizar:
 *   post:
 *     summary: Finalizar trabajo recepcional con asignación de Folio y Resultado formal
 *     description: Registra el Folio oficial y el Resultado de la defensa, cambiando el estado a Finalizado.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FinalizarTrabajoDTO'
 *     responses:
 *       200:
 *         description: Trabajo recepcional finalizado con éxito
 *       400:
 *         description: Folio o Resultado inválidos
 */
router.post('/:id/finalizar', trabajoController.finalizar);

/**
 * @swagger
 * /api/trabajos/{id}/estado:
 *   patch:
 *     summary: Cambio manual de estado (mantenimiento administrativo)
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nuevoEstado]
 *             properties:
 *               nuevoEstado:
 *                 type: string
 *                 example: 'Aprobado'
 *     responses:
 *       200:
 *         description: Estado actualizado con éxito
 *       400:
 *         description: Estado no válido
 */
router.patch('/:id/estado', trabajoController.cambiarEstado);

/**
 * @swagger
 * /api/trabajos/{id}:
 *   delete:
 *     summary: Eliminar registro de trabajo recepcional
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     responses:
 *       200:
 *         description: Registro eliminado correctamente
 *       400:
 *         description: Error al eliminar el registro
 */
/**
 * @swagger
 * /api/trabajos/{id}/generar-acta:
 *   post:
 *     summary: Generar acta de trabajo recepcional tras verificar el checklist completo (CU-06)
 *     description: Cambia el estado del trabajo de Aprobado a Generado, habilitando la posterior finalización del trámite.
 *     tags: [Trabajos Recepcionales]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del trabajo recepcional
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Numero_Personal:
 *                 type: string
 *                 example: 'S001'
 *     responses:
 *       200:
 *         description: Acta generada exitosamente, estado cambiado a Generado
 *       400:
 *         description: El trabajo no está en estado Aprobado o faltan documentos en el checklist
 */
router.post('/:id/generar-acta', trabajoController.generarActa);

const documentoController = require('../controllers/documentoController');

/**
 * @swagger
 * /api/trabajos/{id}/documentos:
 *   get:
 *     summary: Obtener el checklist de documentos requeridos y entregados para este trabajo
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
 *         description: Checklist de documentos por estudiante
 */
router.get('/:id/documentos', documentoController.obtenerChecklist);

/**
 * @swagger
 * /api/trabajos/{id}/documentos:
 *   post:
 *     summary: Registrar entrega de un documento para este trabajo recepcional
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Matricula, Id_Documento]
 *             properties:
 *               Matricula:
 *                 type: string
 *               Id_Documento:
 *                 type: integer
 *               Entregado:
 *                 type: boolean
 *               Numero_Personal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrega registrada exitosamente
 */
router.post('/:id/documentos', documentoController.registrarEntrega);

/**
 * @swagger
 * /api/trabajos/{id}/documentos:
 *   delete:
 *     summary: Revocar la entrega de un documento para este trabajo recepcional
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [Matricula, Id_Documento]
 *             properties:
 *               Matricula:
 *                 type: string
 *               Id_Documento:
 *                 type: integer
 *               Numero_Personal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrega revocada exitosamente
 */
router.delete('/:id/documentos', documentoController.eliminarEntrega);

/**
 * @swagger
 * /api/trabajos/{id}/documentos/lote:
 *   post:
 *     summary: Registrar entregas de documentos en lote para este trabajo recepcional
 *     tags: [Documentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [entregas]
 *             properties:
 *               Numero_Personal:
 *                 type: string
 *               entregas:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [Matricula, Id_Documento]
 *                   properties:
 *                     Matricula:
 *                       type: string
 *                     Id_Documento:
 *                       type: integer
 *                     Entregado:
 *                       type: boolean
 *     responses:
 *       200:
 *         description: Entregas procesadas exitosamente
 */
router.post('/:id/documentos/lote', documentoController.registrarLote);

router.delete('/:id', trabajoController.eliminar);

module.exports = router;
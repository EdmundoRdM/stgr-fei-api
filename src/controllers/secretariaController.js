const secretariaService = require('../services/secretariaService');

const crear = async (req, res) => {
    try {
        const nuevaSecretaria = await secretariaService.crearSecretaria(req.body);
        res.status(201).json({
            mensaje: 'Secretaria registrada con éxito',
            secretaria: nuevaSecretaria
        });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar la secretaria', detalle: error.message });
    }
};

const listar = async (req, res) => {
    try {
        const filtros = {
            Rol: req.query.Rol
        };
        const secretarias = await secretariaService.obtenerSecretarias(filtros);
        res.status(200).json(secretarias);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar secretarias', detalle: error.message });
    }
};

const obtenerPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const secretaria = await secretariaService.obtenerSecretariaPorId(id);
        res.status(200).json(secretaria);
    } catch (error) {
        res.status(404).json({ error: 'Secretaria no encontrada', detalle: error.message });
    }
};

const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const secretariaActualizada = await secretariaService.actualizarSecretaria(id, req.body);
        res.status(200).json({
            mensaje: 'Secretaria actualizada con éxito',
            secretaria: secretariaActualizada
        });
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar la secretaria', detalle: error.message });
    }
};

const eliminar = async (req, res) => {
    try {
        const { id } = req.params;
        const resultado = await secretariaService.eliminarSecretaria(id);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar la secretaria', detalle: error.message });
    }
};

module.exports = {
    crear,
    listar,
    obtenerPorId,
    actualizar,
    eliminar
};

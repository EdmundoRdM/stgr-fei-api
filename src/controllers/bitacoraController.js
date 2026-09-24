const bitacoraService = require('../services/bitacoraService');

const listar = async (req, res) => {
    try {
        const filtros = {
            Numero_Personal: req.query.Numero_Personal,
            Id_TrabajoR: req.query.Id_TrabajoR,
            Nombreaccion: req.query.Nombreaccion,
            fechaInicio: req.query.fechaInicio,
            fechaFin: req.query.fechaFin
        };
        const registros = await bitacoraService.obtenerBitacora(filtros);
        res.status(200).json(registros);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la bitácora de acciones', detalle: error.message });
    }
};

const registrar = async (req, res) => {
    try {
        const { Nombreaccion, Numero_Personal, Id_TrabajoR, Detalles } = req.body;
        if (!Nombreaccion) {
            return res.status(400).json({ error: 'El campo Nombreaccion es obligatorio' });
        }
        const nuevoRegistro = await bitacoraService.registrarAccion({
            Nombreaccion,
            Numero_Personal,
            Id_TrabajoR,
            Detalles
        });
        res.status(201).json({ mensaje: 'Acción registrada en bitácora con éxito', registro: nuevoRegistro });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar acción en bitácora', detalle: error.message });
    }
};

module.exports = {
    listar,
    registrar
};

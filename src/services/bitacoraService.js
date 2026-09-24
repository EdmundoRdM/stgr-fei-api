const BitacoraAcciones = require('../models/BitacoraAcciones');
const SecretariaGrupo = require('../models/SecretariaGrupo');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const { Op } = require('sequelize');

const registrarAccion = async ({ Nombreaccion, Numero_Personal, Id_TrabajoR, Detalles }) => {
    try {
        const registro = await BitacoraAcciones.create({
            Nombreaccion,
            Numero_Personal: Numero_Personal || null,
            Id_TrabajoR: Id_TrabajoR || null,
            Detalles: Detalles || null,
            Fecha: new Date()
        });
        return registro;
    } catch (error) {
        console.error('Error al registrar en bitácora:', error.message);
        // No bloqueamos el flujo principal si falla la bitácora, pero retornamos null o logueamos
        return null;
    }
};

const obtenerBitacora = async (filtros = {}) => {
    const condiciones = {};

    if (filtros.Numero_Personal) {
        condiciones.Numero_Personal = filtros.Numero_Personal;
    }
    if (filtros.Id_TrabajoR) {
        condiciones.Id_TrabajoR = filtros.Id_TrabajoR;
    }
    if (filtros.Nombreaccion) {
        condiciones.Nombreaccion = { [Op.like]: `%${filtros.Nombreaccion}%` };
    }
    if (filtros.fechaInicio && filtros.fechaFin) {
        condiciones.Fecha = {
            [Op.between]: [new Date(filtros.fechaInicio), new Date(filtros.fechaFin)]
        };
    } else if (filtros.fechaInicio) {
        condiciones.Fecha = { [Op.gte]: new Date(filtros.fechaInicio) };
    } else if (filtros.fechaFin) {
        condiciones.Fecha = { [Op.lte]: new Date(filtros.fechaFin) };
    }

    return await BitacoraAcciones.findAll({
        where: condiciones,
        include: [
            {
                model: SecretariaGrupo,
                attributes: ['Numero_Personal', 'Nombre', 'ApellidoP', 'ApellidoM', 'CorreoInstitucional', 'Rol']
            },
            {
                model: TrabajoRecepcional,
                attributes: ['Id_TrabajoR', 'Titulo', 'Folio', 'Modalidad']
            }
        ],
        order: [['Fecha', 'DESC'], ['IdAccion', 'DESC']]
    });
};

module.exports = {
    registrarAccion,
    obtenerBitacora
};

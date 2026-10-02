const EstadoTrabajoRecepcional = require('../models/EstadoTrabajoRecepcional');
const EstadoLista = require('../models/EstadoLista');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');

/**
 * Registra un nuevo estado en la trazabilidad temporal del trabajo recepcional.
 */
const registrarCambioEstado = async (Id_TrabajoR, Id_Estado, Fecha = null) => {
    if (!Id_TrabajoR || !Id_Estado) {
        throw new Error('Se requieren Id_TrabajoR e Id_Estado para registrar el cambio de estado');
    }

    return await EstadoTrabajoRecepcional.create({
        Id_TrabajoR,
        Id_Estado,
        Fecha: Fecha || new Date()
    });
};

/**
 * Obtiene la cronología completa de estados por los que ha pasado un trabajo recepcional.
 */
const obtenerHistorialPorTrabajo = async (Id_TrabajoR) => {
    const trabajo = await TrabajoRecepcional.findByPk(Id_TrabajoR);
    if (!trabajo) {
        throw new Error('Trabajo recepcional no encontrado');
    }

    return await EstadoTrabajoRecepcional.findAll({
        where: { Id_TrabajoR },
        include: [
            {
                model: EstadoLista,
                attributes: ['Id_Estado', 'EstadoNombre']
            }
        ],
        order: [['Fecha', 'ASC'], ['Id_EstadoTrabajo', 'ASC']]
    });
};

module.exports = {
    registrarCambioEstado,
    obtenerHistorialPorTrabajo
};

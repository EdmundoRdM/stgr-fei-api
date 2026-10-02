const { Op } = require('sequelize');
const PeriodosEscolares = require('../models/Periodos_Escolares');

const obtenerPeriodoActual = async () => {
    const hoy = new Date().toISOString().split('T')[0];
    
    // Buscar periodo que contenga la fecha de hoy
    let periodoActual = await PeriodosEscolares.findOne({
        where: {
            Fecha_inicio: { [Op.lte]: hoy },
            Fecha_fin: { [Op.gte]: hoy }
        }
    });

    // Si la fecha actual no cae en un rango exacto (por desfase o vacaciones),
    // tomamos el periodo más reciente registrado
    if (!periodoActual) {
        periodoActual = await PeriodosEscolares.findOne({
            order: [['Fecha_fin', 'DESC']]
        });
    }

    return periodoActual;
};

const listarPeriodos = async () => {
    return await PeriodosEscolares.findAll({
        order: [['Fecha_inicio', 'DESC']]
    });
};

const obtenerPeriodoPorId = async (idPeriodo) => {
    const periodo = await PeriodosEscolares.findByPk(idPeriodo);
    if (!periodo) throw new Error('Periodo escolar no encontrado');
    return periodo;
};

module.exports = {
    obtenerPeriodoActual,
    listarPeriodos,
    obtenerPeriodoPorId
};

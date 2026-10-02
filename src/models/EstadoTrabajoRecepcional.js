const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TrabajoRecepcional = require('./TrabajoRecepcional');
const EstadoLista = require('./EstadoLista');

const EstadoTrabajoRecepcional = sequelize.define('EstadoTrabajoRecepcional', {
    Id_EstadoTrabajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    Id_Estado: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_TrabajoR: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Estado_TrabajoRecepcional',
    timestamps: false
});

// Relaciones
TrabajoRecepcional.hasMany(EstadoTrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });
EstadoTrabajoRecepcional.belongsTo(TrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });

EstadoLista.hasMany(EstadoTrabajoRecepcional, { foreignKey: 'Id_Estado' });
EstadoTrabajoRecepcional.belongsTo(EstadoLista, { foreignKey: 'Id_Estado' });

module.exports = EstadoTrabajoRecepcional;

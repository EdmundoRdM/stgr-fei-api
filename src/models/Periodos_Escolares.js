const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PeriodosEscolares = sequelize.define('PeriodosEscolares', {
    Id_Periodo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Fecha_inicio: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Fecha_fin: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    Nomenclatura: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Periodos_Escolares',
    timestamps: false
});

module.exports = PeriodosEscolares;
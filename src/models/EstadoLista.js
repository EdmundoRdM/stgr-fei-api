const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EstadoLista = sequelize.define('EstadoLista', {
    Id_Estado: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    EstadoNombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'EstadoLista',
    timestamps: false
});

module.exports = EstadoLista;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lugar = sequelize.define('Lugar', {
    Id_Lugar: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Edificio: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Estado: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'disponible'
    }
}, {
    tableName: 'Lugar',
    timestamps: false
});

module.exports = Lugar;
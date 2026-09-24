const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Carrera = sequelize.define('Carrera', {
    Id_Carrera: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NombreCarrera: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Carrera',
    timestamps: false
});

module.exports = Carrera;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Carrera = require('./Carrera');

const Estudiante = sequelize.define('Estudiante', {
    Matricula: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    NombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CorreoInstitucional: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    CorreoAlterno: {
        type: DataTypes.STRING,
        allowNull: true
    }

}, {
    tableName: 'Estudiante',
    timestamps: false
});

Carrera.hasMany(Estudiante, { foreignKey: 'Id_Carrera' });
Estudiante.belongsTo(Carrera, { foreignKey: 'Id_Carrera' });

module.exports = Estudiante;
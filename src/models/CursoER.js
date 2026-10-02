const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CursoER = sequelize.define('CursoER', {
    Id_Curso: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NRC: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Experiencia Recepcional'
    }
}, {
    tableName: 'CursoER',
    timestamps: false
});

module.exports = CursoER;

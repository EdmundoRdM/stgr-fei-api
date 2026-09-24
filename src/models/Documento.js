const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Documento = sequelize.define('Documento', {
    Id_Documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NombreDocumento: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Documento',
    timestamps: false
});

module.exports = Documento;
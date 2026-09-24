const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolDirectivo = sequelize.define('RolDirectivo', {
    Id_Rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombre_Rol: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Rol_Directivo',
    timestamps: false
});

module.exports = RolDirectivo;
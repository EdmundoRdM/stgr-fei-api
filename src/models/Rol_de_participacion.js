const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolDeParticipacion = sequelize.define('RolDeParticipacion', {
    Id_rol: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    NombreRol: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Rol_de_participacion',
    timestamps: false
});

module.exports = RolDeParticipacion;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SecretariaGrupo = sequelize.define('SecretariaGrupo', {
    Numero_Personal: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    Id_Secretaria: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        unique: true
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ApellidoP: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ApellidoM: {
        type: DataTypes.STRING,
        allowNull: false
    },
    CorreoInstitucional: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    Contrasenia: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Rol: {
        type: DataTypes.STRING,
        defaultValue: 'Secretaria de Grupo'
    }
}, {
    tableName: 'SecretariaGrupo',
    timestamps: false
});

module.exports = SecretariaGrupo;

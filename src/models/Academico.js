const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RolDirectivo = require('./RolDirectivo');

const Academico = sequelize.define('Academico', {
    Numero_Personal: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
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
        allowNull: false
    }
}, {
    tableName: 'Academico',
    timestamps: false
});

RolDirectivo.hasMany(Academico, { foreignKey: 'Id_Rol' });
Academico.belongsTo(RolDirectivo, { foreignKey: 'Id_Rol' });

module.exports = Academico;
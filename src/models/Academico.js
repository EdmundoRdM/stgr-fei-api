const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const RolDirectivo = require('./RolDirectivo');
const Carrera = require('./Carrera');

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
    },
    Id_Carrera: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'Academico',
    timestamps: false
});

RolDirectivo.hasMany(Academico, { foreignKey: 'Id_Rol' });
Academico.belongsTo(RolDirectivo, { foreignKey: 'Id_Rol' });

Carrera.hasMany(Academico, { foreignKey: 'Id_Carrera' });
Academico.belongsTo(Carrera, { foreignKey: 'Id_Carrera' });

module.exports = Academico;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ParticipanteExterno = sequelize.define('ParticipanteExterno', {
    Id_ParticipanteExt: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
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
        allowNull: true
    },
    CorreoElectronico: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: {
                msg: 'Debe ser un correo electrónico válido'
            }
        }
    },
    Institucion: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'Participante_Externo',
    timestamps: false
});

module.exports = ParticipanteExterno;

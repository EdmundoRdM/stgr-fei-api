const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TrabajoRecepcional = require('./TrabajoRecepcional');
const Estudiante = require('./Estudiante');
const Documento = require('./Documento');

const EstudianteDocumento = sequelize.define('EstudianteDocumento', {
    Id_Estudiante_Documento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_TrabajoR: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Matricula: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Id_Documento: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Entregado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    FechaEntrega: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'Estudiante_Documento',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['Id_TrabajoR', 'Matricula', 'Id_Documento'],
            name: 'estudiante_documento_trabajo_unico'
        }
    ]
});

TrabajoRecepcional.hasMany(EstudianteDocumento, { foreignKey: 'Id_TrabajoR' });
EstudianteDocumento.belongsTo(TrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });

Estudiante.hasMany(EstudianteDocumento, { foreignKey: 'Matricula' });
EstudianteDocumento.belongsTo(Estudiante, { foreignKey: 'Matricula' });

Documento.hasMany(EstudianteDocumento, { foreignKey: 'Id_Documento' });
EstudianteDocumento.belongsTo(Documento, { foreignKey: 'Id_Documento' });

module.exports = EstudianteDocumento;

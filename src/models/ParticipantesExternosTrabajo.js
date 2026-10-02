const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TrabajoRecepcional = require('./TrabajoRecepcional');
const ParticipanteExterno = require('./ParticipanteExterno');
const RolDeParticipacion = require('./Rol_de_participacion');

const ParticipantesExternosTrabajo = sequelize.define('ParticipantesExternosTrabajo', {
    Id_ParticipanteExtTrabajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_ParticipanteExt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_TrabajoR: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Id_rol: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Participantes_Externos_TrabajoRecepcional',
    timestamps: false
});

// Relación muchos a muchos entre TrabajoRecepcional y ParticipanteExterno
TrabajoRecepcional.belongsToMany(ParticipanteExterno, {
    through: ParticipantesExternosTrabajo,
    foreignKey: 'Id_TrabajoR',
    uniqueKey: 'participante_externo_trabajo_unico'
});

ParticipanteExterno.belongsToMany(TrabajoRecepcional, {
    through: ParticipantesExternosTrabajo,
    foreignKey: 'Id_ParticipanteExt',
    uniqueKey: 'participante_externo_trabajo_unico'
});

// Asociaciones directas para consultas (Eager loading)
ParticipantesExternosTrabajo.belongsTo(TrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });
ParticipantesExternosTrabajo.belongsTo(ParticipanteExterno, { foreignKey: 'Id_ParticipanteExt' });
ParticipantesExternosTrabajo.belongsTo(RolDeParticipacion, { foreignKey: 'Id_rol' });

RolDeParticipacion.hasMany(ParticipantesExternosTrabajo, { foreignKey: 'Id_rol' });
ParticipanteExterno.hasMany(ParticipantesExternosTrabajo, { foreignKey: 'Id_ParticipanteExt' });
TrabajoRecepcional.hasMany(ParticipantesExternosTrabajo, { foreignKey: 'Id_TrabajoR' });

module.exports = ParticipantesExternosTrabajo;

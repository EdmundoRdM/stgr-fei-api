const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TrabajoRecepcional = require('./TrabajoRecepcional');
const Academico = require('./Academico');
const RolDeParticipacion = require('./Rol_de_participacion');

const ParticipantesTrabajo = sequelize.define('ParticipantesTrabajo', {
    Id_Participacion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
}, {
    tableName: 'Participantes_TrabajoRecepcional',
    timestamps: false
});

TrabajoRecepcional.belongsToMany(Academico, { 
    through: ParticipantesTrabajo, 
    foreignKey: 'Id_TrabajoR',
    uniqueKey: 'academico_trabajo_recepcional_unico'
});
Academico.belongsToMany(TrabajoRecepcional, { 
    through: ParticipantesTrabajo, 
    foreignKey: 'Numero_Personal',
    uniqueKey: 'academico_trabajo_recepcional_unico'
});

ParticipantesTrabajo.belongsTo(TrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });
ParticipantesTrabajo.belongsTo(Academico, { foreignKey: 'Numero_Personal' });
ParticipantesTrabajo.belongsTo(RolDeParticipacion, { foreignKey: 'Id_rol' });

RolDeParticipacion.hasMany(ParticipantesTrabajo, { foreignKey: 'Id_rol' });
Academico.hasMany(ParticipantesTrabajo, { foreignKey: 'Numero_Personal' });
TrabajoRecepcional.hasMany(ParticipantesTrabajo, { foreignKey: 'Id_TrabajoR' });

module.exports = ParticipantesTrabajo;
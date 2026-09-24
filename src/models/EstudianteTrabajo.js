const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const TrabajoRecepcional = require('./TrabajoRecepcional');
const Estudiante = require('./Estudiante');

const EstudianteTrabajo = sequelize.define('EstudianteTrabajo', {
    Id_EstudianteTrabajo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
}, {
    tableName: 'Estudiante_TrabajoRecepcional',
    timestamps: false
});

TrabajoRecepcional.belongsToMany(Estudiante, { 
    through: EstudianteTrabajo, 
    foreignKey: 'Id_TrabajoR',
    uniqueKey: 'estudiante_trabajo_recepcional_unico'
});
Estudiante.belongsToMany(TrabajoRecepcional, { 
    through: EstudianteTrabajo, 
    foreignKey: 'Matricula',
    uniqueKey: 'estudiante_trabajo_recepcional_unico'
});

// Asociaciones directas para las consultas (Eager Loading)
EstudianteTrabajo.belongsTo(TrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });
EstudianteTrabajo.belongsTo(Estudiante, { foreignKey: 'Matricula' });

TrabajoRecepcional.hasMany(EstudianteTrabajo, { foreignKey: 'Id_TrabajoR' });
Estudiante.hasMany(EstudianteTrabajo, { foreignKey: 'Matricula' });

module.exports = EstudianteTrabajo;
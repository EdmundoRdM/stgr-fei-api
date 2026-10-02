const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CursoER = require('./CursoER');
const Estudiante = require('./Estudiante');
const PeriodosEscolares = require('./Periodos_Escolares');

const CursoEREstudiante = sequelize.define('CursoEREstudiante', {
    Id_CursoEstudiante: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Curso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Matricula: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Id_Periodo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'CursoER_Estudiante',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['Id_Curso', 'Matricula', 'Id_Periodo'],
            name: 'curso_estudiante_periodo_unico'
        }
    ]
});

// Relaciones con CursoER
CursoER.hasMany(CursoEREstudiante, { foreignKey: 'Id_Curso' });
CursoEREstudiante.belongsTo(CursoER, { foreignKey: 'Id_Curso' });

// Relaciones con Estudiante
Estudiante.hasMany(CursoEREstudiante, { foreignKey: 'Matricula' });
CursoEREstudiante.belongsTo(Estudiante, { foreignKey: 'Matricula' });

// Relaciones con PeriodosEscolares
PeriodosEscolares.hasMany(CursoEREstudiante, { foreignKey: 'Id_Periodo' });
CursoEREstudiante.belongsTo(PeriodosEscolares, { foreignKey: 'Id_Periodo' });

module.exports = CursoEREstudiante;

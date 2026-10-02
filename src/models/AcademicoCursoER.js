const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CursoER = require('./CursoER');
const Academico = require('./Academico');
const PeriodosEscolares = require('./Periodos_Escolares');

const AcademicoCursoER = sequelize.define('AcademicoCursoER', {
    Id_AcademicoCursoER: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Id_Curso: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    Numero_Personal: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Id_Periodo: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'Academico_CursoER',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['Id_Curso', 'Numero_Personal', 'Id_Periodo'],
            name: 'academico_curso_periodo_unico'
        }
    ]
});

// Relaciones con CursoER
CursoER.hasMany(AcademicoCursoER, { foreignKey: 'Id_Curso' });
AcademicoCursoER.belongsTo(CursoER, { foreignKey: 'Id_Curso' });

// Relaciones con Academico
Academico.hasMany(AcademicoCursoER, { foreignKey: 'Numero_Personal' });
AcademicoCursoER.belongsTo(Academico, { foreignKey: 'Numero_Personal' });

// Relaciones con PeriodosEscolares
PeriodosEscolares.hasMany(AcademicoCursoER, { foreignKey: 'Id_Periodo' });
AcademicoCursoER.belongsTo(PeriodosEscolares, { foreignKey: 'Id_Periodo' });

module.exports = AcademicoCursoER;

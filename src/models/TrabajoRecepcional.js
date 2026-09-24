const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Carrera = require('./Carrera');
const Lugar = require('./Lugar');
const EstadoLista = require('./EstadoLista');

const TrabajoRecepcional = sequelize.define('TrabajoRecepcional', {
    Id_TrabajoR: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Folio: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Pendiente'
    },
    Modalidad: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Fecha_defensa: {
        type: DataTypes.DATE,
        allowNull: true
    },
    Resultado: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'Pendiente'
    }
}, {
    tableName: 'TrabajoRecepcional',
    timestamps: false
});

Carrera.hasMany(TrabajoRecepcional, { foreignKey: 'Id_Carrera' });
TrabajoRecepcional.belongsTo(Carrera, { foreignKey: 'Id_Carrera' });

Lugar.hasMany(TrabajoRecepcional, { foreignKey: 'Id_Lugar' });
TrabajoRecepcional.belongsTo(Lugar, { foreignKey: 'Id_Lugar' });

EstadoLista.hasMany(TrabajoRecepcional, { foreignKey: 'Id_Estado' });
TrabajoRecepcional.belongsTo(EstadoLista, { foreignKey: 'Id_Estado' });

module.exports = TrabajoRecepcional;
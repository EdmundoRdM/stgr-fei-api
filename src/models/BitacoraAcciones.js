const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const SecretariaGrupo = require('./SecretariaGrupo');
const TrabajoRecepcional = require('./TrabajoRecepcional');

const BitacoraAcciones = sequelize.define('BitacoraAcciones', {
    IdAccion: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    Nombreaccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Numero_Personal: {
        type: DataTypes.STRING,
        allowNull: true
    },
    Id_TrabajoR: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Detalles: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'Bitacora_Acciones',
    timestamps: false
});

SecretariaGrupo.hasMany(BitacoraAcciones, { foreignKey: 'Numero_Personal' });
BitacoraAcciones.belongsTo(SecretariaGrupo, { foreignKey: 'Numero_Personal' });

TrabajoRecepcional.hasMany(BitacoraAcciones, { foreignKey: 'Id_TrabajoR' });
BitacoraAcciones.belongsTo(TrabajoRecepcional, { foreignKey: 'Id_TrabajoR' });

module.exports = BitacoraAcciones;

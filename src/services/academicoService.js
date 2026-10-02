const Academico = require('../models/Academico');
const bcrypt = require('bcrypt');

const RolDirectivo = require('../models/RolDirectivo');
const Carrera = require('../models/Carrera');

const registrarAcademico = async (datos) => {
    const salt = await bcrypt.genSalt(10);
    const contraseniaEncriptada = await bcrypt.hash(datos.Contrasenia, salt);

    const datosSeguros = {
        ...datos,
        Contrasenia: contraseniaEncriptada
    };

    return await Academico.create(datosSeguros);
};

const obtenerAcademicos = async () => {
    return await Academico.findAll({
        attributes: { exclude: ['Contrasenia'] },
        include: [
            { model: RolDirectivo, attributes: ['Id_Rol', 'Nombre_Rol'] },
            { model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] }
        ]
    });
};

const obtenerPerfilAcademico = async (Numero_Personal) => {
    if (!Numero_Personal) return null;

    const academico = await Academico.findByPk(Numero_Personal, {
        include: [
            { model: RolDirectivo, attributes: ['Id_Rol', 'Nombre_Rol'] },
            { model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] }
        ],
        attributes: { exclude: ['Contrasenia'] }
    });

    if (!academico) return null;

    const nombreRol = academico.RolDirectivo?.Nombre_Rol || academico.Rol_Directivo?.Nombre_Rol || null;

    let tipoRol = 'Profesor';
    if (nombreRol) {
        const rolNorm = nombreRol.toLowerCase();
        if (rolNorm.includes('director') && (rolNorm.includes('facultad') || rolNorm.includes('factuldad'))) {
            tipoRol = 'Director_Facultad';
        } else if (rolNorm.includes('secretari')) {
            tipoRol = 'Secretario_Facultad';
        } else if (rolNorm.includes('carrera')) {
            tipoRol = 'Director_Carrera';
        } else {
            tipoRol = 'Directivo';
        }
    }

    return {
        academico,
        tipoRol,
        nombreRol: nombreRol || 'Profesor',
        Id_Carrera: academico.Id_Carrera
    };
};

module.exports = {
    registrarAcademico,
    obtenerAcademicos,
    obtenerPerfilAcademico
};
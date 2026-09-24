const Academico = require('../models/Academico');
const bcrypt = require('bcrypt');

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
        attributes: { exclude: ['Contrasenia'] }
    });
};

module.exports = {
    registrarAcademico,
    obtenerAcademicos
};
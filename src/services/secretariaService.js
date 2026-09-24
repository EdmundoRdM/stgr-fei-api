const SecretariaGrupo = require('../models/SecretariaGrupo');
const bcrypt = require('bcrypt');
const bitacoraService = require('./bitacoraService');

const crearSecretaria = async (datos) => {
    const { Numero_Personal, Nombre, ApellidoP, ApellidoM, CorreoInstitucional, Contrasenia, Rol } = datos;

    if (!Numero_Personal || !Nombre || !ApellidoP || !ApellidoM || !CorreoInstitucional) {
        throw new Error('Todos los campos obligatorios deben ser proporcionados: Numero_Personal, Nombre, ApellidoP, ApellidoM, CorreoInstitucional');
    }

    const existeNumero = await SecretariaGrupo.findByPk(Numero_Personal);
    if (existeNumero) {
        throw new Error(`Ya existe una secretaria registrada con el número de personal ${Numero_Personal}`);
    }

    const existeCorreo = await SecretariaGrupo.findOne({ where: { CorreoInstitucional } });
    if (existeCorreo) {
        throw new Error(`Ya existe una secretaria registrada con el correo ${CorreoInstitucional}`);
    }

    let passwordHasheada = null;
    if (Contrasenia) {
        passwordHasheada = await bcrypt.hash(Contrasenia, 10);
    }

    const nuevaSecretaria = await SecretariaGrupo.create({
        Numero_Personal,
        Nombre,
        ApellidoP,
        ApellidoM,
        CorreoInstitucional,
        Contrasenia: passwordHasheada,
        Rol: Rol || 'Secretaria de Grupo'
    });

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Alta de secretaria de grupo',
        Numero_Personal: nuevaSecretaria.Numero_Personal,
        Detalles: `Se registró a la secretaria ${Nombre} ${ApellidoP} (${Numero_Personal})`
    });

    const respuesta = nuevaSecretaria.toJSON();
    delete respuesta.Contrasenia;
    return respuesta;
};

const obtenerSecretarias = async (filtros = {}) => {
    const condiciones = {};
    if (filtros.Rol) {
        condiciones.Rol = filtros.Rol;
    }

    return await SecretariaGrupo.findAll({
        where: condiciones,
        attributes: { exclude: ['Contrasenia'] },
        order: [['Numero_Personal', 'ASC']]
    });
};

const obtenerSecretariaPorId = async (id) => {
    let secretaria = await SecretariaGrupo.findByPk(id, {
        attributes: { exclude: ['Contrasenia'] }
    });

    if (!secretaria && !isNaN(id)) {
        secretaria = await SecretariaGrupo.findOne({
            where: { Id_Secretaria: id },
            attributes: { exclude: ['Contrasenia'] }
        });
    }

    if (!secretaria) {
        throw new Error(`Secretaria no encontrada con identificador ${id}`);
    }

    return secretaria;
};

const actualizarSecretaria = async (id, datosActualizacion) => {
    let secretaria = await SecretariaGrupo.findByPk(id);

    if (!secretaria && !isNaN(id)) {
        secretaria = await SecretariaGrupo.findOne({ where: { Id_Secretaria: id } });
    }

    if (!secretaria) {
        throw new Error(`Secretaria no encontrada con identificador ${id}`);
    }

    if (datosActualizacion.CorreoInstitucional && datosActualizacion.CorreoInstitucional !== secretaria.CorreoInstitucional) {
        const correoExistente = await SecretariaGrupo.findOne({
            where: { CorreoInstitucional: datosActualizacion.CorreoInstitucional }
        });
        if (correoExistente) {
            throw new Error(`El correo ${datosActualizacion.CorreoInstitucional} ya está registrado`);
        }
    }

    if (datosActualizacion.Contrasenia) {
        datosActualizacion.Contrasenia = await bcrypt.hash(datosActualizacion.Contrasenia, 10);
    }

    const camposPermitidos = ['Nombre', 'ApellidoP', 'ApellidoM', 'CorreoInstitucional', 'Contrasenia', 'Rol'];
    camposPermitidos.forEach(campo => {
        if (datosActualizacion[campo] !== undefined) {
            secretaria[campo] = datosActualizacion[campo];
        }
    });

    await secretaria.save();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Actualización de secretaria de grupo',
        Numero_Personal: secretaria.Numero_Personal,
        Detalles: `Se actualizaron los datos de la secretaria ${secretaria.Nombre} ${secretaria.ApellidoP}`
    });

    const respuesta = secretaria.toJSON();
    delete respuesta.Contrasenia;
    return respuesta;
};

const eliminarSecretaria = async (id) => {
    let secretaria = await SecretariaGrupo.findByPk(id);

    if (!secretaria && !isNaN(id)) {
        secretaria = await SecretariaGrupo.findOne({ where: { Id_Secretaria: id } });
    }

    if (!secretaria) {
        throw new Error(`Secretaria no encontrada con identificador ${id}`);
    }

    const numPersonal = secretaria.Numero_Personal;
    await secretaria.destroy();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Baja de secretaria de grupo',
        Numero_Personal: null,
        Detalles: `Se eliminó el registro de la secretaria con número de personal ${numPersonal}`
    });

    return { mensaje: `Secretaria con número personal ${numPersonal} eliminada exitosamente` };
};

module.exports = {
    crearSecretaria,
    obtenerSecretarias,
    obtenerSecretariaPorId,
    actualizarSecretaria,
    eliminarSecretaria
};

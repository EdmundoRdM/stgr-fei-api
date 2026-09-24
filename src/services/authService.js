const Academico = require("../models/Academico");
const RolDirectivo = require("../models/RolDirectivo");
const SecretariaGrupo = require("../models/SecretariaGrupo");
const bcrypt = require("bcrypt");

const autenticarUsuario = async (correo, contrasenia) => {
    // 1. Intentar autenticar como Académico (Profesor o Directivo / Secretaria de Facultad)
    const academico = await Academico.findOne({
        where: { CorreoInstitucional: correo },
        include: [{ model: RolDirectivo, attributes: ["Nombre_Rol"] }]
    });

    if (academico) {
        const esPasswordValida = await bcrypt.compare(contrasenia, academico.Contrasenia);
        if (!esPasswordValida) {
            throw new Error("Credenciales invalidas");
        }

        const rolNombre = (academico.RolDirectivo && academico.RolDirectivo.Nombre_Rol) 
            || (academico.Rol_Directivo && academico.Rol_Directivo.Nombre_Rol) 
            || "Profesor";

        return {
            numeroPersonal: academico.Numero_Personal,
            nombre: `${academico.Nombre} ${academico.ApellidoP}`,
            correo: academico.CorreoInstitucional,
            rol: rolNombre
        };
    }

    // 2. Intentar autenticar como Secretaria de Grupo
    const secretaria = await SecretariaGrupo.findOne({
        where: { CorreoInstitucional: correo }
    });

    if (secretaria && secretaria.Contrasenia) {
        const esPasswordValida = await bcrypt.compare(contrasenia, secretaria.Contrasenia);
        if (!esPasswordValida) {
            throw new Error("Credenciales invalidas");
        }

        return {
            numeroPersonal: secretaria.Numero_Personal,
            nombre: `${secretaria.Nombre} ${secretaria.ApellidoP}`,
            correo: secretaria.CorreoInstitucional,
            rol: secretaria.Rol || "Secretaria de Grupo"
        };
    }

    throw new Error("Credenciales invalidas");
};

module.exports = { autenticarUsuario };

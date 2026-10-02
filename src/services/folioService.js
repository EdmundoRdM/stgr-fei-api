const { Op } = require('sequelize');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const Carrera = require('../models/Carrera');

/**
 * Valida que un Tomo y Numero_Folio cumplan las reglas de negocio:
 * 1. Tomo debe ser un número entero >= 1.
 * 2. Numero_Folio debe ser un número entero entre 1 y 100.
 * 3. En la misma carrera (Id_Carrera), no puede existir otro trabajo recepcional con el mismo Tomo y Numero_Folio.
 */
const validarTomoYFolio = async ({ Id_Carrera, Tomo, Numero_Folio, Id_TrabajoR = null }) => {
    if (Tomo === undefined || Tomo === null || isNaN(Number(Tomo))) {
        throw new Error('El campo Tomo debe ser un número entero válido (mayor o igual a 1).');
    }
    const tomoNum = parseInt(Tomo, 10);
    if (tomoNum < 1) {
        throw new Error('El Tomo del libro debe ser mayor o igual a 1.');
    }

    if (Numero_Folio === undefined || Numero_Folio === null || isNaN(Number(Numero_Folio))) {
        throw new Error('El campo Numero_Folio debe ser un número entero entre 1 y 100.');
    }
    const folioNum = parseInt(Numero_Folio, 10);
    if (folioNum < 1 || folioNum > 100) {
        throw new Error(`El Numero_Folio (${folioNum}) es inválido. Los libros de actas de la UV contienen folios del 1 al 100.`);
    }

    if (!Id_Carrera) {
        throw new Error('Se requiere el identificador de la carrera (Id_Carrera) para validar el tomo y folio.');
    }

    const condicion = {
        Id_Carrera,
        Tomo: tomoNum,
        Numero_Folio: folioNum
    };

    if (Id_TrabajoR) {
        condicion.Id_TrabajoR = { [Op.ne]: Id_TrabajoR };
    }

    const conflicto = await TrabajoRecepcional.findOne({
        where: condicion,
        include: [{ model: Carrera, attributes: ['NombreCarrera'] }]
    });

    if (conflicto) {
        const nombreCarrera = conflicto.Carrera?.NombreCarrera || `Carrera #${Id_Carrera}`;
        throw new Error(
            `El Folio ${folioNum} del Tomo ${tomoNum} ya se encuentra ocupado en la carrera '${nombreCarrera}' por el trabajo recepcional ID #${conflicto.Id_TrabajoR} ("${conflicto.Titulo}").`
        );
    }

    return {
        tomo: tomoNum,
        numeroFolio: folioNum,
        folioFormateado: `Tomo ${tomoNum} - Folio ${folioNum}`
    };
};


const consultarEstadoTomo = async (Id_Carrera, Tomo) => {
    if (!Id_Carrera) throw new Error('Se requiere Id_Carrera');
    if (!Tomo) throw new Error('Se requiere el número de Tomo');

    const tomoNum = parseInt(Tomo, 10);

    const trabajos = await TrabajoRecepcional.findAll({
        where: {
            Id_Carrera,
            Tomo: tomoNum,
            Numero_Folio: { [Op.ne]: null }
        },
        attributes: ['Id_TrabajoR', 'Titulo', 'Numero_Folio', 'Fecha_defensa', 'Resultado'],
        order: [['Numero_Folio', 'ASC']]
    });

    const foliosOcupadosMap = new Set(trabajos.map(t => t.Numero_Folio));
    const foliosDisponibles = [];
    for (let f = 1; f <= 100; f++) {
        if (!foliosOcupadosMap.has(f)) {
            foliosDisponibles.push(f);
        }
    }

    return {
        Id_Carrera,
        Tomo: tomoNum,
        totalOcupados: trabajos.length,
        totalDisponibles: 100 - trabajos.length,
        estaLleno: trabajos.length >= 100,
        siguienteDisponible: foliosDisponibles.length > 0 ? foliosDisponibles[0] : null,
        foliosOcupados: Array.from(foliosOcupadosMap),
        trabajosRegistrados: trabajos
    };
};

const sugerirSiguienteFolio = async (Id_Carrera, TomoSolicitado = null) => {
    if (!Id_Carrera) throw new Error('Se requiere el Id_Carrera para sugerir el siguiente folio.');

    // 1. Si la secretaria solicitó un tomo específico
    if (TomoSolicitado) {
        const estadoTomo = await consultarEstadoTomo(Id_Carrera, TomoSolicitado);
        if (estadoTomo.estaLleno) {
            return {
                Id_Carrera,
                Tomo: parseInt(TomoSolicitado, 10),
                Numero_Folio: null,
                estaLleno: true,
                mensaje: `El Tomo ${TomoSolicitado} ya cuenta con sus 100 folios completos. Se sugiere avanzar al Tomo ${parseInt(TomoSolicitado, 10) + 1}, Folio 1.`,
                tomoSugeridoAlterno: parseInt(TomoSolicitado, 10) + 1,
                folioSugeridoAlterno: 1
            };
        }
        return {
            Id_Carrera,
            Tomo: parseInt(TomoSolicitado, 10),
            Numero_Folio: estadoTomo.siguienteDisponible,
            FolioSugerido: `Tomo ${TomoSolicitado} - Folio ${estadoTomo.siguienteDisponible}`,
            foliosOcupadosEnTomo: estadoTomo.totalOcupados,
            foliosDisponiblesEnTomo: estadoTomo.totalDisponibles,
            estaLleno: false
        };
    }

    // 2. Si no se especificó tomo, encontrar el Tomo más alto registrado en esa carrera
    const maxTomoRegistro = await TrabajoRecepcional.findOne({
        where: {
            Id_Carrera,
            Tomo: { [Op.ne]: null }
        },
        order: [['Tomo', 'DESC']]
    });

    // Caso: No existe ningún tomo registrado aún para esta carrera
    if (!maxTomoRegistro || !maxTomoRegistro.Tomo) {
        return {
            Id_Carrera,
            Tomo: 1,
            Numero_Folio: 1,
            FolioSugerido: 'Tomo 1 - Folio 1',
            foliosOcupadosEnTomo: 0,
            foliosDisponiblesEnTomo: 100,
            esNuevoTomo: true,
            estaLleno: false
        };
    }

    const maxTomoActual = maxTomoRegistro.Tomo;
    const estadoTomoActual = await consultarEstadoTomo(Id_Carrera, maxTomoActual);

    // Si el tomo actual más alto ya tiene los 100 registros llenos, avanzamos al siguiente tomo
    if (estadoTomoActual.estaLleno) {
        const nuevoTomo = maxTomoActual + 1;
        return {
            Id_Carrera,
            Tomo: nuevoTomo,
            Numero_Folio: 1,
            FolioSugerido: `Tomo ${nuevoTomo} - Folio 1`,
            foliosOcupadosEnTomo: 0,
            foliosDisponiblesEnTomo: 100,
            esNuevoTomo: true,
            estaLleno: false,
            mensaje: `El Tomo ${maxTomoActual} ha alcanzado su límite de 100 folios. Se abre automáticamente el Tomo ${nuevoTomo}.`
        };
    }

    // Si aún tiene folios libres en ese tomo
    return {
        Id_Carrera,
        Tomo: maxTomoActual,
        Numero_Folio: estadoTomoActual.siguienteDisponible,
        FolioSugerido: `Tomo ${maxTomoActual} - Folio ${estadoTomoActual.siguienteDisponible}`,
        foliosOcupadosEnTomo: estadoTomoActual.totalOcupados,
        foliosDisponiblesEnTomo: estadoTomoActual.totalDisponibles,
        esNuevoTomo: false,
        estaLleno: false
    };
};

/**
 * Lista todos los tomos que tienen registros para una carrera, con su total de folios usados.
 */
const listarTomosPorCarrera = async (Id_Carrera) => {
    if (!Id_Carrera) throw new Error('Se requiere Id_Carrera');

    const trabajosConTomo = await TrabajoRecepcional.findAll({
        where: {
            Id_Carrera,
            Tomo: { [Op.ne]: null }
        },
        attributes: ['Tomo', 'Numero_Folio'],
        order: [['Tomo', 'ASC'], ['Numero_Folio', 'ASC']]
    });

    const mapaTomos = new Map();
    for (const t of trabajosConTomo) {
        if (!mapaTomos.has(t.Tomo)) {
            mapaTomos.set(t.Tomo, []);
        }
        if (t.Numero_Folio) {
            mapaTomos.get(t.Tomo).push(t.Numero_Folio);
        }
    }

    const resultado = [];
    for (const [tomoNum, folios] of mapaTomos.entries()) {
        resultado.push({
            Tomo: tomoNum,
            totalOcupados: folios.length,
            totalDisponibles: 100 - folios.length,
            estaLleno: folios.length >= 100
        });
    }

    return resultado;
};

module.exports = {
    validarTomoYFolio,
    consultarEstadoTomo,
    sugerirSiguienteFolio,
    listarTomosPorCarrera
};

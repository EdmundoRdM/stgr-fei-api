const { Op } = require('sequelize');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const Lugar = require('../models/Lugar');
const Carrera = require('../models/Carrera');
const bitacoraService = require('./bitacoraService');

/**
 * Normaliza las fechas y horas recibidas en el payload a objetos Date de JavaScript.
 * Soporta dos formatos:
 *  1. Fecha_defensa y Fecha_fin_defensa (strings ISO o instancias de Date).
 *  2. Fecha (YYYY-MM-DD), Hora_inicio (HH:MM) y Hora_fin (HH:MM).
 */
const normalizarHorariosDefensa = (datos) => {
    let inicio = null;
    let fin = null;

    if (datos.Fecha && datos.Hora_inicio) {
        inicio = new Date(`${datos.Fecha}T${datos.Hora_inicio}:00`);
        if (datos.Hora_fin) {
            fin = new Date(`${datos.Fecha}T${datos.Hora_fin}:00`);
        } else {
            // Duración por defecto de 2 horas si no se provee hora fin
            fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);
        }
    } else if (datos.Fecha_defensa) {
        inicio = new Date(datos.Fecha_defensa);
        if (datos.Fecha_fin_defensa) {
            fin = new Date(datos.Fecha_fin_defensa);
        } else {
            // Si solo envían Fecha_defensa, asignamos 2 horas de duración estimada por defecto
            fin = new Date(inicio.getTime() + 2 * 60 * 60 * 1000);
        }
    }

    if (!inicio || isNaN(inicio.getTime())) {
        throw new Error('Debe proporcionar una fecha y hora de inicio válida para la defensa (ejemplo: Fecha_defensa o Fecha y Hora_inicio).');
    }

    if (!fin || isNaN(fin.getTime())) {
        throw new Error('Debe proporcionar una fecha y hora de fin válida para la defensa (ejemplo: Fecha_fin_defensa o Hora_fin).');
    }

    if (fin <= inicio) {
        throw new Error('La hora de fin de la defensa debe ser estrictamente posterior a la hora de inicio.');
    }

    // Validar que ocurran el mismo día
    const fechaInicioStr = inicio.toISOString().split('T')[0];
    const fechaFinStr = fin.toISOString().split('T')[0];
    if (fechaInicioStr !== fechaFinStr) {
        throw new Error('La defensa de un trabajo recepcional debe iniciar y finalizar el mismo día.');
    }

    return { inicio, fin };
};

/**
 * Formatea una fecha a hora legible local para los mensajes de error
 */
const formatearHoraLocal = (date) => {
    return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const formatearFechaLocal = (date) => {
    return date.toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' });
};

/**
 * Valida las reglas de negocio para la asignación de lugar y horario:
 * Regla 1: No puede haber dos trabajos en el mismo lugar al mismo tiempo.
 * Regla 2: No puede haber más de un trabajo de la misma carrera al mismo tiempo (incluso en diferentes lugares).
 */
const validarConflictoHorarioYEspacio = async ({ Id_TrabajoR, Id_Lugar, Id_Carrera, inicio, fin }) => {
    // Condición matemática de solapamiento de intervalos:
    // EventoA.inicio < EventoB.fin AND EventoA.fin > EventoB.inicio
    const condicionSolapamiento = {
        Fecha_defensa: { [Op.lt]: fin },
        Fecha_fin_defensa: { [Op.gt]: inicio }
    };

    if (Id_TrabajoR) {
        condicionSolapamiento.Id_TrabajoR = { [Op.ne]: Id_TrabajoR };
    }

    // 1. REGLA DE LUGAR: Verificar que el lugar exista y no tenga solapamiento físico
    if (Id_Lugar) {
        const lugar = await Lugar.findByPk(Id_Lugar);
        if (!lugar) {
            throw new Error(`El lugar con identificador ${Id_Lugar} no existe en el catálogo.`);
        }
        if (lugar.Estado && lugar.Estado.toLowerCase() === 'no_disponible') {
            throw new Error(`El espacio "${lugar.Nombre}" se encuentra marcado como NO disponible para eventos.`);
        }

        const conflictoLugar = await TrabajoRecepcional.findOne({
            where: {
                ...condicionSolapamiento,
                Id_Lugar
            },
            include: [{ model: Carrera, attributes: ['NombreCarrera'] }]
        });

        if (conflictoLugar) {
            const hIni = formatearHoraLocal(new Date(conflictoLugar.Fecha_defensa));
            const hFin = formatearHoraLocal(new Date(conflictoLugar.Fecha_fin_defensa || conflictoLugar.Fecha_defensa));
            const fDia = formatearFechaLocal(new Date(conflictoLugar.Fecha_defensa));
            throw new Error(
                `Conflicto de espacio: El lugar "${lugar.Nombre}" ya se encuentra reservado el ${fDia} de ${hIni} a ${hFin} por el trabajo recepcional #${conflictoLugar.Id_TrabajoR} ("${conflictoLugar.Titulo}").`
            );
        }
    }

    // 2. REGLA DE CARRERA: No puede haber dos trabajos de la misma carrera al mismo tiempo
    if (Id_Carrera) {
        const carrera = await Carrera.findByPk(Id_Carrera);
        const nombreCarrera = carrera ? carrera.NombreCarrera : `Carrera #${Id_Carrera}`;

        const conflictoCarrera = await TrabajoRecepcional.findOne({
            where: {
                ...condicionSolapamiento,
                Id_Carrera
            },
            include: [{ model: Lugar, attributes: ['Nombre'] }]
        });

        if (conflictoCarrera) {
            const hIni = formatearHoraLocal(new Date(conflictoCarrera.Fecha_defensa));
            const hFin = formatearHoraLocal(new Date(conflictoCarrera.Fecha_fin_defensa || conflictoCarrera.Fecha_defensa));
            const fDia = formatearFechaLocal(new Date(conflictoCarrera.Fecha_defensa));
            const lugarConflicto = conflictoCarrera.Lugar ? conflictoCarrera.Lugar.Nombre : 'Sin lugar asignado';

            throw new Error(
                `Conflicto de carrera simultánea: Ya existe una defensa programada para la carrera "${nombreCarrera}" el ${fDia} de ${hIni} a ${hFin} en "${lugarConflicto}" (Trabajo #${conflictoCarrera.Id_TrabajoR}: "${conflictoCarrera.Titulo}"). Regla institucional: no puede haber más de una defensa de la misma carrera al mismo tiempo.`
            );
        }
    }

    return true;
};

/**
 * Asigna o reprograma la fecha, horas de inicio y fin, y el lugar de defensa de un trabajo recepcional.
 */
const programarDefensa = async (idTrabajoRecepcional, datosHorario, Numero_Personal = null) => {
    const trabajo = await TrabajoRecepcional.findByPk(idTrabajoRecepcional, {
        include: [
            { model: Carrera },
            { model: Lugar }
        ]
    });

    if (!trabajo) {
        throw new Error(`Trabajo recepcional #${idTrabajoRecepcional} no encontrado.`);
    }

    const { inicio, fin } = normalizarHorariosDefensa(datosHorario);
    const idLugarFinal = datosHorario.Id_Lugar !== undefined ? datosHorario.Id_Lugar : trabajo.Id_Lugar;
    const idCarreraFinal = datosHorario.Id_Carrera !== undefined ? datosHorario.Id_Carrera : trabajo.Id_Carrera;

    await validarConflictoHorarioYEspacio({
        Id_TrabajoR: idTrabajoRecepcional,
        Id_Lugar: idLugarFinal,
        Id_Carrera: idCarreraFinal,
        inicio,
        fin
    });

    trabajo.Fecha_defensa = inicio;
    trabajo.Fecha_fin_defensa = fin;
    if (datosHorario.Id_Lugar !== undefined) {
        trabajo.Id_Lugar = datosHorario.Id_Lugar;
    }

    await trabajo.save();

    const lugarAsignado = idLugarFinal ? await Lugar.findByPk(idLugarFinal) : null;
    const nombreLugar = lugarAsignado ? lugarAsignado.Nombre : 'Sin lugar';
    const hInicioStr = formatearHoraLocal(inicio);
    const hFinStr = formatearHoraLocal(fin);
    const fDiaStr = formatearFechaLocal(inicio);

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Programación de defensa recepcional',
        Numero_Personal,
        Id_TrabajoR: idTrabajoRecepcional,
        Detalles: `Defensa programada para el ${fDiaStr} de ${hInicioStr} a ${hFinStr} en "${nombreLugar}".`
    });

    return await TrabajoRecepcional.findByPk(idTrabajoRecepcional, {
        include: [
            { model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] },
            { model: Lugar, attributes: ['Id_Lugar', 'Nombre', 'Edificio'] }
        ]
    });
};

/**
 * Consulta la disponibilidad de lugares y si la carrera está libre para una fecha y horario propuesto.
 */
const consultarDisponibilidad = async (datos) => {
    const { inicio, fin } = normalizarHorariosDefensa(datos);
    const idCarrera = datos.Id_Carrera ? parseInt(datos.Id_Carrera, 10) : null;
    const idTrabajoR = datos.Id_TrabajoR ? parseInt(datos.Id_TrabajoR, 10) : null;

    const condicionSolapamiento = {
        Fecha_defensa: { [Op.lt]: fin },
        Fecha_fin_defensa: { [Op.gt]: inicio }
    };
    if (idTrabajoR) {
        condicionSolapamiento.Id_TrabajoR = { [Op.ne]: idTrabajoR };
    }

    // 1. Verificar estado de la carrera
    let carreraDisponible = true;
    let conflictoCarrera = null;
    if (idCarrera) {
        const trCarreraConflicto = await TrabajoRecepcional.findOne({
            where: {
                ...condicionSolapamiento,
                Id_Carrera: idCarrera
            },
            include: [{ model: Lugar, attributes: ['Nombre'] }]
        });

        if (trCarreraConflicto) {
            carreraDisponible = false;
            conflictoCarrera = {
                Id_TrabajoR: trCarreraConflicto.Id_TrabajoR,
                Titulo: trCarreraConflicto.Titulo,
                Lugar: trCarreraConflicto.Lugar?.Nombre || 'Sin asignar',
                Hora_inicio: trCarreraConflicto.Fecha_defensa,
                Hora_fin: trCarreraConflicto.Fecha_fin_defensa
            };
        }
    }

    // 2. Verificar lugares ocupados vs disponibles
    const todosLosLugares = await Lugar.findAll({
        where: { Estado: 'disponible' },
        order: [['Nombre', 'ASC']]
    });

    const trabajosConLugar = await TrabajoRecepcional.findAll({
        where: {
            ...condicionSolapamiento,
            Id_Lugar: { [Op.ne]: null }
        },
        include: [
            { model: Carrera, attributes: ['NombreCarrera'] },
            { model: Lugar, attributes: ['Id_Lugar', 'Nombre'] }
        ]
    });

    const mapaOcupados = new Map();
    trabajosConLugar.forEach(t => {
        mapaOcupados.set(t.Id_Lugar, {
            Id_TrabajoR: t.Id_TrabajoR,
            Titulo: t.Titulo,
            Carrera: t.Carrera?.NombreCarrera,
            Fecha_defensa: t.Fecha_defensa,
            Fecha_fin_defensa: t.Fecha_fin_defensa
        });
    });

    const lugaresDisponibles = [];
    const lugaresOcupados = [];

    todosLosLugares.forEach(lug => {
        if (mapaOcupados.has(lug.Id_Lugar)) {
            lugaresOcupados.push({
                Id_Lugar: lug.Id_Lugar,
                Nombre: lug.Nombre,
                Edificio: lug.Edificio,
                ocupadoPor: mapaOcupados.get(lug.Id_Lugar)
            });
        } else {
            lugaresDisponibles.push({
                Id_Lugar: lug.Id_Lugar,
                Nombre: lug.Nombre,
                Edificio: lug.Edificio
            });
        }
    });

    return {
        rangoHorario: {
            inicio,
            fin,
            inicioLegible: formatearHoraLocal(inicio),
            finLegible: formatearHoraLocal(fin),
            fechaLegible: formatearFechaLocal(inicio)
        },
        carrera: {
            Id_Carrera: idCarrera,
            disponible: carreraDisponible,
            conflicto: conflictoCarrera
        },
        totalLugaresRegistrados: todosLosLugares.length,
        totalLugaresDisponibles: lugaresDisponibles.length,
        lugaresDisponibles,
        lugaresOcupados
    };
};

/**
 * Consulta la agenda general de defensas programadas (para calendarios o reportes de fechas).
 */
const obtenerAgendaDefensas = async (filtros = {}) => {
    const condiciones = {
        Fecha_defensa: { [Op.ne]: null }
    };

    if (filtros.fecha) {
        const diaInicio = new Date(`${filtros.fecha}T00:00:00`);
        const diaFin = new Date(`${filtros.fecha}T23:59:59`);
        condiciones.Fecha_defensa = {
            [Op.between]: [diaInicio, diaFin]
        };
    } else if (filtros.fechaInicio && filtros.fechaFin) {
        condiciones.Fecha_defensa = {
            [Op.between]: [new Date(filtros.fechaInicio), new Date(filtros.fechaFin)]
        };
    }

    if (filtros.Id_Carrera) {
        condiciones.Id_Carrera = filtros.Id_Carrera;
    }

    if (filtros.Id_Lugar) {
        condiciones.Id_Lugar = filtros.Id_Lugar;
    }

    return await TrabajoRecepcional.findAll({
        where: condiciones,
        include: [
            { model: Carrera, attributes: ['Id_Carrera', 'NombreCarrera'] },
            { model: Lugar, attributes: ['Id_Lugar', 'Nombre', 'Edificio'] }
        ],
        order: [['Fecha_defensa', 'ASC']]
    });
};

module.exports = {
    normalizarHorariosDefensa,
    validarConflictoHorarioYEspacio,
    programarDefensa,
    consultarDisponibilidad,
    obtenerAgendaDefensas
};

const Documento = require('../models/Documento');
const EstudianteDocumento = require('../models/EstudianteDocumento');
const EstudianteTrabajo = require('../models/EstudianteTrabajo');
const Estudiante = require('../models/Estudiante');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const EstadoLista = require('../models/EstadoLista');
const bitacoraService = require('./bitacoraService');

const obtenerCatalogoDocumentos = async () => {
    return await Documento.findAll({
        order: [['Id_Documento', 'ASC']]
    });
};

const obtenerChecklistPorTrabajo = async (idTrabajoR) => {
    const trabajo = await TrabajoRecepcional.findByPk(idTrabajoR, {
        include: [{ model: EstadoLista, attributes: ['Id_Estado', 'EstadoNombre'] }]
    });

    if (!trabajo) {
        throw new Error(`Trabajo recepcional con ID ${idTrabajoR} no encontrado`);
    }

    // Estudiantes vinculados al trabajo
    const asignacionesEstudiantes = await EstudianteTrabajo.findAll({
        where: { Id_TrabajoR: idTrabajoR },
        include: [{ model: Estudiante }]
    });

    const catalogoDocumentos = await Documento.findAll({
        order: [['Id_Documento', 'ASC']]
    });

    // Registros de documentos entregados para este trabajo
    const entregasExistentes = await EstudianteDocumento.findAll({
        where: { Id_TrabajoR: idTrabajoR }
    });

    const mapaEntregas = new Map();
    entregasExistentes.forEach(entrega => {
        const key = `${entrega.Matricula}_${entrega.Id_Documento}`;
        mapaEntregas.set(key, entrega);
    });

    let totalDocumentosRequeridos = 0;
    let totalEntregados = 0;

    const checklistEstudiantes = asignacionesEstudiantes.map(asig => {
        const est = asig.Estudiante;
        const documentosEstudiante = catalogoDocumentos.map(doc => {
            totalDocumentosRequeridos++;
            const key = `${est.Matricula}_${doc.Id_Documento}`;
            const entrega = mapaEntregas.get(key);

            const estaEntregado = entrega ? entrega.Entregado : false;
            if (estaEntregado) totalEntregados++;

            return {
                Id_Documento: doc.Id_Documento,
                NombreDocumento: doc.NombreDocumento,
                Entregado: estaEntregado,
                FechaEntrega: entrega ? entrega.FechaEntrega : null,
                Id_Estudiante_Documento: entrega ? entrega.Id_Estudiante_Documento : null
            };
        });

        const entregadosEstudiante = documentosEstudiante.filter(d => d.Entregado).length;

        return {
            Matricula: est.Matricula,
            NombreCompleto: est.NombreCompleto,
            CorreoInstitucional: est.CorreoInstitucional,
            totalRequeridos: catalogoDocumentos.length,
            totalEntregados: entregadosEstudiante,
            completo: entregadosEstudiante === catalogoDocumentos.length && catalogoDocumentos.length > 0,
            documentos: documentosEstudiante
        };
    });

    const checklistCompleto = totalDocumentosRequeridos > 0 && totalEntregados === totalDocumentosRequeridos;
    const porcentajeAvance = totalDocumentosRequeridos > 0 ? Math.round((totalEntregados / totalDocumentosRequeridos) * 100) : 0;

    return {
        Id_TrabajoR: trabajo.Id_TrabajoR,
        Titulo: trabajo.Titulo,
        Estado: trabajo.EstadoLista ? trabajo.EstadoLista.EstadoNombre : 'Desconocido',
        totalDocumentosRequeridos,
        totalEntregados,
        porcentajeAvance,
        checklistCompleto,
        estudiantes: checklistEstudiantes
    };
};

const registrarEntregaDocumento = async ({ Id_TrabajoR, Matricula, Id_Documento, Entregado = true, Numero_Personal }) => {
    if (!Id_TrabajoR || !Matricula || !Id_Documento) {
        throw new Error('Id_TrabajoR, Matricula e Id_Documento son campos obligatorios');
    }

    const trabajo = await TrabajoRecepcional.findByPk(Id_TrabajoR);
    if (!trabajo) {
        throw new Error(`Trabajo recepcional con ID ${Id_TrabajoR} no existe`);
    }

    const estudiante = await Estudiante.findByPk(Matricula);
    if (!estudiante) {
        throw new Error(`Estudiante con matrícula ${Matricula} no existe`);
    }

    const documento = await Documento.findByPk(Id_Documento);
    if (!documento) {
        throw new Error(`Documento con ID ${Id_Documento} no existe en el catálogo`);
    }

    const [registro, creado] = await EstudianteDocumento.findOrCreate({
        where: {
            Id_TrabajoR,
            Matricula,
            Id_Documento
        },
        defaults: {
            Entregado,
            FechaEntrega: new Date()
        }
    });

    if (!creado) {
        registro.Entregado = Entregado;
        registro.FechaEntrega = Entregado ? new Date() : null;
        await registro.save();
    }

    // Registro auditable en bitácora
    const nombreAccion = Entregado ? 'Aceptó el documento' : 'Eliminó el documento';
    const detalleAccion = Entregado
        ? `Aceptó el documento "${documento.NombreDocumento}" del estudiante ${estudiante.NombreCompleto} (${Matricula}) para el trabajo "${trabajo.Titulo}" (ID: ${Id_TrabajoR})`
        : `Eliminó el documento "${documento.NombreDocumento}" del estudiante ${estudiante.NombreCompleto} (${Matricula}) para el trabajo "${trabajo.Titulo}" (ID: ${Id_TrabajoR})`;

    await bitacoraService.registrarAccion({
        Nombreaccion: nombreAccion,
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR,
        Detalles: detalleAccion
    });

    return {
        mensaje: Entregado ? 'Documento marcado como entregado exitosamente' : 'Entrega de documento revocada exitosamente',
        documento: {
            Id_Estudiante_Documento: registro.Id_Estudiante_Documento,
            Id_TrabajoR: registro.Id_TrabajoR,
            Matricula: registro.Matricula,
            Id_Documento: registro.Id_Documento,
            NombreDocumento: documento.NombreDocumento,
            Entregado: registro.Entregado,
            FechaEntrega: registro.FechaEntrega
        }
    };
};

const eliminarEntregaDocumento = async ({ Id_TrabajoR, Matricula, Id_Documento, Numero_Personal }) => {
    const registro = await EstudianteDocumento.findOne({
        where: { Id_TrabajoR, Matricula, Id_Documento }
    });

    if (!registro) {
        throw new Error('El documento no se encuentra registrado como entregado');
    }

    const documento = await Documento.findByPk(Id_Documento);
    const nombreDoc = documento ? documento.NombreDocumento : `ID ${Id_Documento}`;

    await registro.destroy();

    await bitacoraService.registrarAccion({
        Nombreaccion: 'Eliminó el documento',
        Numero_Personal: Numero_Personal || null,
        Id_TrabajoR,
        Detalles: `Eliminó el documento "${nombreDoc}" del estudiante con matrícula ${Matricula} para el trabajo ${Id_TrabajoR}`
    });

    return { mensaje: `Documento "${nombreDoc}" eliminado de las entregas del estudiante ${Matricula}` };
};

const registrarEntregasLote = async ({ Id_TrabajoR, entregas, Numero_Personal }) => {
    if (!Id_TrabajoR || !Array.isArray(entregas) || entregas.length === 0) {
        throw new Error('Se requiere Id_TrabajoR y un arreglo no vacío de entregas');
    }

    const resultados = [];
    for (const item of entregas) {
        const res = await registrarEntregaDocumento({
            Id_TrabajoR,
            Matricula: item.Matricula,
            Id_Documento: item.Id_Documento,
            Entregado: item.Entregado !== undefined ? item.Entregado : true,
            Numero_Personal
        });
        resultados.push(res);
    }

    return {
        mensaje: `${resultados.length} entregas de documentos procesadas correctamente`,
        entregas: resultados
    };
};

module.exports = {
    obtenerCatalogoDocumentos,
    obtenerChecklistPorTrabajo,
    registrarEntregaDocumento,
    eliminarEntregaDocumento,
    registrarEntregasLote
};

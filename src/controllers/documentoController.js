const documentoService = require('../services/documentoService');

const extraerNumeroPersonal = (req) => {
    return req.body?.Numero_Personal || req.headers['x-numero-personal'] || req.query?.Numero_Personal || null;
};

const obtenerCatalogo = async (req, res) => {
    try {
        const catalogo = await documentoService.obtenerCatalogoDocumentos();
        res.status(200).json(catalogo);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar catálogo de documentos', detalle: error.message });
    }
};

const obtenerChecklist = async (req, res) => {
    try {
        const { id: idTrabajoR } = req.params;
        const checklist = await documentoService.obtenerChecklistPorTrabajo(idTrabajoR);
        res.status(200).json(checklist);
    } catch (error) {
        res.status(404).json({ error: 'Error al obtener checklist de documentos', detalle: error.message });
    }
};

const registrarEntrega = async (req, res) => {
    try {
        const idTrabajoR = req.params.id || req.body.Id_TrabajoR;
        const { Matricula, Id_Documento, Entregado } = req.body;
        const numeroPersonal = extraerNumeroPersonal(req);

        const resultado = await documentoService.registrarEntregaDocumento({
            Id_TrabajoR: idTrabajoR,
            Matricula,
            Id_Documento,
            Entregado,
            Numero_Personal: numeroPersonal
        });

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar entrega de documento', detalle: error.message });
    }
};

const eliminarEntrega = async (req, res) => {
    try {
        const idTrabajoR = req.params.id || req.body?.Id_TrabajoR || req.query?.Id_TrabajoR;
        const Matricula = req.body?.Matricula || req.query?.Matricula;
        const Id_Documento = req.body?.Id_Documento || req.query?.Id_Documento;
        const numeroPersonal = extraerNumeroPersonal(req);

        const resultado = await documentoService.eliminarEntregaDocumento({
            Id_TrabajoR: idTrabajoR,
            Matricula,
            Id_Documento,
            Numero_Personal: numeroPersonal
        });

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Error al revocar entrega de documento', detalle: error.message });
    }
};

const registrarLote = async (req, res) => {
    try {
        const idTrabajoR = req.params.id || req.body.Id_TrabajoR;
        const { entregas } = req.body;
        const numeroPersonal = extraerNumeroPersonal(req);

        const resultado = await documentoService.registrarEntregasLote({
            Id_TrabajoR: idTrabajoR,
            entregas,
            Numero_Personal: numeroPersonal
        });

        res.status(200).json(resultado);
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar entregas en lote', detalle: error.message });
    }
};

module.exports = {
    obtenerCatalogo,
    obtenerChecklist,
    registrarEntrega,
    eliminarEntrega,
    registrarLote
};

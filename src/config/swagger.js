const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'SGTR-FEI API - Sistema de Gestión de Trabajos Recepcionales',
        version: '1.0.0',
        description: 'Documentación interactiva de la API RESTful para el Sistema de Gestión de Información de Trabajos Recepcionales de la Facultad de Estadística e Informática (FEI) de la Universidad Veracruzana.',
        contact: {
            name: 'Facultad de Estadística e Informática - UV',
            url: 'https://www.uv.mx/fei/'
        }
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Servidor de desarrollo local'
        }
    ],
    components: {
        schemas: {
            TrabajoRecepcional: {
                type: 'object',
                properties: {
                    Id_TrabajoR: { type: 'integer', example: 1 },
                    Titulo: { type: 'string', example: 'Desarrollo de API para SGTR-FEI' },
                    Folio: { type: 'string', example: 'FEI-TR-2026-001' },
                    Modalidad: { type: 'string', example: 'Tesis' },
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-06-25T10:00:00.000Z' },
                    Resultado: { type: 'string', example: 'Aprobado por Unanimidad' },
                    Id_Carrera: { type: 'integer', example: 1 },
                    Id_Lugar: { type: 'integer', example: 1 },
                    Id_Estado: { type: 'integer', example: 1 }
                }
            },
            CrearTrabajoDTO: {
                type: 'object',
                required: ['Titulo', 'Modalidad', 'Id_Carrera'],
                properties: {
                    Titulo: { type: 'string', example: 'Sistema de Gestión de Información de Trabajos Recepcionales' },
                    Modalidad: { type: 'string', example: 'Monografía' },
                    Id_Carrera: { type: 'integer', example: 1 },
                    Id_Lugar: { type: 'integer', example: 2 },
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-07-15T09:30:00.000Z' }
                }
            },
            ActualizarTrabajoDTO: {
                type: 'object',
                properties: {
                    Titulo: { type: 'string', example: 'Título actualizado del trabajo' },
                    Modalidad: { type: 'string', example: 'Tesina' },
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-08-10T11:00:00.000Z' },
                    Id_Lugar: { type: 'integer', example: 1 },
                    Id_Carrera: { type: 'integer', example: 1 },
                    Folio: { type: 'string', example: 'FEI-TR-2026-042', description: 'Solo editable si el trabajo está en estado Finalizado' },
                    Resultado: { type: 'string', example: 'Aprobado por Mayoría', description: 'Solo editable si el trabajo está en estado Finalizado' }
                }
            },
            FinalizarTrabajoDTO: {
                type: 'object',
                required: ['Folio', 'Resultado'],
                properties: {
                    Folio: { type: 'string', example: 'FEI-TR-2026-001' },
                    Resultado: { type: 'string', example: 'Aprobado por Unanimidad' }
                }
            },
            RechazarTrabajoDTO: {
                type: 'object',
                properties: {
                    motivo: { type: 'string', example: 'El título no coincide con el protocolo autorizado' }
                }
            },
            AsignarAcademicoDTO: {
                type: 'object',
                required: ['Id_TrabajoR', 'Numero_Personal', 'Id_rol'],
                properties: {
                    Id_TrabajoR: { type: 'integer', example: 1 },
                    Numero_Personal: { type: 'integer', example: 12345 },
                    Id_rol: { type: 'integer', example: 1, description: '1: Director, 2: Codirector, 3: Sinodal, etc.' }
                }
            },
            AsignarEstudianteDTO: {
                type: 'object',
                required: ['Id_TrabajoR', 'Matricula'],
                properties: {
                    Id_TrabajoR: { type: 'integer', example: 1 },
                    Matricula: { type: 'string', example: 's20014589' }
                }
            },
            SecretariaGrupo: {
                type: 'object',
                properties: {
                    Numero_Personal: { type: 'string', example: 'S001' },
                    Id_Secretaria: { type: 'integer', example: 1 },
                    Nombre: { type: 'string', example: 'Carmen' },
                    ApellidoP: { type: 'string', example: 'López' },
                    ApellidoM: { type: 'string', example: 'Hernández' },
                    CorreoInstitucional: { type: 'string', example: 'carlopez@uv.mx' },
                    Rol: { type: 'string', example: 'Secretaria de Grupo' }
                }
            },
            CrearSecretariaDTO: {
                type: 'object',
                required: ['Numero_Personal', 'Nombre', 'ApellidoP', 'ApellidoM', 'CorreoInstitucional'],
                properties: {
                    Numero_Personal: { type: 'string', example: 'S001' },
                    Nombre: { type: 'string', example: 'Carmen' },
                    ApellidoP: { type: 'string', example: 'López' },
                    ApellidoM: { type: 'string', example: 'Hernández' },
                    CorreoInstitucional: { type: 'string', example: 'carlopez@uv.mx' },
                    Contrasenia: { type: 'string', example: 'secre2026' },
                    Rol: { type: 'string', example: 'Secretaria de Grupo' }
                }
            },
            BitacoraAccion: {
                type: 'object',
                properties: {
                    IdAccion: { type: 'integer', example: 1 },
                    Nombreaccion: { type: 'string', example: 'Aceptó el documento' },
                    Fecha: { type: 'string', format: 'date-time', example: '2026-09-21T10:00:00.000Z' },
                    Numero_Personal: { type: 'string', example: 'S001' },
                    Id_TrabajoR: { type: 'integer', example: 1 },
                    Detalles: { type: 'string', example: 'Aceptó el documento Comprobante de no adeudo...' }
                }
            },
            RegistrarEntregaDTO: {
                type: 'object',
                required: ['Id_TrabajoR', 'Matricula', 'Id_Documento'],
                properties: {
                    Id_TrabajoR: { type: 'integer', example: 1 },
                    Matricula: { type: 'string', example: 's20014589' },
                    Id_Documento: { type: 'integer', example: 1 },
                    Entregado: { type: 'boolean', example: true },
                    Numero_Personal: { type: 'string', example: 'S001' }
                }
            },
            ErrorRespuesta: {
                type: 'object',
                properties: {
                    error: { type: 'string', example: 'Mensaje descriptivo del error' },
                    detalle: { type: 'string', example: 'Información adicional del error' }
                }
            }
        }
    }
};

const swaggerOptions = {
    swaggerDefinition,
    apis: [
        './src/routes/*.js',
        path.join(__dirname, '../routes/*.js').replace(/\\/g, '/')
    ]
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

module.exports = swaggerSpec;

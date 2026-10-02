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
                    Folio: { type: 'string', example: 'Tomo 2 - Folio 98' },
                    Tomo: { type: 'integer', example: 2, description: 'Número de tomo/libro por carrera' },
                    Numero_Folio: { type: 'integer', example: 98, description: 'Número de folio del 1 al 100 dentro del tomo' },
                    Modalidad: { type: 'string', example: 'Tesis' },
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-06-25T10:00:00.000Z', description: 'Fecha y hora de inicio de la defensa' },
                    Fecha_fin_defensa: { type: 'string', format: 'date-time', example: '2026-06-25T12:00:00.000Z', description: 'Fecha y hora de finalización de la defensa' },
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
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-07-15T09:30:00.000Z' },
                    Fecha_fin_defensa: { type: 'string', format: 'date-time', example: '2026-07-15T11:30:00.000Z' }
                }
            },
            ActualizarTrabajoDTO: {
                type: 'object',
                properties: {
                    Titulo: { type: 'string', example: 'Título actualizado del trabajo' },
                    Modalidad: { type: 'string', example: 'Tesina' },
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-08-10T11:00:00.000Z' },
                    Fecha_fin_defensa: { type: 'string', format: 'date-time', example: '2026-08-10T13:00:00.000Z' },
                    Id_Lugar: { type: 'integer', example: 1 },
                    Id_Carrera: { type: 'integer', example: 1 },
                    Tomo: { type: 'integer', example: 2, description: 'Solo editable si el trabajo está en estado Finalizado' },
                    Numero_Folio: { type: 'integer', example: 98, description: 'Del 1 al 100. Solo editable si el trabajo está en estado Finalizado' },
                    Folio: { type: 'string', example: 'Tomo 2 - Folio 98', description: 'Solo editable si el trabajo está en estado Finalizado' },
                    Resultado: { type: 'string', example: 'Aprobado por Mayoría', description: 'Solo editable si el trabajo está en estado Finalizado' }
                }
            },
            ProgramarDefensaDTO: {
                type: 'object',
                properties: {
                    Fecha: { type: 'string', format: 'date', example: '2026-07-15' },
                    Hora_inicio: { type: 'string', example: '10:00' },
                    Hora_fin: { type: 'string', example: '12:00' },
                    Fecha_defensa: { type: 'string', format: 'date-time', example: '2026-07-15T10:00:00.000Z' },
                    Fecha_fin_defensa: { type: 'string', format: 'date-time', example: '2026-07-15T12:00:00.000Z' },
                    Id_Lugar: { type: 'integer', example: 1, description: 'ID del salón o espacio físico' }
                }
            },
            FinalizarTrabajoDTO: {
                type: 'object',
                required: ['Tomo', 'Numero_Folio', 'Resultado'],
                properties: {
                    Tomo: { type: 'integer', example: 2, description: 'Número de libro/tomo correspondiente a la carrera' },
                    Numero_Folio: { type: 'integer', example: 98, description: 'Número de folio del 1 al 100' },
                    Folio: { type: 'string', example: 'Tomo 2 - Folio 98', description: 'Opcional. Si no se envía se formatea automáticamente' },
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
            ParticipanteExterno: {
                type: 'object',
                properties: {
                    Id_ParticipanteExt: { type: 'integer', example: 1 },
                    Nombre: { type: 'string', example: 'Roberto' },
                    ApellidoP: { type: 'string', example: 'Martínez' },
                    ApellidoM: { type: 'string', example: 'Soto' },
                    CorreoElectronico: { type: 'string', example: 'roberto.martinez@empresa.com' },
                    Institucion: { type: 'string', example: 'Instituto Nacional de Investigaciones Eléctricas' }
                }
            },
            CrearParticipanteExternoDTO: {
                type: 'object',
                required: ['Nombre', 'ApellidoP'],
                properties: {
                    Nombre: { type: 'string', example: 'Roberto' },
                    ApellidoP: { type: 'string', example: 'Martínez' },
                    ApellidoM: { type: 'string', example: 'Soto' },
                    CorreoElectronico: { type: 'string', example: 'roberto.martinez@empresa.com' },
                    Institucion: { type: 'string', example: 'Instituto Nacional de Investigaciones Eléctricas' }
                }
            },
            AsignarParticipanteExternoDTO: {
                type: 'object',
                required: ['Id_TrabajoR', 'Id_ParticipanteExt', 'Id_rol'],
                properties: {
                    Id_TrabajoR: { type: 'integer', example: 1 },
                    Id_ParticipanteExt: { type: 'integer', example: 1 },
                    Id_rol: { type: 'integer', example: 2, description: 'ID del rol institucional' }
                }
            },
            EstadoTrabajoRecepcional: {
                type: 'object',
                properties: {
                    Id_EstadoTrabajo: { type: 'integer', example: 1 },
                    Fecha: { type: 'string', format: 'date-time', example: '2026-06-25T10:00:00.000Z' },
                    Id_Estado: { type: 'integer', example: 2 },
                    Id_TrabajoR: { type: 'integer', example: 1 }
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

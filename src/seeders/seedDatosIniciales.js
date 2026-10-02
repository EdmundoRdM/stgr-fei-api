/**
 * ============================================================================
 * SEEDER: Datos Iniciales del Sistema SGTR-FEI
 * Archivo: src/seeders/seedDatosIniciales.js
 * ============================================================================
 * Este script inicializa y complementa la base de datos con:
 *  1. Catálogos base (Carreras [5 carreras FEI], Roles Directivos, Periodos, etc.)
 *  2. Directivos de la Facultad (Director, Directora de Carrera, Secretaria de Facultad)
 *  3. Secretaria de Grupo (Personal administrativo de ejemplo)
 *  4. Al menos 12 Académicos con rol de Profesor (+ 1 Profesor aleatorio)
 *  5. 5 Grupos de Experiencia Recepcional:
 *     - 2 grupos para el periodo escolar anterior (Feb-Jul 2026)
 *     - 3 grupos para el periodo escolar actual (Ago-Ene 2027)
 *     - Asignación de académico titular para cada curso
 *  6. 15 Estudiantes distribuidos equitativamente (3 estudiantes por cada carrera)
 *  7. Inscripción de estudiantes en los grupos de ER (exactamente 3 por grupo)
 *  8. 15 Trabajos Recepcionales (uno para cada estudiante, 3 por carrera)
 *  9. Asignación de Participantes (Director, Codirector y Sinodales por trabajo)
 * ============================================================================
 */

const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const Carrera = require('../models/Carrera');
const RolDirectivo = require('../models/RolDirectivo');
const EstadoLista = require('../models/EstadoLista');
const RolDeParticipacion = require('../models/Rol_de_participacion');
const Documento = require('../models/Documento');
const PeriodosEscolares = require('../models/Periodos_Escolares');
const Lugar = require('../models/Lugar');
const CursoER = require('../models/CursoER');
const Academico = require('../models/Academico');
const SecretariaGrupo = require('../models/SecretariaGrupo');
const AcademicoCursoER = require('../models/AcademicoCursoER');
const Estudiante = require('../models/Estudiante');
const CursoEREstudiante = require('../models/CursoEREstudiante');
const TrabajoRecepcional = require('../models/TrabajoRecepcional');
const EstudianteTrabajo = require('../models/EstudianteTrabajo');
const ParticipantesTrabajo = require('../models/ParticipantesTrabajo');
const ParticipanteExterno = require('../models/ParticipanteExterno');
const ParticipantesExternosTrabajo = require('../models/ParticipantesExternosTrabajo');
const EstadoTrabajoRecepcional = require('../models/EstadoTrabajoRecepcional');

const seedDatosIniciales = async () => {
    try {
        console.log('Iniciando conexión con la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión establecida correctamente.');

        const DEFAULT_PASSWORD = 'Password123!';
        const salt = await bcrypt.genSalt(10);
        const contraseniaEncriptada = await bcrypt.hash(DEFAULT_PASSWORD, salt);
        console.log(`Contraseña por defecto para usuarios: "${DEFAULT_PASSWORD}"`);


        console.log('\n Verificando/insertando catálogos base...');

        const carrerasData = [
            { Id_Carrera: 1, NombreCarrera: 'Ingeniería de Software' },
            { Id_Carrera: 2, NombreCarrera: 'Ciencia de Datos' },
            { Id_Carrera: 3, NombreCarrera: 'Redes y Servicios de Cómputo' },
            { Id_Carrera: 4, NombreCarrera: 'Tecnologías de la Información' },
            { Id_Carrera: 5, NombreCarrera: 'Estadística' }
        ];
        for (const c of carrerasData) {
            await Carrera.findOrCreate({ where: { Id_Carrera: c.Id_Carrera }, defaults: c });
        }

        const rolesDirectivosData = [
            { Id_Rol: 1, Nombre_Rol: 'Director de facultad' },
            { Id_Rol: 2, Nombre_Rol: 'Secretario Académico' },
            { Id_Rol: 3, Nombre_Rol: 'Jefe de Carrera' }
        ];
        for (const r of rolesDirectivosData) {
            await RolDirectivo.findOrCreate({ where: { Id_Rol: r.Id_Rol }, defaults: r });
        }

        const estadosData = [
            { Id_Estado: 1, EstadoNombre: 'Borrador' },
            { Id_Estado: 2, EstadoNombre: 'Registrado' },
            { Id_Estado: 3, EstadoNombre: 'Aprobado' },
            { Id_Estado: 4, EstadoNombre: 'Generado' },
            { Id_Estado: 5, EstadoNombre: 'Finalizado' }
        ];
        for (const e of estadosData) {
            await EstadoLista.findOrCreate({ where: { Id_Estado: e.Id_Estado }, defaults: e });
        }

        const rolesParticipacionData = [
            { Id_rol: 1, NombreRol: 'Director' },
            { Id_rol: 2, NombreRol: 'Codirector' },
            { Id_rol: 3, NombreRol: 'Presidente' },
            { Id_rol: 4, NombreRol: 'Secretario' },
            { Id_rol: 5, NombreRol: 'Vocal' },
            { Id_rol: 6, NombreRol: 'Sinodal' }
        ];
        for (const rp of rolesParticipacionData) {
            await RolDeParticipacion.findOrCreate({ where: { Id_rol: rp.Id_rol }, defaults: rp });
        }

        const periodosData = [
            { Id_Periodo: 1, Fecha_inicio: '2026-02-01', Fecha_fin: '2026-07-31', Nomenclatura: 'Feb-Jul 2026' },
            { Id_Periodo: 2, Fecha_inicio: '2026-08-01', Fecha_fin: '2027-01-31', Nomenclatura: 'Ago-Ene 2027' }
        ];
        for (const p of periodosData) {
            await PeriodosEscolares.findOrCreate({ where: { Id_Periodo: p.Id_Periodo }, defaults: p });
        }

        const lugaresData = [
            { Id_Lugar: 1, Nombre: 'Auditorio FEI', Estado: 'disponible' },
            { Id_Lugar: 2, Nombre: 'Salon Cristal', Estado: 'disponible' },
            { Id_Lugar: 3, Nombre: 'Salon Murales', Estado: 'disponible' },
            { Id_Lugar: 4, Nombre: 'Audiovisual', Estado: 'disponible' },
            { Id_Lugar: 5, Nombre: 'Centro de Cómputo', Estado: 'disponible' }
        ];
        for (const l of lugaresData) {
            await Lugar.findOrCreate({ where: { Id_Lugar: l.Id_Lugar }, defaults: l });
        }

        const documentosData = [
            { Id_Documento: 1, NombreDocumento: 'Comprobante de no adeudo de servicios bibliotecarios' },
            { Id_Documento: 2, NombreDocumento: 'Arancel de pago para trámite de certificado de estudios' },
            { Id_Documento: 3, NombreDocumento: 'Copia de acta de nacimiento' },
            { Id_Documento: 4, NombreDocumento: 'Copia de CURP' },
            { Id_Documento: 5, NombreDocumento: '5 fotografías tamaño credencial (ovaladas) blanco y negro' },
            { Id_Documento: 6, NombreDocumento: 'Copia de Oficio de autorización de publicación (impresión)' },
            { Id_Documento: 7, NombreDocumento: 'Copia de Oficio de VoBo de directores y sinodales aprobatorios (impresión)' },
            { Id_Documento: 8, NombreDocumento: 'Copia de Oficio de aval de Documento Electrónico (impresión)' }
        ];
        for (const doc of documentosData) {
            await Documento.findOrCreate({ where: { Id_Documento: doc.Id_Documento }, defaults: doc });
        }

        console.log(' Catálogos base sincronizados.');

        console.log('\n Registrando Directivos y Académicos...');

        const academicosData = [
            {
                Numero_Personal: '0001',
                Nombre: 'Zoylo',
                ApellidoP: 'Morales',
                ApellidoM: 'Romero',
                CorreoInstitucional: 'fei@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: 1, // Director de facultad
                Id_Carrera: null
            },
            {
                Numero_Personal: '0002',
                Nombre: 'Minerva',
                ApellidoP: 'Reyes',
                ApellidoM: 'Félix',
                CorreoInstitucional: 'minreyes@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: 2,
                Id_Carrera: null
            },
            {
                Numero_Personal: '0004',
                Nombre: 'Lizbeth Alejandra',
                ApellidoP: 'Hernández',
                ApellidoM: 'González',
                CorreoInstitucional: 'lizhernandez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: 3,
                Id_Carrera: 1
            },

            {
                Numero_Personal: '0003',
                Nombre: 'Judith Guadalupe',
                ApellidoP: 'Montero',
                ApellidoM: 'Mora',
                CorreoInstitucional: 'jmontero@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 1
            },
            {
                Numero_Personal: '0005',
                Nombre: 'Jesús Roberto',
                ApellidoP: 'Méndez',
                ApellidoM: 'Ortíz',
                CorreoInstitucional: 'jmendez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 4
            },
            {
                Numero_Personal: '0006',
                Nombre: 'Christian',
                ApellidoP: 'Pérez',
                ApellidoM: 'Salazar',
                CorreoInstitucional: 'chperez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 5
            },
            {
                Numero_Personal: '0007',
                Nombre: 'Edgard Iván',
                ApellidoP: 'Benítez',
                ApellidoM: 'Guerrero',
                CorreoInstitucional: 'edbenitez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 1
            },
            {
                Numero_Personal: '0008',
                Nombre: 'José Fabián',
                ApellidoP: 'Muñoz',
                ApellidoM: 'Portilla',
                CorreoInstitucional: 'fmunoz@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 2
            },
            {
                Numero_Personal: '0009',
                Nombre: 'Carlos Alberto',
                ApellidoP: 'Ochoa',
                ApellidoM: 'Rivera',
                CorreoInstitucional: 'cochoa@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 3
            },
            {
                Numero_Personal: '0010',
                Nombre: 'Juan Carlos',
                ApellidoP: 'Pérez',
                ApellidoM: 'Arriaga',
                CorreoInstitucional: 'juaperez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 3
            },
            {
                Numero_Personal: '0011',
                Nombre: 'Jorge Octavio',
                ApellidoP: 'Ocharán',
                ApellidoM: 'Hernández',
                CorreoInstitucional: 'jocharan@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 1
            },
            {
                Numero_Personal: '0012',
                Nombre: 'María de los Ángeles',
                ApellidoP: 'Arenas',
                ApellidoM: 'Valdés',
                CorreoInstitucional: 'marenas@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 2
            },
            {
                Numero_Personal: '0013',
                Nombre: 'Ángel Juan',
                ApellidoP: 'Sánchez',
                ApellidoM: 'García',
                CorreoInstitucional: 'ajsanchez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 3
            },
            {
                Numero_Personal: '0014',
                Nombre: 'Fredy',
                ApellidoP: 'Castañeda',
                ApellidoM: 'Sánchez',
                CorreoInstitucional: 'fcastaneda@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 4
            },
            {
                Numero_Personal: '0015',
                Nombre: 'Gerardo',
                ApellidoP: 'Contreras',
                ApellidoM: 'Vega',
                CorreoInstitucional: 'gcontreras@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 5
            },
            {
                Numero_Personal: '0016',
                Nombre: 'Patricia',
                ApellidoP: 'Martínez',
                ApellidoM: 'Vázquez',
                CorreoInstitucional: 'pmartinez@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: 1
            },

            {
                Numero_Personal: '9999',
                Nombre: 'Profesor',
                ApellidoP: 'Prueba',
                ApellidoM: 'UV',
                CorreoInstitucional: 'docente.random@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Id_Rol: null,
                Id_Carrera: null
            }
        ];

        for (const ac of academicosData) {
            await Academico.findOrCreate({
                where: { Numero_Personal: ac.Numero_Personal },
                defaults: ac
            });
        }
        console.log(` Registrados ${academicosData.length} académicos (3 directivos + 14 profesores).`);

        console.log('\n Registrando Secretaria de Grupo...');
        await SecretariaGrupo.findOrCreate({
            where: { Numero_Personal: 'SEC_0001' },
            defaults: {
                Numero_Personal: 'SEC_0001',
                Nombre: 'Patricia',
                ApellidoP: 'Morales',
                ApellidoM: 'Ramos',
                CorreoInstitucional: 'secretaria.fei@uv.mx',
                Contrasenia: contraseniaEncriptada,
                Rol: 'Secretaria de Grupo'
            }
        });
        console.log(' Secretaria de Grupo registrada con éxito.');

        console.log('\n Creando grupos de Experiencia Recepcional...');

        const cursosData = [
            { Id_Curso: 1, NRC: '40211', Nombre: 'Experiencia Recepcional - Grupo 1 (Feb-Jul 2026)' },
            { Id_Curso: 2, NRC: '40215', Nombre: 'Experiencia Recepcional - Grupo 2 (Feb-Jul 2026)' },
            { Id_Curso: 3, NRC: '41302', Nombre: 'Experiencia Recepcional - Grupo 1 (Ago-Ene 2027)' },
            { Id_Curso: 4, NRC: '42510', Nombre: 'Experiencia Recepcional - Grupo 2 (Ago-Ene 2027)' },
            { Id_Curso: 5, NRC: '43104', Nombre: 'Experiencia Recepcional - Grupo 3 (Ago-Ene 2027)' }
        ];

        for (const curso of cursosData) {
            await CursoER.findOrCreate({
                where: { Id_Curso: curso.Id_Curso },
                defaults: curso
            });
        }

        const asignacionesDocenteData = [
            // Periodo 1 (Semestre Pasado: Feb-Jul 2026)
            { Id_Curso: 1, Numero_Personal: '0007', Id_Periodo: 1 },
            { Id_Curso: 2, Numero_Personal: '0008', Id_Periodo: 1 },
            // Periodo 2 (Semestre Actual: Ago-Ene 2027)
            { Id_Curso: 3, Numero_Personal: '0003', Id_Periodo: 2 },
            { Id_Curso: 4, Numero_Personal: '0009', Id_Periodo: 2 },
            { Id_Curso: 5, Numero_Personal: '0005', Id_Periodo: 2 }
        ];

        for (const asig of asignacionesDocenteData) {
            await AcademicoCursoER.findOrCreate({
                where: {
                    Id_Curso: asig.Id_Curso,
                    Numero_Personal: asig.Numero_Personal,
                    Id_Periodo: asig.Id_Periodo
                },
                defaults: asig
            });
        }
        console.log('✅ 5 Cursos creados y asignados a sus profesores (2 periodo pasado, 3 periodo actual).');

        console.log('\n Registrando 15 estudiantes...');

        const estudiantesData = [
            {
                Matricula: 'zs21010001',
                NombreCompleto: 'Ana María López Pérez',
                CorreoInstitucional: 'zs21010001@estudiantes.uv.mx',
                CorreoAlterno: 'ana.lopez@gmail.com',
                Id_Carrera: 1
            },
            {
                Matricula: 'zs21010002',
                NombreCompleto: 'María Fernanda Hernández Ruiz',
                CorreoInstitucional: 'zs21010002@estudiantes.uv.mx',
                CorreoAlterno: 'mafe.hernandez@hotmail.com',
                Id_Carrera: 1
            },
            {
                Matricula: 'zs21010003',
                NombreCompleto: 'Carlos Eduardo Sánchez Morales',
                CorreoInstitucional: 'zs21010003@estudiantes.uv.mx',
                CorreoAlterno: 'carlos.sanchez@gmail.com',
                Id_Carrera: 1
            },

            {
                Matricula: 'zs21020001',
                NombreCompleto: 'Alejandro Domínguez Cruz',
                CorreoInstitucional: 'zs21020001@estudiantes.uv.mx',
                CorreoAlterno: 'alex.dominguez@gmail.com',
                Id_Carrera: 2
            },
            {
                Matricula: 'zs21020002',
                NombreCompleto: 'Sofía Valentina Morales Rivas',
                CorreoInstitucional: 'zs21020002@estudiantes.uv.mx',
                CorreoAlterno: 'sofia.morales@outlook.com',
                Id_Carrera: 2
            },
            {
                Matricula: 'zs21020003',
                NombreCompleto: 'Rodrigo Gael Navarro Silva',
                CorreoInstitucional: 'zs21020003@estudiantes.uv.mx',
                CorreoAlterno: 'rodrigo.navarro@gmail.com',
                Id_Carrera: 2
            },

            {
                Matricula: 'zs21030001',
                NombreCompleto: 'Daniel Ricardo Soto Jiménez',
                CorreoInstitucional: 'zs21030001@estudiantes.uv.mx',
                CorreoAlterno: 'daniel.soto@gmail.com',
                Id_Carrera: 3
            },
            {
                Matricula: 'zs21030002',
                NombreCompleto: 'Valeria Jimena Gómez Vargas',
                CorreoInstitucional: 'zs21030002@estudiantes.uv.mx',
                CorreoAlterno: 'valeria.gomez@yahoo.com',
                Id_Carrera: 3
            },
            {
                Matricula: 'zs21030003',
                NombreCompleto: 'Emilio Sebastián Herrera Ortiz',
                CorreoInstitucional: 'zs21030003@estudiantes.uv.mx',
                CorreoAlterno: 'emilio.herrera@gmail.com',
                Id_Carrera: 3
            },

            {
                Matricula: 'zs21040001',
                NombreCompleto: 'Luis Fernando Castillo Luna',
                CorreoInstitucional: 'zs21040001@estudiantes.uv.mx',
                CorreoAlterno: 'luis.castillo@gmail.com',
                Id_Carrera: 4
            },
            {
                Matricula: 'zs21040002',
                NombreCompleto: 'Andrea Paola Ríos Mendoza',
                CorreoInstitucional: 'zs21040002@estudiantes.uv.mx',
                CorreoAlterno: 'andrea.rios@outlook.com',
                Id_Carrera: 4
            },
            {
                Matricula: 'zs21040003',
                NombreCompleto: 'Diego Armando Mendoza Cruz',
                CorreoInstitucional: 'zs21040003@estudiantes.uv.mx',
                CorreoAlterno: 'diego.mendoza@gmail.com',
                Id_Carrera: 4
            },

            {
                Matricula: 'zs21050001',
                NombreCompleto: 'Mariana Itzel Reyes Aguilar',
                CorreoInstitucional: 'zs21050001@estudiantes.uv.mx',
                CorreoAlterno: 'mariana.reyes@gmail.com',
                Id_Carrera: 5
            },
            {
                Matricula: 'zs21050002',
                NombreCompleto: 'Javier Ignacio Torres Flores',
                CorreoInstitucional: 'zs21050002@estudiantes.uv.mx',
                CorreoAlterno: 'javier.torres@gmail.com',
                Id_Carrera: 5
            },
            {
                Matricula: 'zs21050003',
                NombreCompleto: 'Brenda Guadalupe Castro Paredes',
                CorreoInstitucional: 'zs21050003@estudiantes.uv.mx',
                CorreoAlterno: 'brenda.castro@outlook.com',
                Id_Carrera: 5
            }
        ];

        for (const est of estudiantesData) {
            await Estudiante.findOrCreate({
                where: { Matricula: est.Matricula },
                defaults: est
            });
        }
        console.log(' 15 Estudiantes registrados (3 por carrera).');


        console.log('\n Inscribiendo estudiantes en los 5 grupos de ER (3 alumnos por grupo)...');

        const inscripcionesData = [
            { Id_Curso: 1, Matricula: 'zs21010001', Id_Periodo: 1 },
            { Id_Curso: 1, Matricula: 'zs21010002', Id_Periodo: 1 },
            { Id_Curso: 1, Matricula: 'zs21020001', Id_Periodo: 1 },

            { Id_Curso: 2, Matricula: 'zs21020002', Id_Periodo: 1 },
            { Id_Curso: 2, Matricula: 'zs21030001', Id_Periodo: 1 },
            { Id_Curso: 2, Matricula: 'zs21030002', Id_Periodo: 1 },

            { Id_Curso: 3, Matricula: 'zs21010003', Id_Periodo: 2 },
            { Id_Curso: 3, Matricula: 'zs21020003', Id_Periodo: 2 },
            { Id_Curso: 3, Matricula: 'zs21030003', Id_Periodo: 2 },

            { Id_Curso: 4, Matricula: 'zs21040001', Id_Periodo: 2 },
            { Id_Curso: 4, Matricula: 'zs21040002', Id_Periodo: 2 },
            { Id_Curso: 4, Matricula: 'zs21040003', Id_Periodo: 2 },

            { Id_Curso: 5, Matricula: 'zs21050001', Id_Periodo: 2 },
            { Id_Curso: 5, Matricula: 'zs21050002', Id_Periodo: 2 },
            { Id_Curso: 5, Matricula: 'zs21050003', Id_Periodo: 2 }
        ];

        for (const insc of inscripcionesData) {
            await CursoEREstudiante.findOrCreate({
                where: {
                    Id_Curso: insc.Id_Curso,
                    Matricula: insc.Matricula,
                    Id_Periodo: insc.Id_Periodo
                },
                defaults: insc
            });
        }
        console.log(' Inscripción de 15 alumnos completada (3 alumnos por grupo en su periodo correspondiente).');

        console.log('\n Creando 15 Trabajos Recepcionales (3 por carrera) y asignando estudiantes...');

        const trabajosRecepcionalesData = [
            {
                Id_TrabajoR: 101,
                Titulo: 'Sistema web para la gestión y seguimiento de residencias profesionales en la FEI',
                Modalidad: 'Práctico Técnico',
                Id_Carrera: 1,
                Id_Lugar: 1,
                Id_Estado: 5, // Finalizado
                Tomo: 1,
                Numero_Folio: 1,
                Folio: 'Tomo 1 - Folio 1',
                Fecha_defensa: new Date('2026-06-15T10:00:00'),
                Resultado: 'Aprobada por Unanimidad con Mención Honorífica',
                MatriculaAsignada: 'zs21010001',
                Directores: [
                    { Numero_Personal: '0007', Id_rol: 1 },
                    { Numero_Personal: '0003', Id_rol: 4 },
                    { Numero_Personal: '0011', Id_rol: 5 }
                ]
            },
            {
                Id_TrabajoR: 102,
                Titulo: 'Arquitectura de microservicios para la optimización de procesos de titulación universitaria',
                Modalidad: 'Tesis',
                Id_Carrera: 1,
                Id_Lugar: 2,
                Id_Estado: 3,
                Tomo: 1,
                Numero_Folio: 2,
                Folio: 'Tomo 1 - Folio 2',
                Fecha_defensa: new Date('2026-07-02T12:00:00'),
                Resultado: 'Aprobada por Unanimidad',
                MatriculaAsignada: 'zs21010002',
                Directores: [
                    { Numero_Personal: '0004', Id_rol: 1 },
                    { Numero_Personal: '0007', Id_rol: 2 },
                    { Numero_Personal: '0003', Id_rol: 6 }
                ]
            },
            {
                Id_TrabajoR: 103,
                Titulo: 'Aplicación móvil multiplataforma para el acompañamiento tutorial en educación superior',
                Modalidad: 'Tesina',
                Id_Carrera: 1,
                Id_Lugar: 3,
                Id_Estado: 2,
                Tomo: null,
                Numero_Folio: null,
                Folio: 'Pendiente',
                Fecha_defensa: null,
                Resultado: 'Pendiente',
                MatriculaAsignada: 'zs21010003',
                Directores: [
                    { Numero_Personal: '0011', Id_rol: 1 },
                    { Numero_Personal: '9998', Id_rol: 6 }
                ]
            },

            {
                Id_TrabajoR: 104,
                Titulo: 'Modelos de aprendizaje profundo para la detección oportuna de deserción escolar en el nivel superior',
                Modalidad: 'Tesis',
                Id_Carrera: 2,
                Id_Lugar: 1,
                Id_Estado: 5,
                Tomo: 1,
                Numero_Folio: 1,
                Folio: 'Tomo 1 - Folio 1',
                Fecha_defensa: new Date('2026-06-20T11:00:00'),
                Resultado: 'Aprobada por Unanimidad con Felicitación',
                MatriculaAsignada: 'zs21020001',
                Directores: [
                    { Numero_Personal: '0008', Id_rol: 1 },
                    { Numero_Personal: '0012', Id_rol: 2 },
                    { Numero_Personal: '0006', Id_rol: 3 }
                ]
            },
            {
                Id_TrabajoR: 105,
                Titulo: 'Análisis predictivo de rendimiento académico estudiantil mediante técnicas de ensamble y árboles de decisión',
                Modalidad: 'Práctico Técnico',
                Id_Carrera: 2,
                Id_Lugar: 4,
                Id_Estado: 3,
                Tomo: 1,
                Numero_Folio: 2,
                Folio: 'Tomo 1 - Folio 2',
                Fecha_defensa: new Date('2026-07-08T09:30:00'),
                Resultado: 'Aprobada por Mayoría',
                MatriculaAsignada: 'zs21020002',
                Directores: [
                    { Numero_Personal: '0012', Id_rol: 1 },
                    { Numero_Personal: '0008', Id_rol: 6 }
                ]
            },
            {
                Id_TrabajoR: 106,
                Titulo: 'Minería de texto y procesamiento de lenguaje natural aplicado a la evaluación docente universitaria',
                Modalidad: 'Monografía',
                Id_Carrera: 2,
                Id_Lugar: 2,
                Id_Estado: 1,
                Tomo: null,
                Numero_Folio: null,
                Folio: 'Pendiente',
                Fecha_defensa: null,
                Resultado: 'Pendiente',
                MatriculaAsignada: 'zs21020003',
                Directores: [
                    { Numero_Personal: '0008', Id_rol: 1 }
                ]
            },

            {
                Id_TrabajoR: 107,
                Titulo: 'Diseño e implementación de una red definida por software (SDN) para laboratorios de cómputo universitarios',
                Modalidad: 'Práctico Técnico',
                Id_Carrera: 3,
                Id_Lugar: 5,
                Id_Estado: 5,
                Tomo: 1,
                Numero_Folio: 1,
                Folio: 'Tomo 1 - Folio 1',
                Fecha_defensa: new Date('2026-06-25T16:00:00'),
                Resultado: 'Aprobada por Unanimidad',
                MatriculaAsignada: 'zs21030001',
                Directores: [
                    { Numero_Personal: '0009', Id_rol: 1 },
                    { Numero_Personal: '0010', Id_rol: 4 },
                    { Numero_Personal: '0013', Id_rol: 5 }
                ]
            },
            {
                Id_TrabajoR: 108,
                Titulo: 'Evaluación de vulnerabilidades y hardening de servidores web en entornos de infraestructura crítica',
                Modalidad: 'Reporte Técnico',
                Id_Carrera: 3,
                Id_Lugar: 3,
                Id_Estado: 3,
                Tomo: 1,
                Numero_Folio: 2,
                Folio: 'Tomo 1 - Folio 2',
                Fecha_defensa: new Date('2026-07-15T13:00:00'),
                Resultado: 'Aprobada por Unanimidad',
                MatriculaAsignada: 'zs21030002',
                Directores: [
                    { Numero_Personal: '0010', Id_rol: 1 },
                    { Numero_Personal: '0013', Id_rol: 2 }
                ]
            },
            {
                Id_TrabajoR: 109,
                Titulo: 'Implementación de arquitectura Zero Trust en redes de campus universitario',
                Modalidad: 'Monografía',
                Id_Carrera: 3,
                Id_Lugar: 2,
                Id_Estado: 2,
                Tomo: null,
                Numero_Folio: null,
                Folio: 'Pendiente',
                Fecha_defensa: null,
                Resultado: 'Pendiente',
                MatriculaAsignada: 'zs21030003',
                Directores: [
                    { Numero_Personal: '0013', Id_rol: 1 },
                    { Numero_Personal: '0009', Id_rol: 6 }
                ]
            },

            {
                Id_TrabajoR: 110,
                Titulo: 'Plan estratégico de tecnologías de la información para la transformación digital en dependencias públicas',
                Modalidad: 'Práctico Educativo',
                Id_Carrera: 4,
                Id_Lugar: 1,
                Id_Estado: 5,
                Tomo: 1,
                Numero_Folio: 1,
                Folio: 'Tomo 1 - Folio 1',
                Fecha_defensa: new Date('2026-06-28T10:00:00'),
                Resultado: 'Aprobada por Unanimidad',
                MatriculaAsignada: 'zs21040001',
                Directores: [
                    { Numero_Personal: '0005', Id_rol: 1 },
                    { Numero_Personal: '0014', Id_rol: 3 },
                    { Numero_Personal: '0007', Id_rol: 5 }
                ]
            },
            {
                Id_TrabajoR: 111,
                Titulo: 'Gobierno de TI basado en COBIT 2019 para la gestión de incidentes y continuidad operativa',
                Modalidad: 'Tesina',
                Id_Carrera: 4,
                Id_Lugar: 4,
                Id_Estado: 3,
                Tomo: 1,
                Numero_Folio: 2,
                Folio: 'Tomo 1 - Folio 2',
                Fecha_defensa: new Date('2026-07-20T17:00:00'),
                Resultado: 'Aprobada por Unanimidad',
                MatriculaAsignada: 'zs21040002',
                Directores: [
                    { Numero_Personal: '0014', Id_rol: 1 },
                    { Numero_Personal: '0005', Id_rol: 2 }
                ]
            },
            {
                Id_TrabajoR: 112,
                Titulo: 'Diseño de un sistema de Business Intelligence para la toma de decisiones directivas en la FEI',
                Modalidad: 'Práctico Técnico',
                Id_Carrera: 4,
                Id_Lugar: 2,
                Id_Estado: 1,
                Tomo: null,
                Numero_Folio: null,
                Folio: 'Pendiente',
                Fecha_defensa: null,
                Resultado: 'Pendiente',
                MatriculaAsignada: 'zs21040003',
                Directores: [
                    { Numero_Personal: '0005', Id_rol: 1 }
                ]
            },

            {
                Id_TrabajoR: 113,
                Titulo: 'Modelación estadística espacial y series de tiempo del dengue en la zona conurbada de Veracruz',
                Modalidad: 'Tesis',
                Id_Carrera: 5,
                Id_Lugar: 1,
                Id_Estado: 5,
                Tomo: 1,
                Numero_Folio: 1,
                Folio: 'Tomo 1 - Folio 1',
                Fecha_defensa: new Date('2026-06-30T09:00:00'),
                Resultado: 'Aprobada por Unanimidad con Mención Honorífica',
                MatriculaAsignada: 'zs21050001',
                Directores: [
                    { Numero_Personal: '0006', Id_rol: 1 },
                    { Numero_Personal: '0015', Id_rol: 3 },
                    { Numero_Personal: '0008', Id_rol: 5 }
                ]
            },
            {
                Id_TrabajoR: 114,
                Titulo: 'Análisis de supervivencia multivariado para la estimación de riesgos en tratamientos médicos hospitalarios',
                Modalidad: 'Tesis',
                Id_Carrera: 5,
                Id_Lugar: 3,
                Id_Estado: 3,
                Tomo: 1,
                Numero_Folio: 2,
                Folio: 'Tomo 1 - Folio 2',
                Fecha_defensa: new Date('2026-07-22T11:30:00'),
                Resultado: 'Aprobada por Unanimidad',
                MatriculaAsignada: 'zs21050002',
                Directores: [
                    { Numero_Personal: '0015', Id_rol: 1 },
                    { Numero_Personal: '0006', Id_rol: 2 }
                ]
            },
            {
                Id_TrabajoR: 115,
                Titulo: 'Diseño y calibración de muestreos bi-etápicos para encuestas socioeconómicas del Estado de Veracruz',
                Modalidad: 'Práctico Técnico',
                Id_Carrera: 5,
                Id_Lugar: 4,
                Id_Estado: 2,
                Tomo: null,
                Numero_Folio: null,
                Folio: 'Pendiente',
                Fecha_defensa: null,
                Resultado: 'Pendiente',
                MatriculaAsignada: 'zs21050003',
                Directores: [
                    { Numero_Personal: '0006', Id_rol: 1 },
                    { Numero_Personal: '0015', Id_rol: 6 }
                ]
            }
        ];

        for (const tr of trabajosRecepcionalesData) {
            const [trabajoCreado] = await TrabajoRecepcional.findOrCreate({
                where: { Id_TrabajoR: tr.Id_TrabajoR },
                defaults: {
                    Id_TrabajoR: tr.Id_TrabajoR,
                    Titulo: tr.Titulo,
                    Folio: tr.Folio,
                    Tomo: tr.Tomo,
                    Numero_Folio: tr.Numero_Folio,
                    Modalidad: tr.Modalidad,
                    Fecha_defensa: tr.Fecha_defensa,
                    Resultado: tr.Resultado,
                    Id_Carrera: tr.Id_Carrera,
                    Id_Lugar: tr.Id_Lugar,
                    Id_Estado: tr.Id_Estado
                }
            });

            await EstudianteTrabajo.findOrCreate({
                where: {
                    Id_TrabajoR: trabajoCreado.Id_TrabajoR,
                    Matricula: tr.MatriculaAsignada
                },
                defaults: {
                    Id_TrabajoR: trabajoCreado.Id_TrabajoR,
                    Matricula: tr.MatriculaAsignada
                }
            });

            if (tr.Directores && tr.Directores.length > 0) {
                for (const part of tr.Directores) {
                    await ParticipantesTrabajo.findOrCreate({
                        where: {
                            Id_TrabajoR: trabajoCreado.Id_TrabajoR,
                            Numero_Personal: part.Numero_Personal,
                            Id_rol: part.Id_rol
                        },
                        defaults: {
                            Id_TrabajoR: trabajoCreado.Id_TrabajoR,
                            Numero_Personal: part.Numero_Personal,
                            Id_rol: part.Id_rol
                        }
                    });
                }
            }

            // Registrar trazabilidad inicial del estado del trabajo
            await EstadoTrabajoRecepcional.findOrCreate({
                where: {
                    Id_TrabajoR: trabajoCreado.Id_TrabajoR,
                    Id_Estado: trabajoCreado.Id_Estado
                },
                defaults: {
                    Id_TrabajoR: trabajoCreado.Id_TrabajoR,
                    Id_Estado: trabajoCreado.Id_Estado,
                    Fecha: new Date()
                }
            });
        }

        console.log(' 15 Trabajos Recepcionales creados, asignados a los 15 estudiantes y con jurado académico.');

        // Participantes externos de ejemplo
        const [externo1] = await ParticipanteExterno.findOrCreate({
            where: { CorreoElectronico: 'dr.mendoza@cinvestav.mx' },
            defaults: {
                Nombre: 'Arturo',
                ApellidoP: 'Mendoza',
                ApellidoM: 'Vázquez',
                CorreoElectronico: 'dr.mendoza@cinvestav.mx',
                Institucion: 'CINVESTAV - Unidad Guadalajara'
            }
        });

        const [externo2] = await ParticipanteExterno.findOrCreate({
            where: { CorreoElectronico: 'claudia.garcia@oracle.com' },
            defaults: {
                Nombre: 'Claudia',
                ApellidoP: 'García',
                ApellidoM: 'Romero',
                CorreoElectronico: 'claudia.garcia@oracle.com',
                Institucion: 'Oracle México'
            }
        });

        // Asignar codirector externo al trabajo #1 y sinodal al trabajo #2
        await ParticipantesExternosTrabajo.findOrCreate({
            where: {
                Id_TrabajoR: 1,
                Id_ParticipanteExt: externo1.Id_ParticipanteExt
            },
            defaults: {
                Id_TrabajoR: 1,
                Id_ParticipanteExt: externo1.Id_ParticipanteExt,
                Id_rol: 2 // Codirector
            }
        });

        await ParticipantesExternosTrabajo.findOrCreate({
            where: {
                Id_TrabajoR: 2,
                Id_ParticipanteExt: externo2.Id_ParticipanteExt
            },
            defaults: {
                Id_TrabajoR: 2,
                Id_ParticipanteExt: externo2.Id_ParticipanteExt,
                Id_rol: 6 // Sinodal
            }
        });

        console.log(' Participantes externos y asignaciones de prueba inicializados.');

        console.log('\n========================================================================');
        console.log(' SEEDER DE DATOS INICIALES FINALIZADO EXITOSAMENTE');
        console.log('========================================================================');
        console.log('Resumen de datos generados:');
        console.log(' - Directivos: Zoylo (Director Fac.), Lizbeth (Dir. Carrera), Minerva (Sec. Fac.)');
        console.log(' - Secretaria de Grupo: Patricia Morales (SEC_0001)');
        console.log(' - Académicos Profesores: 13 profesores + 1 profesor random (total: 17 académicos)');
        console.log(' - Grupos de ER: 5 cursos (2 en Feb-Jul 2026, 3 en Ago-Ene 2027)');
        console.log(' - Estudiantes: 15 alumnos (3 por cada una de las 5 carreras)');
        console.log(' - Asignación ER: Exactamente 3 alumnos por grupo');
        console.log(' - Trabajos Recepcionales: 15 trabajos (3 por carrera, 1 por estudiante)');
        console.log('========================================================================\n');

        process.exit(0);
    } catch (error) {
        console.error(' Error ejecutando el seeder de datos iniciales:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    seedDatosIniciales();
}

module.exports = seedDatosIniciales;
